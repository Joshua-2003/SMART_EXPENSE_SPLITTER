import { Router } from 'express';
import * as groupController from '@/controllers/groupController.js';
import { authMiddleware } from '@/middlewares/authMiddleware.js';

const router = Router();

router.get('/:groupId', authMiddleware, groupController.getGroupById);

router.post('/', authMiddleware, groupController.createGroup);

export default router;
