export const login = (username, password, userRepo) =>
  userRepo
    .getUsers()
    .find(user => username === user.username && password === user.password);
