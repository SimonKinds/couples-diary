// @flow

import { Router } from 'express';
import type { $Request } from 'express';

import send from '../send';
import createEntry from './create-entry';

const router = Router();

const entries = [];

router.post('/create', (req: $Request, res) => {
  // $FlowFixMe
  const { user }: { user: ?User } = req.session;
  send(createEntry(user, req.body, entries), res);
});

export default router;
