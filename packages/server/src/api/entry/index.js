import { Router } from 'express';

import send from '../send';
import createEntry from './create-entry';

const router = Router();

const entries = [];

router.post('/create', (req, res) => {
  const { user } = req.session;
  send(createEntry(user, req.body, entries), res);
});

export default router;
