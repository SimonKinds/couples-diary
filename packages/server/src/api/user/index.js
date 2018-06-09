import { Router } from 'express';

import send from '../send';
import { hash, comparePasswordToHash } from './password';
import generateId from './generate-id';
import createUser from './create-user';
import loginUser from './login-user';

const router = Router();

const users = [];

router.post('/create', (req, res) => {
  send(createUser(req.body, users, generateId, hash), res);
});

router.post('/login', (req, res) => {
  send(
    loginUser(req.body, users, saveUserInSession(req), comparePasswordToHash),
    res
  );
});

function saveUserInSession(req) {
  return user => {
    req.session.user = user;
  };
}

export default router;
