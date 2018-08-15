import jwt from 'jsonwebtoken';
import { AuthenticationError } from 'apollo-server-express';

let cachedSecret;

const getSecret = () => {
  if (cachedSecret != null) {
    return cachedSecret;
  }

  const environmentSecret = process.env.JWT_SECRET;

  if (!environmentSecret) {
    // eslint-disable-next-line no-console
    console.warn(
      'Environment variable JWT_SECRET is not set and will therefore use default key. HIGHLY INSECURE'
    );
    cachedSecret = 'THIS IS A DEFAULT KEY PLEASE DO NOT USE ME';
  } else {
    cachedSecret = environmentSecret;
  }

  return cachedSecret;
};

export const temporaryToken = userId =>
  jwt.sign({ userId }, getSecret(), { expiresIn: '7d' });

export const verifyToken = (token, callback) => {
  if (!token) {
    return callback(null);
  }

  return jwt.verify(token, getSecret(), (err, decoded) => {
    if (err || decoded === undefined) {
      throw new AuthenticationError(`JWT decode error: ${err.message}`);
    }

    const { userId } = decoded;
    return callback(userId);
  });
};
