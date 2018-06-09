import { userWithPassword, userWithoutCouple, user } from '../../../test/utils';
import createUser from './create-user';

describe('create user route', () => {
  test('success', () =>
    expect(createUserTest(userWithPassword(), [])).resolves.toEqual({
      status: 200,
      body: userWithoutCouple(),
    }));

  test('username taken', () => {
    const users = [userWithPassword()];

    expect(createUserTest(userWithPassword(), users)).toEqual({
      status: 409,
      body: { reason: 'Username is taken' },
    });
  });

  describe('invalid body', () => {
    test('empty', () => {
      expect(createUserTest({}, [])).toEqual({
        status: 400,
      });
    });

    test('missing username', () => {
      const body = userWithPassword();
      delete body.username;
      expect(createUserTest(body, [])).toEqual({
        status: 400,
      });
    });

    test('missing name', () => {
      const body = userWithPassword();
      delete body.name;
      expect(createUserTest(body, [])).toEqual({
        status: 400,
      });
    });

    test('missing password', () => {
      const body = userWithPassword();
      delete body.password;
      expect(createUserTest(body, [])).toEqual({
        status: 400,
      });
    });
  });
});

function createUserTest(body, users) {
  return createUser(body, users, generateId, hash);
}

function hash(password) {
  return Promise.resolve(password);
}

function generateId() {
  return user().id;
}
