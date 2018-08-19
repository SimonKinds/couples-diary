import { gql, AuthenticationError } from 'apollo-server-express';

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
    const users = userRepository.getUsers();

    if (users.find(({ username }) => username === user.username)) {
      return null;
    }

    const id = Math.max(-1, ...users.map(({ id }) => parseInt(id, 10))) + 1;

    return hashPassword(user.password)
      .then(hash => ({ ...user, password: hash }))
      .then(user => ({ ...user, id: id.toString() }))
      .then(user => userRepository.createUser(user));
  },
  findWithCredentials: (username, password) => {
    const user = userRepository
      .getUsers()
      .find(user => username === user.username);

    return doesPasswordMatchHash(password, (user && user.password) || '').then(
      doesMatch => (doesMatch ? user : null)
    );
  },
  getById: id => userRepository.getById(id),
  me: () => {
    const user = userRepository.getById(userId);
    if (user === null) {
      throw new AuthenticationError('No such user');
    }
    return user;
  },
});
