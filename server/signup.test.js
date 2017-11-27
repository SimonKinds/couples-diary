// @flow

import signup from './signup.js';

test('Sign ups with same email are denied', () => {
  expect(signup('test@test.com')).toBe(true);
  expect(signup('test@test.com')).toBe(false);
  expect(signup('test2@test.com')).toBe(true);
});

test('Sign up requires valid email', () => {
  expect(signup('')).toBe(false);
  expect(signup('email')).toBe(false);
  expect(signup('@')).toBe(false);
  expect(signup('email@')).toBe(false);
  expect(signup('email@t')).toBe(false);
  expect(signup('email@t.')).toBe(false);
  expect(signup('email@.c')).toBe(false);
  expect(signup('email@.c')).toBe(false);
});
