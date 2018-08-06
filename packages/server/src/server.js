import { ApolloServer, gql } from 'apollo-server';
import { schema as userSchema, model as userModel } from './graphql/user';
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
import { verifyToken } from './authentication';

const typeDefs = [
  ...userSchema,
  ...entrySchema,
  ...coupleSchema,
  gql`
    type Query {
      entry(year: Int!, month: Int!, date: Int!): Entry
      entries(year: Int!, month: Int!): [Entry]!
      myCouple: Couple
    }

    type Mutation {
      createUser(
        username: String!
        name: String!
        password: String!
        color: String!
      ): User

      login(username: String!, password: String!): User
      setEntry(year: Int!, month: Int!, date: Int!, content: String!): Entry

      createCouple: Couple
      joinCoupleOfUser(userId: ID!): Couple
    }
  `,
];

let loggedInUser = null;
const resolvers = {
  ...entryResolver,
  ...coupleResolver,
  Query: {
    entry: (_, { year, month, date }, { entryModel }) =>
      entryModel.getEntriesByDate(year, month, date).pop() || null,
    entries: (_, { year, month }, { entryModel }) =>
      entryModel.getEntriesByDate(year, month),
    myCouple: (parent, args, { coupleModel }) => coupleModel.myCouple(),
  },
  Mutation: {
    createUser: (_, user, { userModel }) => userModel.createUser(user),
    login: (_, { username, password }, { userModel }) => {
      loggedInUser = userModel.login(username, password);
      return loggedInUser;
    },
    setEntry: (_, entry, { entryModel }) => entryModel.setEntry(entry),
    createCouple: (parent, args, { coupleModel }) => coupleModel.createCouple(),
    joinCoupleOfUser: (parent, { userId }, { userModel, coupleModel }) =>
      coupleModel.joinCoupleOfUser(userModel.getById(userId)),
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

export const createServer = ({
  userRepository,
  coupleRepository,
  entryRepository,
}) => {
  return new ApolloServer({
    typeDefs,
    resolvers,
    context: ({ req }) =>
      verifyToken(getToken(req.headers.authorization), userId => ({
        userModel: userModel(userRepository),
        entryModel: entryModel(entryRepository, userId),
        coupleModel: coupleModel(coupleRepository, userId),
      })),
  });
};

export const startServer = (server, port = 0) => {
  return server
    .listen({ port })
    .then(({ server: httpServer, ...rest }) => ({ httpServer, ...rest }));
};
