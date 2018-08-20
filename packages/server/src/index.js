import { config } from 'dotenv';
config();

import { createDbInstance } from './database';

import { createUserRepository } from './repository/user';
import { createEntryRepository } from './repository/entry';
import { createCoupleRepository } from './repository/couple';
import { createServer, startServer } from './server';

createUserRepository(createDbInstance()).then(userRepository => {
  const server = createServer({
    userRepository,
    entryRepository: createEntryRepository(),
    coupleRepository: createCoupleRepository(),
  });

  startServer(server, 3333).then(({ url }) =>
    // eslint-disable-next-line no-console
    console.log(`Server ready at ${url}`)
  );
});
