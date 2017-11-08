// @flow
import {
  GraphQLScalarType,
} from 'graphql';
import {
  Kind,
} from 'graphql/language';
import { makeExecutableSchema } from 'graphql-tools';
// eslint-disable-next-line no-unused-vars
import regeneratorRuntime from 'regenerator-runtime'; // required for async

const typeDefs = [`
  scalar Date

  type Post {
    id: String!
    author: User!
    content: String!
    # the date that the post is about
    date: Date!
    creationDate: Date!
    # the time at which the other user read the post
    readDate: Date!
  }

  type User {
    id: String!
    email: String!
    firstName: String!
    lastName: String!
    creationDate: Date!
  }

  type Couple {
    id: String!
    name: String!
    creationDate: Date!
  }

  type LoginPayload {
    user: User!
    accessToken: String!
    refreshToken: String!
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
    # logs the user in, or throws an error if invalid data
    login(email: String!, password: String!): LoginPayload!
    # returns a new access token if the refresh token belongs to the user and client
    refreshAccessToken(refreshToken: String!): String!

    createUser(email: String!, password: String!, firstName: String!,
               lastName: String!): LoginPayload!
    createCouple(name: String!): Couple!
  }
`];

const resolvers = {
  // Query
  Query: {
    user: (root, data, { user }) => {
      if (!user) {
        throw new Error('Not logged in');
      }
      return user;
    },
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
    login: (root, { email, password }, { user, clientId, Authentication }) => {
      if (user) {
        throw new Error('Already logged in');
      }
      return Authentication.login(email, password, clientId);
    },

    refreshAccessToken: (root, { refreshToken }, { clientId, Authentication }) =>
      Authentication.refresh(clientId, refreshToken),
    createUser: async (root, {
      email, password, firstName, lastName,
    }, {
        user, clientId, Authentication, User,
      }) => {
      if (user) {
        throw new Error('Already logged in');
      }
      await User.create(email, password, firstName, lastName);
      return Authentication.login(email, password, clientId);
    },
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
