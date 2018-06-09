export default function loginUser(
  body,
  users,
  saveUserInSession,
  comparePasswordToHash
) {
  const credentials = parse(body);
  if (!credentials) {
    return invalidBody();
  }

  return findUser(credentials, users, comparePasswordToHash).then(user => {
    if (user == null) {
      return userNotFound();
    }

    saveUserInSession(user);
    return { status: 200, body: user };
  });
}

function parse(body) {
  if (
    body != null &&
    typeof body === 'object' &&
    body.username != null &&
    typeof body.username === 'string' &&
    body.password != null &&
    typeof body.password === 'string'
  ) {
    const { username, password } = body;

    return {
      username,
      password,
    };
  }

  return null;
}

function findUser(credentials, users, comparePasswordToHash) {
  return new Promise(resolve => {
    const result = users.find(
      ({ username }) => credentials.username === username
    );
    if (result) {
      const { password, ...user } = result;
      return resolve(
        comparePasswordToHash(credentials.password, password).then(
          isEqual => (isEqual ? user : null)
        )
      );
    }

    return resolve(null);
  });
}

function invalidBody() {
  return { status: 400 };
}

function userNotFound() {
  return {
    status: 404,
    body: { reason: 'username/password combination not found' },
  };
}
