import { gql } from 'apollo-server';

const users = [];

export const schema = [
  gql`
    type User {
      id: ID!
      username: String!
      name: String!
      password: String!
      color: String!
    }
  `,
];

export const getUsers = () => users;
