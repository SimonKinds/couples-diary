// @flow
// eslint-disable-next-line no-unused-vars
import regeneratorRuntime from 'regenerator-runtime'; // required for async
import getConnection from '../SqlDatabase';

export default class Couple {
  id: number;
  name: string;
  creationDate: Date;

  constructor(id: number, name: string, creationDate: Date) {
    this.id = id;
    this.name = name;
    this.creationDate = creationDate;
  }

  static async create(name: string): Promise<Couple> {
    const creationDate = new Date();
    const connection = await getConnection();
    const result =
      await connection.query(
        'INSERT INTO couples SET ?, creation_date = now()',
        {
          name,
        },
      );
    connection.release();

    return new Couple(result[0].insertId, name, creationDate);
  }
}
