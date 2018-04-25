// @flow

export default function createUser(
  requestBody: mixed,
  users: Array<UserWithPassword>,
) {
  const user = parse(requestBody);

  if (!user) {
    return { status: 400 };
  }

  if (usernameTaken(user.username, users)) {
    return { status: 409, body: { reason: 'Username is taken' } };
  }

  users.push(user);
  const { password, ...rest } = user;
  return { status: 200, body: rest };
}

function usernameTaken(username: string, users: Array<UserWithPassword>) {
  return users.some(user => username === user.username);
}

function parse(body: mixed): ?UserWithPassword {
  if (
    body != null &&
    typeof body === 'object' &&
    body.username != null &&
    typeof body.username === 'string' &&
    body.name != null &&
    typeof body.name === 'string' &&
    body.color != null &&
    typeof body.color === 'string' &&
    body.password != null &&
    typeof body.password === 'string'
  ) {
    const {
      username, name, color, password,
    } = body;

    return {
      username,
      name,
      color,
      password,
      couple: null,
    };
  }

  return null;
}
