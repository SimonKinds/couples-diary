const { ApolloServer, gql } = require('apollo-server');
import { schema as userSchema } from './graphql/user';
import {
  schema as entrySchema,
  resolver as entryResolver,
} from './graphql/entry';
import UserRepository from './repository/user';
import EntryRepository from './repository/entry';
import { login } from './auth';

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
    entries: (_, args, { entryRepo }) =>
      entryRepo
        .getEntries()
        .filter(
          ({ year, month, date }) =>
            year === args.year &&
            month === args.month &&
            (args.date == null || date === args.date)
        ),
  },
  Mutation: {
    createUser: (_, user, { userRepo }) => userRepo.createUser(user),
    login: (_, { username, password }, { userRepo }) => {
      loggedInUser = login(username, password, userRepo);
      return loggedInUser;
    },
    setEntry: (_, entry, { entryRepo }) => entryRepo.setEntry(entry),
  },
};

const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: () => ({
    userRepo: new UserRepository(),
    entryRepo: new EntryRepository(loggedInUser),
  }),
});

server.listen({ http: { port: 3333 } }).then(({ url }) => {
  // eslint-disable-next-line
  console.log(` Server ready at ${url}`);
});
