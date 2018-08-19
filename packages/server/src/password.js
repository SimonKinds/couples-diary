import { hash, compare } from 'bcrypt';

const SALT_ROUNDS = 10;

export const hashPassword = plaintext => hash(plaintext, SALT_ROUNDS);
export const doesPasswordMatchHash = (password, hash) =>
  compare(password, hash);
