import { Router } from 'express';
import * as authController from '@/controllers/authController.js';
import { validateSignup, validateLogin } from '@/validators/auth.validator.js';
import { authMiddleware } from '@/middlewares/authMiddleware.js';

const router = Router();

router.get('/me', authMiddleware, authController.getMe);    

/**
 * POST /api/auth/signup
 * Register a new user account
 */
router.post('/signup', validateSignup, authController.signup);

/**
 * POST /api/auth/login
 * Authenticate user and return JWT token
 */
router.post('/login', validateLogin, authController.login);

/**
 * POST /api/auth/refresh
 * Refresh expired JWT token (not in MVP)
 * 
 * Request header: Authorization: Bearer {refresh_token}
 * Response: { token, expiresIn }
 * Status: 501 Not Implemented
 */
router.post('/refresh', authController.refresh);

export default router;
