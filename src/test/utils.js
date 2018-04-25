// @flow

export function user(): User {
  return {
    username: 'simonki',
    name: 'Simon',
    color: '#eaeaea',
    couple: null,
  };
}

export function userWithPassword(): UserWithPassword {
  return Object.assign({}, user(), { password: 'password' });
}
