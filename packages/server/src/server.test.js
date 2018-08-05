import request from 'supertest';

import { createUserRepository } from './repository/user';
import { createEntryRepository } from './repository/entry';
import { createCoupleRepository } from './repository/couple';
import { createServer, startServer } from './server';

it('returns the entries of the requested year and month', () => {
  const entryRepository = createEntryRepository();

  entryRepository.setEntry({
    year: 2018,
    month: 1,
    date: 1,
    authorId: 'author',
    content: 'This is my entry',
  });
  entryRepository.setEntry({
    year: 2018,
    month: 2,
    date: 1,
    authorId: 'author',
    content: 'Some other content',
  });

  const server = createServer({
    userRepository: createUserRepository(),
    coupleRepository: createCoupleRepository(),
    entryRepository,
  });

  return startServer(server, 0).then(s =>
    request(s)
      .post('/graphql')
      .set('Accept', 'application/json')
      .send({ query: `{entries(year: 2018, month: 1) { content }}` })
      .expect(200)
      .then(res =>
        expect(JSON.parse(res.text)).toEqual({
          data: { entries: [{ content: 'This is my entry' }] },
        })
      )
  );
});
