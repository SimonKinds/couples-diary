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
    entries: (_, args, { entryModel }) =>
      entryModel
        .getEntries()
        .filter(
          ({ year, month, date }) =>
            year === args.year &&
            month === args.month &&
            (args.date == null || date === args.date)
        ),
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

export const createServer = ({
  userRepository,
  coupleRepository,
  entryRepository,
}) => {
  return new ApolloServer({
    typeDefs,
    resolvers,
    context: () => ({
      userModel: userModel(userRepository),
      entryModel: entryModel(entryRepository, loggedInUser),
      coupleModel: coupleModel(coupleRepository, loggedInUser),
    }),
  });
};

export const startServer = (server, port, onStart) => {
  return server.listen({ port }).then(({ url, server }) => {
    if (onStart != null) {
      onStart(url);
    }

    return server;
  });
};
