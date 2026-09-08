import { Router } from 'express';

import { authRouter } from './auth.routes.js';
import { userRouter } from './user.routes.js';
import { groupRouter } from './group.routes.js';

export const router = Router();

router.use('/auth', authRouter);
router.use('/users', userRouter);
router.use('/groups', groupRouter);