import { Router } from 'express';

import { authRouter } from './auth.routes.js';
import { userRouter } from './user.routes.js';

export const router = Router();

router.use('/auth', authRouter);
router.use('/users', userRouter);