// @flow
import { userWithPassword, userWithoutCouple } from '../../../test/utils';
import createUser from './create-user';

describe('create user route', () => {
  test('success', () =>
    expect(createUser(userWithPassword(), [], hash)).resolves.toEqual({
      status: 200,
      body: userWithoutCouple(),
    }));

  test('username taken', () => {
    const users = [userWithPassword()];

    expect(createUser(userWithPassword(), users, hash)).toEqual({
      status: 409,
      body: { reason: 'Username is taken' },
    });
  });

  describe('invalid body', () => {
    test('empty', () => {
      expect(createUser({}, [], hash)).toEqual({
        status: 400,
      });
    });

    test('missing username', () => {
      const body = userWithPassword();
      delete body.username;
      expect(createUser(body, [], hash)).toEqual({
        status: 400,
      });
    });

    test('missing name', () => {
      const body = userWithPassword();
      delete body.name;
      expect(createUser(body, [], hash)).toEqual({
        status: 400,
      });
    });

    test('missing password', () => {
      const body = userWithPassword();
      delete body.password;
      expect(createUser(body, [], hash)).toEqual({
        status: 400,
      });
    });
  });
});

function hash(password: string) {
  return Promise.resolve(password);
}
