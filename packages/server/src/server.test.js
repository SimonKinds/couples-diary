import request from 'supertest';

import { createInMemoryDbInstance } from './database';
import { createUserRepository } from './repository/user';
import { createEntryRepository } from './repository/entry';
import { createCoupleRepository } from './repository/couple';
import { createServer, startServer } from './server';
import { temporaryToken, verifyToken } from './authentication';

const emptyQuery = { query: '{}' };

const parseGraphqlResponse = res => JSON.parse(res.text).data;
const parseGraphqlError = res => JSON.parse(res.text).errors;

const simplePasswordStrategy = {
  hashPassword: pw => Promise.resolve(pw),
  doesPasswordMatchHash: (pw, hash) => Promise.resolve(pw === hash),
};

describe('GraphQL server', () => {
  let userRepository;
  let coupleRepository;
  let entryRepository;

  let server;
  let httpServer;

  const graphqlRequest = (suppliedHttpServer = null) =>
    request(suppliedHttpServer === null ? httpServer : suppliedHttpServer)
      .post('/graphql')
      .set('Accept', 'application/json');

  beforeEach(() => {
    const db = createInMemoryDbInstance();
    return Promise.all([
      createUserRepository(db),
      createCoupleRepository(db),
      createEntryRepository(db),
    ]).then(([userRepo, coupleRepo, entryRepo]) => {
      userRepository = userRepo;
      coupleRepository = coupleRepo;
      entryRepository = entryRepo;

      server = createServer({
        userRepository,
        coupleRepository,
        entryRepository,
        passwordStrategy: simplePasswordStrategy,
      });

      return startServer(server).then(vals => (httpServer = vals.httpServer));
    });
  });

  afterEach(() => {
    server.stop();
  });

  it('Does not have a CORS header', () =>
    graphqlRequest()
      .send(emptyQuery)
      .then(({ headers }) =>
        expect(headers['access-control-allow-origin']).toBeUndefined()
      ));

  it('Does not have a x-powered-by header', () =>
    graphqlRequest()
      .send(emptyQuery)
      .then(({ headers }) => expect(headers['x-powered-by']).toBeUndefined()));

  it('Uses gzip compression if accepted', () =>
    graphqlRequest()
      .set('accept-encoding', 'gzip')
      .send(emptyQuery)
      .then(({ headers }) => expect(headers['content-encoding']).toBe('gzip')));

  it('Does not use gzip compression if not accepted', () =>
    graphqlRequest()
      .set('accept-encoding', null)
      .send(emptyQuery)
      .then(({ headers }) =>
        expect(headers['content-encoding']).toBeUndefined()
      ));

  describe('entries query', () => {
    it('returns the entries of the requested year and month with the entries query', () =>
      Promise.all([
        coupleRepository.createCouple({ id: 'couple', creatorId: 'author' }),
        entryRepository.createEntry({
          year: 2018,
          month: 1,
          date: 1,
          authorId: 'author',
          coupleId: 'couple',
          content: 'Entry 1',
        }),
        entryRepository.createEntry({
          year: 2018,
          month: 2,
          date: 1,
          authorId: 'author',
          coupleId: 'couple',
          content: 'Entry 2',
        }),
      ]).then(() =>
        graphqlRequest()
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
      ));

    it('returns only the entries of the people in the couple with the entries query', () =>
      Promise.all([
        coupleRepository.createCouple({
          id: 'couple',
          creatorId: 'firstUser',
          otherId: 'secondUser',
        }),

        entryRepository.createEntry({
          year: 2018,
          month: 1,
          date: 1,
          authorId: 'firstUser',
          coupleId: 'couple',
          content: 'Entry 1',
        }),
        entryRepository.createEntry({
          year: 2018,
          month: 1,
          date: 1,
          authorId: 'secondUser',
          coupleId: 'couple',
          content: 'Entry 2',
        }),
        entryRepository.createEntry({
          year: 2018,
          month: 1,
          date: 1,
          authorId: 'thirdUser',
          content: 'Entry 3',
        }),
      ]).then(() =>
        graphqlRequest()
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
      ));
  });

  describe('myCouple query', () => {
    it('returns UNAUTHENTICATED error if user is not logged in', () =>
      graphqlRequest()
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
        ));

    it('returns the couple of the logged in user', () => {
      const coupleId = 'coupleId';
      const userId = 'creatorId';

      return coupleRepository
        .createCouple({
          id: coupleId,
          creatorId: userId,
          otherId: 'otherId',
        })
        .then(() =>
          graphqlRequest()
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

  describe('me query', () => {
    it('returns the currently logged in user', () => {
      const userId = 'userId';
      return userRepository.createUser({ id: userId }).then(() =>
        graphqlRequest()
          .set('Authorization', `Bearer ${temporaryToken(userId)}`)
          .send({ query: `{ me { id } }` })
          .expect(200)
          .then(parseGraphqlResponse)
          .then(({ me }) => expect(me).toEqual({ id: userId }))
      );
    });

    it('returns UNAUTHENTICATED error code if the user has token but ID is not found', () =>
      graphqlRequest()
        .set('Authorization', `Bearer ${temporaryToken('id')}`)
        .send({ query: `{ me { id } }` })
        .expect(200)
        .then(parseGraphqlError)
        .then(errors =>
          expect(errors[0].extensions.code).toBe('UNAUTHENTICATED')
        ));
  });

  describe('createUser mutation', () => {
    it('returns a successfully created user and updates the database', () => {
      const user = {
        username: 'username',
        name: 'name',
        password: 'password',
        color: 'color',
      };

      return graphqlRequest()
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
          return userRepository
            .getUsers()
            .then(users => expect(users).toHaveLength(1));
        });
    });

    it('returns null if a username is taken when trying to create user', () => {
      const user = {
        username: 'username',
        name: 'name',
        password: 'password',
        color: 'color',
      };
      return userRepository.createUser(user).then(() =>
        graphqlRequest()
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
            return userRepository
              .getUsers()
              .then(users => expect(users).toHaveLength(1));
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
      return userRepository.createUser(user).then(() =>
        graphqlRequest()
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

    it('returns null on failed login', () =>
      graphqlRequest()
        .send({
          query: `
            mutation {
              login(username: "username", password: "password")
            }
          `,
        })
        .expect(200)
        .then(parseGraphqlResponse)
        .then(({ login: token }) => expect(token).toBeNull()));
  });

  describe('setEntry mutation', () => {
    it('returns the new entry and updates the database', () => {
      const userId = 'author';
      const entry = {
        year: 2018,
        month: 1,
        date: 1,
        content: 'text',
      };

      return Promise.all([
        userRepository.createUser({ id: userId }),
        coupleRepository.createCouple({ id: 'couple', creatorId: userId }),
      ]).then(() =>
        graphqlRequest()
          .set('Authorization', `Bearer ${temporaryToken(userId)}`)
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
            return entryRepository
              .getEntries()
              .then(entries => expect(entries).toHaveLength(1));
          })
      );
    });

    it('sets the date of when it was created', () => {
      const userId = 'author';

      return Promise.all([
        userRepository.createUser({ id: userId }),
        coupleRepository.createCouple({ id: 'couple', creatorId: userId }),
      ]).then(() =>
        graphqlRequest()
          .set('Authorization', `Bearer ${temporaryToken(userId)}`)
          .send({
            query: `
            mutation {
              setEntry(year: 2018, month: 1, date: 1, content: "text") {
                createdAt
              }
            }
          `,
          })
          .expect(200)
          .then(parseGraphqlResponse)
          .then(({ setEntry: { createdAt } }) => {
            const now = new Date().getTime();
            const oneSecond = 1000;
            /**
             * give a 2s range of valid values,
             * as we can't be sure how long the test takes.
             * And if it's slightly incorrect it doesn't really matter
             */
            expect(createdAt).toBeGreaterThanOrEqual(now - oneSecond);
            expect(createdAt).toBeLessThanOrEqual(now + oneSecond);
          })
      );
    });

    it('does not update the createdAt field when setting new value', () => {
      const userId = 'author';
      const originalCreatedAt = new Date();

      return Promise.all([
        userRepository.createUser({ id: userId }),

        coupleRepository.createCouple({ id: 'couple', creatorId: userId }),

        entryRepository.createEntry({
          year: 2018,
          month: 1,
          date: 1,
          content: 'text',
          coupleId: 'couple',
          authorId: userId,
          createdAt: originalCreatedAt,
        }),
      ]).then(() =>
        graphqlRequest()
          .set('Authorization', `Bearer ${temporaryToken(userId)}`)
          .send({
            query: `
            mutation {
              setEntry(year: 2018, month: 1, date: 1, content: "new text") {
                content
                createdAt
              }
            }
          `,
          })
          .expect(200)
          .then(parseGraphqlResponse)
          .then(({ setEntry: { createdAt, content } }) => {
            expect(content).toBe('new text');
            expect(createdAt).toBe(originalCreatedAt.getTime());
          })
      );
    });

    it('returns UNAUTHENTICATED error and does not update the database if not logged in', () =>
      graphqlRequest()
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
          return entryRepository
            .getEntries()
            .then(entries => expect(entries).toHaveLength(0));
        }));

    it('throws an error if not in a couple', () =>
      userRepository.createUser({ id: 'userId' }).then(() =>
        graphqlRequest()
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
          .then(parseGraphqlError)
          .then(errors => {
            expect(errors).toHaveLength(1);
            return entryRepository
              .getEntries()
              .then(entries => expect(entries).toHaveLength(0));
          })
      ));
  });

  describe('createCouple mutation', () => {
    it('returns a hydrated couple after creating it', () =>
      userRepository.createUser({ id: 'userId' }).then(() =>
        graphqlRequest()
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
            return coupleRepository
              .getCouples()
              .then(couples => expect(couples).toHaveLength(1));
          })
      ));

    it('returns UNAUTHENTICATED error and does not create a couple if the user is not logged in', () =>
      userRepository.createUser({ id: 'userId' }).then(() =>
        graphqlRequest()
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
            return coupleRepository
              .getCouples()
              .then(couples => expect(couples).toHaveLength(0));
          })
      ));

    it('returns null and does not create a couple if the user is already in a couple', () =>
      coupleRepository
        .createCouple({ id: 'coupleId', creatorId: 'userId' })
        .then(() =>
          graphqlRequest()
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
              return coupleRepository
                .getCouples()
                .then(couples => expect(couples).toHaveLength(1));
            })
        ));
  });

  describe('joinCoupleOfUser mutation', () => {
    it('returns the couple after joining it successfully', () =>
      userRepository.createUser({ id: 'creatorId' }).then(() =>
        userRepository
          .createUser({ id: 'userId' })
          .then(() =>
            coupleRepository.createCouple({
              id: 'coupleId',
              creatorId: 'creatorId',
            })
          )
          .then(() =>
            graphqlRequest()
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
                return coupleRepository
                  .getCouples()
                  .then(
                    couples =>
                      expect(couples).toHaveLength(1) &&
                      expect(couples[0].otherId).toEqual('userId')
                  );
              })
          )
      ));

    it('returns null and does not update the database if a couple is full', () =>
      coupleRepository
        .createCouple({
          id: 'coupleId',
          creatorId: 'creatorId',
          otherId: 'anotherUserId',
        })
        .then(() =>
          graphqlRequest()
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
              return coupleRepository
                .getCouples()
                .then(
                  couples =>
                    expect(couples).toHaveLength(1) &&
                    expect(couples[0].otherId).toEqual('anotherUserId')
                );
            })
        ));

    it('returns UNAUTHENTICATED error and does not update the couple if user is not logged in', () =>
      coupleRepository
        .createCouple({
          id: 'coupleId',
          creatorId: 'creatorId',
        })
        .then(() =>
          graphqlRequest()
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
              return coupleRepository
                .getCouples()
                .then(
                  couples =>
                    expect(couples).toHaveLength(1) &&
                    expect(couples[0].otherId).toBeUndefined()
                );
            })
        ));
  });
});
