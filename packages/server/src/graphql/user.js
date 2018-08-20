import { gql, AuthenticationError } from 'apollo-server-express';
import { generateId } from '../database';

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

export const model = (
  { hashPassword, doesPasswordMatchHash },
  userRepository,
  userId
) => ({
  createUser: user => {
    return userRepository.getUsers().then(users => {
      if (users.find(({ username }) => username === user.username)) {
        return null;
      }

      return hashPassword(user.password)
        .then(hash => ({ ...user, password: hash }))
        .then(user => ({ ...user, id: generateId() }))
        .then(user => userRepository.createUser(user));
    });
  },
  findWithCredentials: (username, password) => {
    return userRepository
      .getUsers()
      .then(users => users.find(user => username === user.username))
      .then(user =>
        doesPasswordMatchHash(password, (user && user.password) || '').then(
          doesMatch => (doesMatch ? user : null)
        )
      );
  },
  getById: id => userRepository.getById(id),
  me: () =>
    userRepository.getById(userId).then(user => {
      if (user === null) {
        throw new AuthenticationError('No such user');
      }
      return user;
    }),
});
