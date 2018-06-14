const { ApolloServer, gql } = require('apollo-server');
import { schema as userSchema, model as userModel } from './graphql/user';
import {
  schema as entrySchema,
  resolver as entryResolver,
  model as entryModel,
} from './graphql/entry';
import { createUserRepository } from './repository/user';
import { createEntryRepository } from './repository/entry';

const typeDefs = [
  ...userSchema,
  ...entrySchema,
  gql`
    type Query {
      entries(year: Int!, month: Int!, date: Int): [Entry]!
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
    }
  `,
];

let loggedInUser = null;
const resolvers = {
  ...entryResolver,
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
  },
  Mutation: {
    createUser: (_, user, { userModel }) => userModel.createUser(user),
    login: (_, { username, password }, { userModel }) => {
      loggedInUser = userModel.login(username, password);
      return loggedInUser;
    },
    setEntry: (_, entry, { entryModel }) => entryModel.setEntry(entry),
  },
};

const userRepository = createUserRepository();
const entryRepository = createEntryRepository();
const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: () => ({
    userModel: userModel(userRepository),
    entryModel: entryModel(entryRepository, loggedInUser),
  }),
});

server.listen({ http: { port: 3333 } }).then(({ url }) => {
  // eslint-disable-next-line
  console.log(` Server ready at ${url}`);
});
