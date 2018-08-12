import request from 'supertest';

import { createUserRepository } from './repository/user';
import { createEntryRepository } from './repository/entry';
import { createCoupleRepository } from './repository/couple';
import { createServer, startServer } from './server';
import { temporaryToken, verifyToken } from './authentication';

const graphqlRequest = httpServer =>
  request(httpServer)
    .post('/graphql')
    .set('Accept', 'application/json');

const parseGraphqlResponse = res => JSON.parse(res.text).data;
const parseGraphqlError = res => JSON.parse(res.text).errors;

describe('GraphQL server', () => {
  let userRepository;
  let coupleRepository;
  let entryRepository;

  let server;

  beforeEach(() => {
    userRepository = createUserRepository();
    coupleRepository = createCoupleRepository();
    entryRepository = createEntryRepository();

    server = createServer({
      userRepository,
      coupleRepository,
      entryRepository,
    });
  });

  afterEach(() => {
    server.stop();
  });

  it('Does not have a CORS header', () => {
    return startServer(server).then(({ httpServer }) =>
      graphqlRequest(httpServer)
        .send({ query: `{}` })
        .then(({ headers }) =>
          expect(headers['access-control-allow-origin']).toBeUndefined()
        )
    );
  });

  describe('entries query', () => {
    it('returns the entries of the requested year and month with the entries query', () => {
      coupleRepository.createCouple({ id: 'couple', creatorId: 'author' });

      entryRepository.setEntry({
        year: 2018,
        month: 1,
        date: 1,
        authorId: 'author',
        coupleId: 'couple',
        content: 'Entry 1',
      });
      entryRepository.setEntry({
        year: 2018,
        month: 2,
        date: 1,
        authorId: 'author',
        coupleId: 'couple',
        content: 'Entry 2',
      });

      return startServer(server).then(({ httpServer }) =>
        graphqlRequest(httpServer)
          .set('Authorization', `Bearer ${temporaryToken('author')}`)
          .send({
            query: `
            {
              entries(year: 2018, month: 1) {
                content
              }
            }
          `,
          })
          .expect(200)
          .then(parseGraphqlResponse)
          .then(({ entries }) =>
            expect(entries).toEqual([{ content: 'Entry 1' }])
          )
      );
    });

    it('returns only the entries of the people in the couple with the entries query', () => {
      coupleRepository.createCouple({
        id: 'couple',
        creatorId: 'firstUser',
        otherId: 'secondUser',
      });

      entryRepository.setEntry({
        year: 2018,
        month: 1,
        date: 1,
        authorId: 'firstUser',
        coupleId: 'couple',
        content: 'Entry 1',
      });
      entryRepository.setEntry({
        year: 2018,
        month: 1,
        date: 1,
        authorId: 'secondUser',
        coupleId: 'couple',
        content: 'Entry 2',
      });
      entryRepository.setEntry({
        year: 2018,
        month: 1,
        date: 1,
        authorId: 'thirdUser',
        content: 'Entry 3',
      });

      return startServer(server).then(({ httpServer }) =>
        graphqlRequest(httpServer)
          .set('Authorization', `Bearer ${temporaryToken('firstUser')}`)
          .send({
            query: `
            {
              entries(year: 2018, month: 1) {
                content
              }
            }
          `,
          })
          .expect(200)
          .then(parseGraphqlResponse)
          .then(({ entries }) =>
            expect(entries).toEqual([
              { content: 'Entry 1' },
              { content: 'Entry 2' },
            ])
          )
      );
    });
  });

  describe('myCouple query', () => {
    it('returns UNAUTHENTICATED error if user is not logged in', () => {
      return startServer(server).then(({ httpServer }) =>
        graphqlRequest(httpServer)
          .send({
            query: `
            {
              myCouple {
                id
              }
            }
          `,
          })
          .expect(200)
          .then(parseGraphqlError)
          .then(errors =>
            expect(errors[0].extensions.code).toBe('UNAUTHENTICATED')
          )
      );
    });

    it('returns the couple of the logged in user', () => {
      const coupleId = 'coupleId';
      const userId = 'creatorId';
      coupleRepository.createCouple({
        id: coupleId,
        creatorId: userId,
        otherId: 'otherId',
      });

      return startServer(server).then(({ httpServer }) =>
        graphqlRequest(httpServer)
          .set('Authorization', `Bearer ${temporaryToken(userId)}`)
          .send({
            query: `
            {
              myCouple {
                id
              }
            }
          `,
          })
          .expect(200)
          .then(parseGraphqlResponse)
          .then(({ myCouple }) => expect(myCouple).toEqual({ id: coupleId }))
      );
    });
  });

  describe('createUser mutation', () => {
    it('returns a successfully created user and updates the database', () => {
      const user = {
        username: 'username',
        name: 'name',
        password: 'password',
        color: 'color',
      };

      return startServer(server).then(({ httpServer }) =>
        graphqlRequest(httpServer)
          .send({
            query: `
            mutation {
              createUser(
                username: "username"
                name: "name"
                password: "password"
                color: "color"
              ) {
                username
                name
                password
                color
              }
            }
          `,
          })
          .expect(200)
          .then(parseGraphqlResponse)
          .then(({ createUser: newUser }) => {
            expect(newUser).toEqual(user);
            expect(userRepository.getUsers()).toHaveLength(1);
          })
      );
    });

    it('returns null if a username is taken when trying to create user', () => {
      const user = {
        username: 'username',
        name: 'name',
        password: 'password',
        color: 'color',
      };
      userRepository.createUser(user);

      return startServer(server).then(({ httpServer }) =>
        graphqlRequest(httpServer)
          .send({
            query: `
            mutation {
              createUser(
                username: "username"
                name: "anotherName"
                password: "anotherPassword"
                color: "anotherColor"
              ) {
                username
                name
                password
                color
              }
            }
          `,
          })
          .expect(200)
          .then(parseGraphqlResponse)
          .then(({ createUser: newUser }) => {
            expect(newUser).toBeNull();
            expect(userRepository.getUsers()).toHaveLength(1);
          })
      );
    });
  });

  describe('login mutation', () => {
    it('returns a jwt token containing user id on successfull login', () => {
      const user = {
        id: 'userId',
        username: 'username',
        name: 'name',
        password: 'password',
        color: 'color',
      };
      userRepository.createUser(user);

      return startServer(server).then(({ httpServer }) =>
        graphqlRequest(httpServer)
          .send({
            query: `
            mutation {
              login(username: "username", password: "password")
            }
          `,
          })
          .expect(200)
          .then(parseGraphqlResponse)
          .then(({ login: token }) =>
            verifyToken(token, userId => {
              return expect(userId).toEqual('userId');
            })
          )
      );
    });

    it('returns null on failed login', () => {
      return startServer(server).then(({ httpServer }) =>
        graphqlRequest(httpServer)
          .send({
            query: `
            mutation {
              login(username: "username", password: "password")
            }
          `,
          })
          .expect(200)
          .then(parseGraphqlResponse)
          .then(({ login: token }) => expect(token).toBeNull())
      );
    });
  });

  describe('setEntry mutation', () => {
    it('returns the new entry and updates the database', () => {
      const entry = {
        year: 2018,
        month: 1,
        date: 1,
        content: 'text',
      };
      return startServer(server).then(({ httpServer }) =>
        graphqlRequest(httpServer)
          .set('Authorization', `Bearer ${temporaryToken('userId')}`)
          .send({
            query: `
            mutation {
              setEntry(year: 2018, month: 1, date: 1, content: "text") {
                year
                month
                date
                content
              }
            }
          `,
          })
          .expect(200)
          .then(parseGraphqlResponse)
          .then(({ setEntry: insertedEntry }) => {
            expect(insertedEntry).toEqual(entry);
            expect(entryRepository.getEntries()).toHaveLength(1);
          })
      );
    });

    it('returns UNAUTHENTICATED error and does not update the database if not logged in', () => {
      return startServer(server).then(({ httpServer }) =>
        graphqlRequest(httpServer)
          .send({
            query: `
            mutation {
              setEntry(year: 2018, month: 1, date: 1, content: "text") {
                year
                month
                date
                content
              }
            }
          `,
          })
          .expect(200)
          .then(parseGraphqlError)
          .then(errors => {
            expect(errors[0].extensions.code).toBe('UNAUTHENTICATED');
            expect(entryRepository.getEntries()).toHaveLength(0);
          })
      );
    });
  });

  describe('createCouple mutation', () => {
    it('returns a hydrated couple after creating it', () => {
      userRepository.createUser({ id: 'userId' });

      return startServer(server).then(({ httpServer }) =>
        graphqlRequest(httpServer)
          .set('Authorization', `Bearer ${temporaryToken('userId')}`)
          .send({
            query: `
            mutation {
              createCouple {
                creator {
                  id
                }
              }
            }
          `,
          })
          .expect(200)
          .then(parseGraphqlResponse)
          .then(({ createCouple: couple }) => {
            expect(couple).toEqual({ creator: { id: 'userId' } });
            expect(coupleRepository.getCouples()).toHaveLength(1);
          })
      );
    });

    it('returns UNAUTHENTICATED error and does not create a couple if the user is not logged in', () => {
      userRepository.createUser({ id: 'userId' });

      return startServer(server).then(({ httpServer }) =>
        graphqlRequest(httpServer)
          .send({
            query: `
            mutation {
              createCouple {
                creator {
                  id
                }
              }
            }
          `,
          })
          .expect(200)
          .then(parseGraphqlError)
          .then(errors => {
            expect(errors[0].extensions.code).toBe('UNAUTHENTICATED');
            expect(coupleRepository.getCouples()).toHaveLength(0);
          })
      );
    });

    it('returns null and does not create a couple if the user is already in a couple', () => {
      coupleRepository.createCouple({ id: 'coupleId', creatorId: 'userId' });

      return startServer(server).then(({ httpServer }) =>
        graphqlRequest(httpServer)
          .set('Authorization', `Bearer ${temporaryToken('userId')}`)
          .send({
            query: `
            mutation {
              createCouple {
                creator {
                  id
                }
              }
            }
          `,
          })
          .expect(200)
          .then(parseGraphqlResponse)
          .then(({ createCouple: couple }) => {
            expect(couple).toBeNull();
            expect(coupleRepository.getCouples()).toHaveLength(1);
          })
      );
    });
  });

  describe('joinCoupleOfUser mutation', () => {
    it('returns the couple after joining it successfully', () => {
      userRepository.createUser({ id: 'creatorId' });
      userRepository.createUser({ id: 'userId' });
      coupleRepository.createCouple({ id: 'coupleId', creatorId: 'creatorId' });

      return startServer(server).then(({ httpServer }) =>
        graphqlRequest(httpServer)
          .set('Authorization', `Bearer ${temporaryToken('userId')}`)
          .send({
            query: `
            mutation {
              joinCoupleOfUser(userId: "creatorId") {
                id
                creator {
                  id
                }
                other {
                  id
                }
              }
            }
          `,
          })
          .expect(200)
          .then(parseGraphqlResponse)
          .then(({ joinCoupleOfUser: couple }) => {
            expect(couple).toEqual({
              id: 'coupleId',
              creator: { id: 'creatorId' },
              other: { id: 'userId' },
            });
            expect(coupleRepository.getCouples()).toHaveLength(1);
            expect(coupleRepository.getCouples()[0].otherId).toEqual('userId');
          })
      );
    });

    it('returns null and does not update the database if a couple is full', () => {
      coupleRepository.createCouple({
        id: 'coupleId',
        creatorId: 'creatorId',
        otherId: 'anotherUserId',
      });

      return startServer(server).then(({ httpServer }) =>
        graphqlRequest(httpServer)
          .set('Authorization', `Bearer ${temporaryToken('userId')}`)
          .send({
            query: `
            mutation {
              joinCoupleOfUser(userId: "creatorId") {
                id
                creator {
                  id
                }
                other {
                  id
                }
              }
            }
          `,
          })
          .expect(200)
          .then(parseGraphqlResponse)
          .then(({ joinCoupleOfUser: couple }) => {
            expect(couple).toBeNull();
            expect(coupleRepository.getCouples()).toHaveLength(1);
            expect(coupleRepository.getCouples()[0].otherId).toEqual(
              'anotherUserId'
            );
          })
      );
    });

    it('returns UNAUTHENTICATED error and does not update the couple if user is not logged in', () => {
      coupleRepository.createCouple({
        id: 'coupleId',
        creatorId: 'creatorId',
      });

      return startServer(server).then(({ httpServer }) =>
        graphqlRequest(httpServer)
          .send({
            query: `
            mutation {
              joinCoupleOfUser(userId: "creatorId") {
                id
                creator {
                  id
                }
                other {
                  id
                }
              }
            }
          `,
          })
          .expect(200)
          .then(parseGraphqlError)
          .then(errors => {
            expect(errors[0].extensions.code).toBe('UNAUTHENTICATED');
            expect(coupleRepository.getCouples()).toHaveLength(1);
            expect(coupleRepository.getCouples()[0].otherId).toBeUndefined();
          })
      );
    });
  });
});
