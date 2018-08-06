import request from 'supertest';

import { createUserRepository } from './repository/user';
import { createEntryRepository } from './repository/entry';
import { createCoupleRepository } from './repository/couple';
import { createServer, startServer } from './server';
import { temporaryToken } from './authentication';

const graphqlRequest = httpServer =>
  request(httpServer)
    .post('/graphql')
    .set('Accept', 'application/json');

const parseGraphqlResponse = res => JSON.parse(res.text).data;

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

  it('returns the entries of the requested year and month', () => {
    entryRepository.setEntry({
      year: 2018,
      month: 1,
      date: 1,
      authorId: 'author',
      content: 'Entry 1',
    });
    entryRepository.setEntry({
      year: 2018,
      month: 2,
      date: 1,
      authorId: 'author',
      content: 'Entry 2',
    });

    return startServer(server).then(({ httpServer }) =>
      graphqlRequest(httpServer)
        .send({ query: `{entries(year: 2018, month: 1) { content }}` })
        .expect(200)
        .then(res => parseGraphqlResponse(res))
        .then(({ entries }) =>
          expect(entries).toEqual([{ content: 'Entry 1' }])
        )
    );
  });

  it('returns the entry of the requested year and month and date', () => {
    entryRepository.setEntry({
      year: 2018,
      month: 1,
      date: 1,
      authorId: 'author',
      content: 'Entry 1',
    });
    entryRepository.setEntry({
      year: 2018,
      month: 1,
      date: 2,
      authorId: 'author',
      content: 'Entry 2',
    });

    return startServer(server).then(({ httpServer }) =>
      graphqlRequest(httpServer)
        .send({ query: `{entry(year: 2018, month: 1, date: 1) { content }}` })
        .expect(200)
        .then(res => parseGraphqlResponse(res))
        .then(({ entry }) => expect(entry).toEqual({ content: 'Entry 1' }))
    );
  });

  it('myCouple returns null if user is not logged in', () => {
    return startServer(server).then(({ httpServer }) =>
      graphqlRequest(httpServer)
        .send({ query: `{myCouple { id }}` })
        .expect(200)
        .then(res => parseGraphqlResponse(res))
        .then(({ myCouple }) => expect(myCouple).toBeNull())
    );
  });

  it('myCouple returns the couple of the logged in user', () => {
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
        .send({ query: `{myCouple { id }}` })
        .expect(200)
        .then(res => parseGraphqlResponse(res))
        .then(({ myCouple }) => expect(myCouple).toEqual({ id: coupleId }))
    );
  });
});
