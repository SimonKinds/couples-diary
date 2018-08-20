import Sequelize, { Op } from 'sequelize';

export const createUserRepository = () => {
  const sequelize = new Sequelize('couplesdiary', 'username', 'password', {
    dialect: 'sqlite',
    logging: false,
  });

  const User = sequelize.define('user', {
    id: { type: Sequelize.UUID, primaryKey: true },
    username: { type: Sequelize.STRING },
    name: { type: Sequelize.STRING },
    password: { type: Sequelize.STRING },
    color: { type: Sequelize.STRING },
  });

  return User.sync().then(() => ({
    getById(id) {
      return User.findOne({ where: { id: { [Op.eq]: id } } });
    },

    getUsers() {
      return User.findAll();
    },

    createUser(user) {
      return User.create(user);
    },
  }));
};
