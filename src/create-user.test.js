// @flow

import createUser from './create-user.js';

test('Sign ups with same email are denied', () => {
  expect(createUser('test@test.com')).toBe(true);
  expect(createUser('test@test.com')).toBe(false);
  expect(createUser('test2@test.com')).toBe(true);
});

test('Sign up requires valid email', () => {
  expect(createUser('')).toBe(false);
  expect(createUser('email')).toBe(false);
  expect(createUser('@')).toBe(false);
  expect(createUser('email@')).toBe(false);
  expect(createUser('email@t')).toBe(false);
  expect(createUser('email@t.')).toBe(false);
  expect(createUser('email@.c')).toBe(false);
  expect(createUser('email@.c')).toBe(false);
});
