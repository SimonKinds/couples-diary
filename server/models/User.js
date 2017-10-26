// @flow

// required for async functions

// eslint-disable-next-line no-unused-vars
import regeneratorRuntime from 'regenerator-runtime';
import getConnection from '../SqlDatabase';

export default class User {
  id: number;
  firstName: string;
  lastName: string;
  username: string;
  email: string;
  creationDate: Date;

  constructor(
    id: number, firstName: string, lastName: string, username: string, email: string,
    creationDate: Date,
  ) {
    this.id = id;
    this.firstName = firstName;
    this.lastName = lastName;
    this.username = username;
    this.email = email;
    this.creationDate = creationDate;
  }

  static async create(
    firstName: string, lastName: string, username: string,
    email: string,
  ): Promise<User> {
    const creationDate = new Date();
    const connection = await getConnection();
    const result =
      await connection.query(
        'INSERT INTO users SET ?, creation_date = now()',
        {
          first_name: firstName,
          last_name: lastName,
          username,
          email,
        },
      );
    return new User(
      result[0].insertId, firstName, lastName, username, email,
      creationDate,
    );
  }

  static async getForId(id: number): Promise<?User> {
    const connection = await getConnection();
    const rows =
    (await connection.query(
      'SELECT id, first_name, last_name, username, email, creation_date ' +
      'FROM users ' +
      'WHERE id = ?',
      [id],
    ))[0];
    connection.release();

    if (rows.length > 2) {
      console.error(`User ID ${id} returned ${rows.length} users`);
      return null;
    }

    if (rows.length === 0) {
      console.error(`No user with ID ${id}`);
      return null;
    }

    const user = rows[0];

    return new User(
      user.id, user.first_name, user.last_name, user.username,
      user.email, user.creation_date,
    );
  }
}
