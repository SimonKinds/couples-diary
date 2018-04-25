// @flow
import api from './api';

type User = {
  username: string,
  name: string,
  color: string,
  couple: ?string,
};

type UserWithPassword = User & {
  password: string,
};

describe('API', () => {
  describe('create user', () => {
    test('success', () => {
      expect(api.createUser(userWithPassword(), [])).toEqual({
        status: 200,
        body: user(),
      });
    });

    test('username taken', () => {
      const users = [userWithPassword()];

      expect(api.createUser(userWithPassword(), users)).toEqual({
        status: 409,
        body: { reason: 'Username is taken' },
      });
    });

    describe('invalid body', () => {
      test('empty', () => {
        expect(api.createUser({}, [])).toEqual({
          status: 400,
        });
      });

      test('missing username', () => {
        const body = userWithPassword();
        delete body.username;
        expect(
          api.createUser(
            body,
            [],
          ),
        ).toEqual({
          status: 400,
        });
      });

      test('missing name', () => {
        const body = userWithPassword();
        delete body.name;
        expect(
          api.createUser(
            body,
            [],
          ),
        ).toEqual({
          status: 400,
        });
      });

      test('missing password', () => {
        const body = userWithPassword();
        delete body.password;
        expect(
          api.createUser(
            body,
            [],
          ),
        ).toEqual({
          status: 400,
        });
      });
    });
  });
});

function user(): User {
  return {
    username: 'simonki',
    name: 'Simon',
    color: '#eaeaea',
    couple: null,
  };
}

function userWithPassword(): UserWithPassword {
  return Object.assign({}, user(), { password: 'password' });
}
