// @flow

export default function createUser(
  requestBody: mixed,
  users: Array<UserWithPassword>,
  generateId: () => string,
  hash: (password: string) => Promise<string>
): ApiResponse | Promise<ApiResponse> {
  const user = parse(requestBody);

  if (!user) {
    return { status: 400 };
  }

  if (usernameTaken(user.username, users)) {
    return { status: 409, body: { reason: 'Username is taken' } };
  }

  return hash(user.password).then(hashedPassword => {
    const hydratedUser = {
      ...user,
      id: generateId(),
      password: hashedPassword,
    };
    users.push(hydratedUser);

    const { id, username, name, color, couple } = hydratedUser;
    return { status: 200, body: { id, username, name, color, couple } };
  });
}

function usernameTaken(username: string, users: Array<UserWithPassword>) {
  return users.some(user => username === user.username);
}

function parse(body: mixed) {
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
    const { username, name, color, password } = body;

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
