import { hash as bcryptHash, compare as bcryptCompare } from 'bcrypt';

const ROUNDS = 15;

export function hash(password) {
  return bcryptHash(password, ROUNDS);
}

export function comparePasswordToHash(password, hashedPassword) {
  return bcryptCompare(password, hashedPassword);
}
