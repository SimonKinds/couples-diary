// @flow

// eslint-disable-next-line no-unused-vars
import regeneratorRuntime from 'regenerator-runtime'; // required for async
import createConnection from '../SqlDatabase';

export default class RefreshToken {
  clientId: string;
  userId: string;
  token: string;

  constructor(clientId: string, userId: string, token: string) {
    this.clientId = clientId;
    this.userId = userId;
    this.token = token;
  }

  static async create(clientId: string, userId: string, token: string): Promise<void> {
    try {
      const connection = await createConnection();
      await connection.query(
        'INSERT INTO refresh_tokens SET ?',
        { client_id: clientId, user_id: userId, token },
      );
      connection.release();
    } catch (e) {
      console.error(e);
      throw new Error('Could not store token');
    }
  }

  static async getForUser(userId: string): Promise<[RefreshToken]> {
    try {
      const connection = await createConnection();
      const rows = await connection.query(
        'SELECT client_id, token, user_id FROM refresh_tokens WHERE user_id = ?',
        [userId],
      )[0];
      connection.release();

      return rows.map(RefreshToken.fromColumns)
        .filter((a: ?RefreshToken) => a != null);
    } catch (e) {
      console.error(e);
      throw new Error('Could not get refresh tokens');
    }
  }

  static fromColumns(cols: any): ?RefreshToken {
    if (typeof cols.clientId === 'string' &&
    typeof cols.token === 'string' &&
    typeof cols.userId === 'string') {
      return new RefreshToken(cols.clientId, cols.userId, cols.token);
    }
    return null;
  }
}
