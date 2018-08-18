import express from 'express';
import compression from 'compression';
import { ApolloServer, gql } from 'apollo-server-express';
import { format as formatUrl } from 'url';

import {
  schema as userSchema,
  resolver as userResolver,
  model as userModel,
} from './graphql/user';
import {
  schema as entrySchema,
  resolver as entryResolver,
  model as entryModel,
} from './graphql/entry';
import {
  schema as coupleSchema,
  resolver as coupleResolver,
  model as coupleModel,
} from './graphql/couple';
import { temporaryToken, verifyToken } from './authentication';

const typeDefs = [
  ...userSchema,
  ...entrySchema,
  ...coupleSchema,
  gql`
    type Query {
      entries(year: Int!, month: Int!, date: Int): [Entry]!
      myCouple: Couple
      me: User
    }

    type Mutation {
      createUser(
        username: String!
        name: String!
        password: String!
        color: String!
      ): User

      login(username: String!, password: String!): String
      setEntry(year: Int!, month: Int!, date: Int!, content: String!): Entry

      createCouple: Couple
      joinCoupleOfUser(userId: ID!): Couple
    }
  `,
];

const resolvers = {
  ...userResolver,
  ...entryResolver,
  ...coupleResolver,
  Query: {
    entries: (_, { year, month, date }, { coupleModel, entryModel }) =>
      entryModel.getEntriesForCoupleByDate(
        coupleModel.myCouple(),
        year,
        month,
        date
      ),
    myCouple: (parent, args, { coupleModel }) => coupleModel.myCouple(),
    me: (parent, args, { userModel }) => userModel.me(),
  },
  Mutation: {
    createUser: (_, user, { userModel }) => userModel.createUser(user),
    login: (_, { username, password }, { userModel }) => {
      const user = userModel.findWithCredentials(username, password);
      if (user) {
        return temporaryToken(user.id);
      }

      return null;
    },
    setEntry: (_, entry, { entryModel, coupleModel }) =>
      entryModel.setEntryForCouple(entry, coupleModel.myCouple()),
    createCouple: (parent, args, { coupleModel }) => coupleModel.createCouple(),
    joinCoupleOfUser: (parent, { userId }, { coupleModel }) =>
      coupleModel.joinCoupleOfUser(userId),
  },
};

const getToken = authHeader => {
  if (authHeader) {
    const splits = authHeader.split(' ');
    if (splits.length == 2 && splits[0] == 'Bearer') {
      return splits[1];
    }
  }

  return '';
};

class Server {
  constructor(app) {
    this.app = app;
    this.httpServer = null;
  }

  listen(port) {
    const httpServer = this.app.listen(port);
    this.httpServer = httpServer;

    return Promise.resolve({
      httpServer,
      url: this.getUrl(httpServer.address()),
    });
  }

  getUrl(serverInfo) {
    return formatUrl({
      protocol: 'http',
      hostname: this.getHostname(serverInfo.address),
      port: serverInfo.port,
      pathname: '/',
    });
  }

  getHostname(address) {
    if (address === '' || address === '::') {
      return 'localhost';
    }

    return address;
  }

  stop() {
    if (this.httpServer !== null) {
      return new Promise(resolve => this.httpServer.close(resolve));
    }

    return Promise.resolve();
  }
}

export const createServer = ({
  userRepository,
  coupleRepository,
  entryRepository,
}) => {
  const app = express();
  app.disable('x-powered-by');
  app.use(compression());

  const graphqlServer = new ApolloServer({
    typeDefs,
    resolvers,
    context: ({ req }) =>
      verifyToken(getToken(req.headers.authorization), userId => ({
        userModel: userModel(userRepository, userId),
        entryModel: entryModel(entryRepository, userId),
        coupleModel: coupleModel(coupleRepository, userId),
      })),
  });

  graphqlServer.applyMiddleware({ app, cors: false, path: '/' });

  return new Server(app);
};

export const startServer = (server, port = 0) => {
  return server.listen(port);
};
