import { createUserRepository } from './repository/user';
import { createEntryRepository } from './repository/entry';
import { createCoupleRepository } from './repository/couple';
import { createServer, startServer } from './server';

const server = createServer({
  userRepository: createUserRepository(),
  entryRepository: createEntryRepository(),
  coupleRepository: createCoupleRepository(),
});

startServer(server, 3333, url =>
  // eslint-disable-next-line no-console
  console.log(`Server ready at ${url}`)
);
