// @flow

import { Router } from 'express';
import userRoute from './user';
import entryRoute from './entry';

const router = Router();
router.use('/user', userRoute);
router.use('/entry', entryRoute);

export default router;
