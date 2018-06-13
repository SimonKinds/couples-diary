const users = [];

const id = () => Math.max(-1, ...users.map(({ id }) => id)) + 1;

export default class UserRepository {
  getById = idToFind => users.find(({ id }) => id === idToFind);
  getUsers = () => users;

  createUser = user => {
    if (users.find(({ username }) => username === user.username)) {
      return null;
    }

    const newUser = {
      ...user,
      id: id(),
    };

    users.push(newUser);

    return newUser;
  };
}
