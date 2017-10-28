// @flow
// eslint-disable-next-line no-unused-vars
import regeneratorRuntime from 'regenerator-runtime'; // required for async
import uuid from 'uuid/v4';
import getConnection from '../SqlDatabase';

export default class Couple {
  id: string;
  name: string;
  creationDate: Date;

  constructor(id: string, name: string, creationDate: Date) {
    this.id = id;
    this.name = name;
    this.creationDate = creationDate;
  }

  static async create(name: string): Promise<Couple> {
    const creationDate = new Date();
    try {
      const connection = await getConnection();
      const id = uuid();
      await connection.query(
        'INSERT INTO couples SET ?, creation_date = NOW()',
        {
          id,
          name,
        },
      );
      connection.release();

      return new Couple(id, name, creationDate);
    } catch (e) {
      console.error(e);
      throw new Error('Could not create couple');
    }
  }
}
