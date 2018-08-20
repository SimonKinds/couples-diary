import Sequelize from 'sequelize';

const getDbName = () => process.env.DB_NAME || '';

export const createDbInstance = () =>
  new Sequelize(getDbName(), '', '', {
    dialect: 'sqlite',
    logging: false,
    storage: 'couplesdiary.sqlite',
  });

export const createInMemoryDbInstance = () =>
  new Sequelize(getDbName(), '', '', {
    dialect: 'sqlite',
    logging: false,
    storage: ':memory:',
  });
