// @flow

const typeDefs = [`
  type Post {
    author: User!,
    content: String!,
    year: Int!,
    month: Int!,
    day: Int!,
    creation_time: Int!,
    read_time: Int!
  }

  type User {
    name: String!,
    username: String!,
    email: String!,
    creation_time: Int!,
  }
`];
