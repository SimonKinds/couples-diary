// @flow

import { Router } from 'express';
import type { $Request } from 'express';

import send from '../send';
import { hash, comparePasswordToHash } from './password';
import createUser from './create-user';
import loginUser from './login-user';

const router = Router();

const users = [];

router.post('/create', (req: $Request, res) => {
  send(createUser(req.body, users, hash), res);
});

router.post('/login', (req: $Request, res) => {
  send(
    loginUser(req.body, users, saveUserInSession(req), comparePasswordToHash),
    res,
  );
});

function saveUserInSession(req: $Request) {
  return (user: User) => {
    // $FlowFixMe: Not in flow-typed
    req.session.user = user;
  };
}

export default router;
