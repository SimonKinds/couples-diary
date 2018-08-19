class UserRepository {
  users = [];

  getById = idToFind =>
    Promise.resolve(this.users.find(({ id }) => id === idToFind) || null);
  getUsers = () => Promise.resolve(this.users);
  createUser = user => {
    this.users.push(user);
    return Promise.resolve(user);
  };
}

export const createUserRepository = () => new UserRepository();
