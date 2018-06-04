// @flow

import { hash as bcryptHash, compare as bcryptCompare } from 'bcrypt';

const ROUNDS = 15;

export function hash(password: string) {
  return bcryptHash(password, ROUNDS);
}

export function comparePasswordToHash(
  password: string,
  hashedPassword: string
) {
  return bcryptCompare(password, hashedPassword);
}
