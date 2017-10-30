// @flow

// eslint-disable-next-line no-unused-vars
import regeneratorRuntime from 'regenerator-runtime'; // required for async
import bcrypt from 'bcrypt';
import uuid from 'uuid/v4';
import getConnection from '../SqlDatabase';

const HASH_ROUNDS = 10;

const isEmailUnique = async (email: string, connection: any): Promise<boolean> => {
  const result = await connection.query(
    'SELECT COUNT(email) from users WHERE email = ?',
    email,
  );
  return result[0][0]['COUNT(email)'] === 0;
};

export default class User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  creationDate: Date;

  constructor(
    id: string, email: string, firstName: string, lastName: string,
    creationDate: Date,
  ) {
    this.id = id;
    this.email = email;
    this.firstName = firstName;
    this.lastName = lastName;
    this.creationDate = creationDate;
  }

  static async create(
    email: string, password: string, firstName: string,
    lastName: string,
  ): Promise<User> {
    const hashedPassword = await bcrypt.hash(password, HASH_ROUNDS);

    const creationDate = new Date();
    try {
      const connection = await getConnection();

      if (!await isEmailUnique(email, connection)) {
        throw new Error('Email is already in use');
      }

      const id = uuid();

      await connection.query(
        'INSERT INTO users SET ?',
        {
          id,
          email,
          password: hashedPassword,
          first_name: firstName,
          last_name: lastName,
          creation_date: creationDate,
        },
      );

      connection.release();

      return new User(id, email, firstName, lastName, creationDate);
    } catch (e) {
      console.error(e);
      throw new Error('Could not create user');
    }
  }

  static async getForId(id: string): Promise<User> {
    try {
      const connection = await getConnection();
      const rows =
      (await connection.query(
        'SELECT id, email, first_name, last_name, creation_date ' +
        'FROM users ' +
        'WHERE id = ?',
        [id],
      ))[0];
      connection.release();

      if (rows.length > 2) {
        throw new Error(`User ID ${id} returned ${rows.length} users`);
      }

      if (rows.length === 0) {
        throw new Error(`No user with ID ${id}`);
      }


      return User.createFromColumns(rows[0]);
    } catch (e) {
      console.error(e);
      throw new Error('Could not get user');
    }
  }

  // throws if invalid columns
  static createFromColumns(columns: any): User {
    if (typeof columns.id === 'string' &&
        typeof columns.email === 'string' &&
        typeof columns.first_name === 'string' &&
        typeof columns.last_name === 'string' &&
        columns.creation_date instanceof Date) {
      return new User(
        columns.id,
        columns.email, columns.first_name,
        columns.last_name, columns.creation_date,
      );
    }
    throw new Error('Got invalid object from database');
  }

  static async getUserAndPasswordForEmail(email: string): Promise<[User, string]> {
    try {
      const connection = await getConnection();
      const rows =
      (await connection.query(
        'SELECT id, email, first_name, last_name, creation_date, password ' +
        'FROM users ' +
        'WHERE email = ?',
        [email],
      ))[0];
      connection.release();

      if (rows.length > 2) {
        throw new Error(`Email ${email} returned ${rows.length} users`);
      }

      if (rows.length === 0) {
        throw new Error(`No user with email ${email}`);
      }

      return [User.createFromColumns(rows[0]), rows[0].password.toString()];
    } catch (e) {
      console.error(e);
      throw new Error('Could not get user');
    }
  }
}
