const { ApolloServer, gql } = require('apollo-server');
import { schema as userSchema } from './graphql/user';
import UserRepository from './repository/user';
import { login } from './auth';

const entries = [];

const typeDefs = [
  ...userSchema,
  gql`
    type Entry {
      author: User!
      year: Int!
      month: Int!
      date: Int!
      content: String!
    }

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
  Query: {
    entries: (_, args) =>
      entries.filter(
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
    setEntry: (_, entry) => {
      if (loggedInUser == null) {
        return null;
      }
      entry.authorId = loggedInUser.id;

      const index = entries.findIndex(
        ({ year, month, date }) =>
          year === entry.year && month === entry.month && date === entry.date
      );

      if (index !== -1) {
        entries[index] = entry;
      } else {
        entries.push(entry);
      }

      return entry;
    },
  },
  Entry: {
    author: (entry, _, { userRepo }) => userRepo.getById(entry.authorId),
  },
};

const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: () => ({ userRepo: new UserRepository() }),
});

server.listen({ http: { port: 3333 } }).then(({ url }) => {
  // eslint-disable-next-line
  console.log(` Server ready at ${url}`);
});
