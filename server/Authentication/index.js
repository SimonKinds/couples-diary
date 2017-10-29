// @flow

// eslint-disable-next-line no-unused-vars
import regeneratorRuntime from 'regenerator-runtime'; // required for async
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import User from '../models/User';
import RefreshToken from '../models/RefreshToken';
import JwtSecret from './JwtSecret';


class LoginPayload {
  user: User;
  accessToken: string;
  refreshToken: string;

  constructor(user: User, accessToken: string, refreshToken: string) {
    this.user = user;
    this.accessToken = accessToken;
    this.refreshToken = refreshToken;
  }
}

export default class Authentication {
  static getAccessToken(userId: string): string {
    return jwt.sign(
      { id: userId }, JwtSecret.accessTokenKey,
      { algorithm: 'HS256', expiresIn: '1h' },
    );
  }
  static async login(email: string, password: string, clientId: string): Promise<LoginPayload> {
    // TODO: check if this client already has a refresh token
    try {
      const [user, hashedPassword] = await User.getUserAndPasswordForEmail(email);
      if (!await bcrypt.compare(password, hashedPassword)) {
        throw new Error('Mismatched password');
      }
      const newRefreshToken: string = jwt.sign(
        { id: user.id }, JwtSecret.refreshTokenKey,
        { algorithm: 'HS256' },
      );

      await RefreshToken.create(user.id, clientId, newRefreshToken);

      return new LoginPayload(user, Authentication.getAccessToken(user.id), newRefreshToken);
    } catch (e) {
      console.error(e);
      throw new Error('Could not log in user');
    }
  }

  // returns a new access token if valid refresh token, otherwise throws
  static async refresh(clientId: string, refreshToken: string): Promise<string> {
    try {
      const decoded: {id: string} =
      jwt.verify(refreshToken, JwtSecret.refreshTokenKey, { algorithm: 'HS256' });

      const tokens = await RefreshToken.getForUser(decoded.id);

      const token = tokens.filter(t =>
        t.userId !== decoded.id ||
        t.clientId !== clientId ||
        t.token !== refreshToken);

      if (token.length !== 1) {
        throw new Error(`Invalid amount of tokens found: ${token.length}`);
      }
      return Authentication.getAccessToken(decoded.id);
    } catch (e) {
      console.error(e);
      throw new Error('Could not refresh token');
    }
  }
}
