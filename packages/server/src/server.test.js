import request from 'supertest';

import { createUserRepository } from './repository/user';
import { createEntryRepository } from './repository/entry';
import { createCoupleRepository } from './repository/couple';
import { createServer, startServer } from './server';

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
      request(httpServer)
        .post('/graphql')
        .set('Accept', 'application/json')
        .send({ query: `{entries(year: 2018, month: 1) { content }}` })
        .expect(200)
        .then(res =>
          expect(JSON.parse(res.text)).toEqual({
            data: { entries: [{ content: 'Entry 1' }] },
          })
        )
    );
  });
});
