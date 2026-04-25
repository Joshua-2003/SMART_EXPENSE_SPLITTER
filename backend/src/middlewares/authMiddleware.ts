import { Request, Response, NextFunction } from 'express';
import { AuthenticationError } from '@/utils/errorUtils.js';
import { verifyToken } from '@/utils/jwtUtils.js';  

export interface AuthenticatedRequest extends Request {
  userId?: string;
}

export const authMiddleware = (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): void => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      throw new AuthenticationError();
    }

    const token = authHeader.split(" ")[1];
    const payload = verifyToken(token);

    if (!payload) {
      throw new AuthenticationError();
    }

    req.userId = payload.userId;

    next();
  } catch (error) {
    next(error);
  }
};

