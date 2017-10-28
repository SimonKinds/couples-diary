// @flow

// eslint-disable-next-line no-unused-vars
import regeneratorRuntime from 'regenerator-runtime'; // required for async
import bcrypt from 'bcrypt';
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
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  creationDate: Date;

  constructor(
    id: number, email: string, firstName: string, lastName: string,
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

      const result =
        await connection.query(
          'INSERT INTO users SET ?, creation_date = now()',
          {
            email,
            password: hashedPassword,
            first_name: firstName,
            last_name: lastName,
          },
        );

      connection.release();

      return new User(
        result[0].insertId, email, firstName, lastName,
        creationDate,
      );
    } catch (e) {
      console.error(e);
      throw new Error('Could not create user');
    }
  }

  static async getForId(id: number): Promise<User> {
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

      const user = rows[0];

      return new User(
        user.id, user.email, user.first_name, user.last_name,
        user.creation_date,
      );
    } catch (e) {
      console.error(e);
      throw new Error('Could not get user');
    }
  }
}
