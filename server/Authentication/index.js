// @flow

// eslint-disable-next-line no-unused-vars
import regeneratorRuntime from 'regenerator-runtime'; // required for async
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import User from '../models/User';
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

const authenticateLogin = async (email: string, password: string): Promise<LoginPayload> => {
  try {
    const [user, hashedPassword] = await User.getUserAndPasswordForEmail(email);
    if (!await bcrypt.compare(password, hashedPassword)) {
      throw new Error('Mismatched password');
    }
    const accessToken = jwt.sign(
      { id: user.id }, JwtSecret.accessTokenKey,
      { algorithm: 'HS256', expiresIn: '1h' },
    );
    const refreshToken = jwt.sign(
      { id: user.id }, JwtSecret.refreshTokenKey,
      { algorithm: 'HS256' },
    );
    return new LoginPayload(user, accessToken, refreshToken);
  } catch (e) {
    console.error(e);
    throw new Error('Could not log in user');
  }
};

export default authenticateLogin;
