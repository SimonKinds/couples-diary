// @flow
import createUser from './create-user';

describe('API', () => {
  describe('create user', () => {
    test('success', () => {
      expect(createUser(userWithPassword(), [])).toEqual({
        status: 200,
        body: user(),
      });
    });

    test('username taken', () => {
      const users = [userWithPassword()];

      expect(createUser(userWithPassword(), users)).toEqual({
        status: 409,
        body: { reason: 'Username is taken' },
      });
    });

    describe('invalid body', () => {
      test('empty', () => {
        expect(createUser({}, [])).toEqual({
          status: 400,
        });
      });

      test('missing username', () => {
        const body = userWithPassword();
        delete body.username;
        expect(createUser(body, [])).toEqual({
          status: 400,
        });
      });

      test('missing name', () => {
        const body = userWithPassword();
        delete body.name;
        expect(createUser(body, [])).toEqual({
          status: 400,
        });
      });

      test('missing password', () => {
        const body = userWithPassword();
        delete body.password;
        expect(createUser(body, [])).toEqual({
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
