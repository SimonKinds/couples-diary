// @flow

// eslint-disable-next-line no-unused-vars
import regeneratorRuntime from 'regenerator-runtime'; // required for async
import crypto from 'crypto';
import createConnection from '../SqlDatabase';

export default class RefreshToken {
  userId: string;
  clientId: string;
  token: string; // sha256 hex representation of the refresh token

  constructor(userId: string, clientId: string, token: string) {
    this.userId = userId;
    this.clientId = clientId;
    this.token = token;
  }

  static hash(token: string) {
    const hasher = crypto.createHash('sha256');
    hasher.update(token);
    return hasher.digest('hex');
  }

  static async create(userId: string, clientId: string, token: string): Promise<void> {
    try {
      const connection = await createConnection();

      await connection.query(
        'INSERT INTO refresh_tokens SET ?',
        { client_id: clientId, user_id: userId, token: RefreshToken.hash(token) },
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
      const result = await connection.query(
        'SELECT client_id, token, user_id FROM refresh_tokens WHERE user_id = ?',
        [userId],
      );
      connection.release();

      return result[0].map(RefreshToken.fromColumns)
        .filter((a: ?RefreshToken) => a != null);
    } catch (e) {
      console.error(e);
      throw new Error('Could not get refresh tokens');
    }
  }

  static fromColumns(cols: any): ?RefreshToken {
    if (typeof cols.client_id === 'string' &&
    typeof cols.token === 'string' &&
    typeof cols.user_id === 'string') {
      return new RefreshToken(cols.client_id, cols.user_id, cols.token);
    }
    return null;
  }
}
