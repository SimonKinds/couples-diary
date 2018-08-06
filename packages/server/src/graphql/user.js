import { gql } from 'apollo-server';

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

export const model = userRepository => ({
  createUser: user => {
    const users = userRepository.getUsers();

    if (users.find(({ username }) => username === user.username)) {
      return null;
    }

    const id = Math.max(-1, ...users.map(({ id }) => parseInt(id, 10))) + 1;
    return userRepository.createUser({ ...user, id: id.toString() });
  },
  findWithCredentials: (username, password) =>
    userRepository
      .getUsers()
      .find(user => username === user.username && password === user.password),
  getById: id => userRepository.getById(id),
});
