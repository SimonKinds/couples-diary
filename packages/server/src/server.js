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
import { temporaryToken, verifyToken } from './authentication';

const typeDefs = [
  ...userSchema,
  ...entrySchema,
  ...coupleSchema,
  gql`
    type Query {
      entries(year: Int!, month: Int!, date: Int): [Entry]!
      myCouple: Couple
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
    setEntry: (_, entry, { entryModel }) => entryModel.setEntry(entry),
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

export const createServer = ({
  userRepository,
  coupleRepository,
  entryRepository,
}) =>
  new ApolloServer({
    cors: false,
    typeDefs,
    resolvers,
    context: ({ req }) =>
      verifyToken(getToken(req.headers.authorization), userId => ({
        userModel: userModel(userRepository),
        entryModel: entryModel(entryRepository, userId),
        coupleModel: coupleModel(coupleRepository, userId),
      })),
  });

export const startServer = (server, port = 0) => {
  return server
    .listen({ port })
    .then(({ server: httpServer, ...rest }) => ({ httpServer, ...rest }));
};
