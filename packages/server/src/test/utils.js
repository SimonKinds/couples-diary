// @flow

export function user() {
  return {
    id: 'test-user-id',
    username: 'simonki',
    name: 'Simon',
    color: '#eaeaea',
    couple: 'test-couple-id',
  };
}

export function userWithoutCouple() {
  return { ...user(), couple: null };
}

export function userWithPassword(): UserWithPassword {
  return Object.assign({}, user(), { password: 'password' });
}
