class UserRepository {
  users = [];

  getById = idToFind => this.users.find(({ id }) => id === idToFind) || null;
  getUsers = () => this.users;
  createUser = user => {
    this.users.push(user);
    return user;
  };
}

export const createUserRepository = () => new UserRepository();
