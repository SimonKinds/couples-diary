import { user, userWithPassword } from '../../../test/utils';
import loginUser from './login-user';

describe('login user route', () => {
  test('success returns user', () => {
    const users = [userWithPassword()];

    return expect(
      loginUser(credentials(), users, nullFunc, comparePasswordToHash)
    ).resolves.toEqual({
      status: 200,
      body: user(),
    });
  });

  test('success sets session', () => {
    const users = [userWithPassword()];
    const saveUserInSession = jest.fn();

    // $FlowFixMe
    return loginUser(
      credentials(),
      users,
      saveUserInSession,
      comparePasswordToHash
    ).then(() => {
      expect(saveUserInSession.mock.calls).toHaveLength(1);
      expect(saveUserInSession.mock.calls[0]).toEqual([user()]);
    });
  });

  test('no users', () => {
    const users = [];
    const saveUserInSession = jest.fn();

    expect(
      loginUser(credentials(), users, saveUserInSession, comparePasswordToHash)
    ).resolves.toEqual({
      status: 404,
      body: { reason: 'username/password combination not found' },
    });
  });

  test('username not found', () => {
    const users = [{ ...userWithPassword(), username: 'somethingelse' }];
    const saveUserInSession = jest.fn();

    expect(
      loginUser(credentials(), users, saveUserInSession, comparePasswordToHash)
    ).resolves.toEqual({
      status: 404,
      body: { reason: 'username/password combination not found' },
    });

    expect(saveUserInSession.mock.calls).toHaveLength(0);
  });

  test('incorrect password', () => {
    const users = [{ ...userWithPassword(), password: 'somethingelse' }];
    const saveUserInSession = jest.fn();

    expect(
      loginUser(credentials(), users, saveUserInSession, comparePasswordToHash)
    ).resolves.toEqual({
      status: 404,
      body: { reason: 'username/password combination not found' },
    });

    expect(saveUserInSession.mock.calls).toHaveLength(0);
  });

  describe('parses', () => {
    test('username is required', () => {
      const body = credentials();
      delete body.username;

      expect(loginUser(body, [], nullFunc, comparePasswordToHash)).toEqual({
        status: 400,
      });
    });
  });
});

function credentials() {
  const { username, password } = userWithPassword();
  return {
    username,
    password,
  };
}

function nullFunc() {}

function comparePasswordToHash(password, hash) {
  return Promise.resolve(password === hash);
}
