// @flow
import {
  GraphQLScalarType,
} from 'graphql';
import {
  Kind,
} from 'graphql/language';
import { makeExecutableSchema } from 'graphql-tools';

const typeDefs = [`
  scalar Date

  type Post {
    id: ID!,
    author: User!,
    content: String!,
    # the date that the post is about
    date: Date!,
    creationDate: Date!,
    # the time at which the other user read the post
    readDate: Date!
  }

  type User {
    id: ID!,
    firstName: String!,
    lastName: String!,
    username: String!,
    email: String!,
    creationDate: Date!,
  }

  type Couple {
    id: ID!,
    name: String!,
    creationDate: Date!
  }

  type Query {
    # returns the currently logged-in user
    user: User!
    # returns the couple for the logged-in user
    couple: Couple
    # the posts by the couple, for the given date
    postsForDate(date: Date!): [Post!]!
    # all posts by the couple, for the given year and month
    postsForMonth(date: Date!): [Post!]!
  }

  type Mutation {
    createUser(username: String!, password: String!,
               firstName: String!, lastName: String, email: String!): User!
    createCouple(name: String!): Couple!
  }
`];

const resolvers = {
  // Query
  Query: {
    user: (root, data, context) => context.User.getForId(1),
    couple: () => ({
      id: 0,
      name: 'The best couple',
      creationDate: new Date(),
    }),
    postsForDate: () => [],
    postsForMonth: () => [],
  },
  // Mutations
  Mutation: {
    createUser: (root, {
      username, password, firstName, lastName, email,
    }, context) =>
      context.User.create(
        username, password, firstName,
        lastName, username, email,
      ),
    createCouple: (root, { name }, context) => context.Couple.create(name),
  },
  // Scalars
  Date: new GraphQLScalarType({
    // http://dev.apollodata.com/tools/graphql-tools/scalars.html#Date-as-a-scalar
    name: 'Date',
    description: 'UTC milliseconds since epoch',
    parseValue(value) {
      if (value === 'number') {
        // Turn an input into a date which we want as a number
        // value from the client
        return new Date(value).valueOf();
      }
      return null;
    },
    serialize(value) {
      // Convert Date to number primitive .getTime() or .valueOf()
      // value sent to the client
      if (value instanceof Date) {
        return value.valueOf();
      }
      console.error('Trying to serialize invalid value');
      return null;
    },
    parseLiteral(ast) {
      // ast value is always in string format
      if (ast.kind === Kind.INT) {
        // parseInt turns a string number into number of a certain base
        return parseInt(ast.value, 10);
      }
      console.error('Trying to parse invalid literal');
      return null;
    },
  }),
};

export default makeExecutableSchema({
  typeDefs,
  resolvers,
});
