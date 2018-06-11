const { ApolloServer, gql } = require('apollo-server');

const users = [];
const entries = [];

const typeDefs = gql`
  type User {
    id: ID!
    username: String!
    name: String!
    password: String!
    color: String!
  }

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
`;

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
    createUser: (_, user) => {
      user.id = Math.max(-1, ...users.map(({ id }) => id)) + 1;
      users.push(user);
      return user;
    },
    login: (_, args) => {
      loggedInUser = users.find(
        ({ username, password }) =>
          username === args.username && password === args.password
      );
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
    author: entry => users.find(({ id }) => entry.authorId === id),
  },
};

const server = new ApolloServer({ typeDefs, resolvers });

server.listen({ http: { port: 3333 } }).then(({ url }) => {
  // eslint-disable-next-line
  console.log(` Server ready at ${url}`);
});
