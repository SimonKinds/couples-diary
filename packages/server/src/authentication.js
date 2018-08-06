import jwt from 'jsonwebtoken';

const secret = 'TEMP KEY CHANGE ME';

export const temporaryToken = userId =>
  jwt.sign({ userId }, secret, { expiresIn: '7d' });

export const verifyToken = (token, callback) => {
  if (!token) {
    return callback(null);
  }

  return jwt.verify(token, secret, (err, { userId }) => {
    if (err) {
      // eslint-disable-next-line no-console
      console.error(err);
    }

    return callback(userId);
  });
};
