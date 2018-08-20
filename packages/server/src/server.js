import express from 'express';
import compression from 'compression';
import { GraphQLScalarType } from 'graphql';
import { Kind } from 'graphql/language';
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
import { hashPassword, doesPasswordMatchHash } from './password';

const typeDefs = [
  ...userSchema,
  ...entrySchema,
  ...coupleSchema,
  gql`
    scalar Date

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
  Date: new GraphQLScalarType({
    name: 'Date',
    parseValue(num) {
      return new Date(num);
    },
    serialize(date) {
      return date.getTime();
    },
    parseLiteral(ast) {
      if (ast.kind !== Kind.INT) {
        return null;
      }

      return new Date(ast.value);
    },
  }),
  Query: {
    entries: (_, { year, month, date }, { coupleModel, entryModel }) =>
      coupleModel
        .myCouple()
        .then(couple =>
          entryModel.getEntriesForCoupleByDate(couple, year, month, date)
        ),
    myCouple: (parent, args, { coupleModel }) => coupleModel.myCouple(),
    me: (parent, args, { userModel }) => userModel.me(),
  },
  Mutation: {
    createUser: (_, user, { userModel }) => userModel.createUser(user),
    login: (_, { username, password }, { userModel }) =>
      userModel
        .findWithCredentials(username, password)
        .then(user => (user !== null ? temporaryToken(user.id) : null)),
    setEntry: (_, entry, { entryModel, coupleModel }) =>
      coupleModel
        .myCouple()
        .then(couple => entryModel.setEntryForCouple(entry, couple)),
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

  listen() {
    const port = process.env.SERVER_PORT || 0;
    const hostname = process.env.HOSTNAME || 'localhost';

    return new Promise(resolve => {
      const httpServer = this.app.listen(port, hostname, resolve);
      this.httpServer = httpServer;
    }).then(() => ({
      httpServer: this.httpServer,
      url: this.getUrl(this.httpServer.address()),
    }));
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
  passwordStrategy,
}) => {
  if (passwordStrategy === undefined) {
    passwordStrategy = {
      hashPassword,
      doesPasswordMatchHash,
    };
  }

  const app = express();
  app.disable('x-powered-by');
  app.use(compression());

  const graphqlServer = new ApolloServer({
    typeDefs,
    resolvers,
    context: ({ req }) =>
      verifyToken(getToken(req.headers.authorization), userId => ({
        userModel: userModel(passwordStrategy, userRepository, userId),
        entryModel: entryModel(entryRepository, userId),
        coupleModel: coupleModel(coupleRepository, userId),
      })),
  });

  graphqlServer.applyMiddleware({ app, cors: false, path: '/' });

  return new Server(app);
};

export const startServer = server => {
  return server.listen();
};
