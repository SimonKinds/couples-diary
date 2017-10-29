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
  static async login(email: string, password: string, clientId: string): Promise<LoginPayload> {
    // TODO: check if this client already has a refresh token
    try {
      const [user, hashedPassword] = await User.getUserAndPasswordForEmail(email);
      if (!await bcrypt.compare(password, hashedPassword)) {
        throw new Error('Mismatched password');
      }
      const accessToken: string = jwt.sign(
        { id: user.id }, JwtSecret.accessTokenKey,
        { algorithm: 'HS256', expiresIn: '1h' },
      );
      const newRefreshToken: string = jwt.sign(
        { id: user.id }, JwtSecret.refreshTokenKey,
        { algorithm: 'HS256' },
      );

      await RefreshToken.create(clientId, user.id, newRefreshToken);

      return new LoginPayload(user, accessToken, newRefreshToken);
    } catch (e) {
      console.error(e);
      throw new Error('Could not log in user');
    }
  }
}
