// @flow

// eslint-disable-next-line no-unused-vars
import regeneratorRuntime from 'regenerator-runtime'; // required for async
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import User from '../models/User';
import RefreshToken from '../models/RefreshToken';
import JwtSecret from './JwtSecret';


const SIGNING_ALGORITHM = 'HS256';

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
      { algorithm: SIGNING_ALGORITHM, expiresIn: '1h' },
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
        { algorithm: SIGNING_ALGORITHM },
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
        jwt.verify(refreshToken, JwtSecret.refreshTokenKey, {
          algorithms: [SIGNING_ALGORITHM],
        });

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

  static async getUserFromHeader(authenticationHeader: string | void): Promise<?User> {
    if (authenticationHeader) {
      return Authentication.getUserFromAccessToken(authenticationHeader);
    }
    return null;
  }

  static async getUserFromAccessToken(accessToken: string): Promise<User> {
    try {
      const decoded: {id: string} =
        jwt.verify(accessToken, JwtSecret.accessTokenKey, {
          algorithms: [SIGNING_ALGORITHM],
        });
      return User.getForId(decoded.id);
    } catch (e) {
      console.error(e);
      throw new Error('Invalid access token');
    }
  }
}
