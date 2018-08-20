import { config } from 'dotenv';
config();

import { createDbInstance } from './database';

import { createUserRepository } from './repository/user';
import { createEntryRepository } from './repository/entry';
import { createCoupleRepository } from './repository/couple';
import { createServer, startServer } from './server';

const db = createDbInstance();

Promise.all([
  createUserRepository(db),
  createCoupleRepository(db),
  createEntryRepository(db),
]).then(([userRepository, coupleRepository, entryRepository]) => {
  const server = createServer({
    userRepository,
    coupleRepository,
    entryRepository,
  });

  startServer(server, 3333).then(({ url }) =>
    // eslint-disable-next-line no-console
    console.log(`Server ready at ${url}`)
  );
});
