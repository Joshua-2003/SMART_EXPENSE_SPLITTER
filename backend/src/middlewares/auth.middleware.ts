import type { NextFunction, Request, RequestHandler, Response } from 'express';

import { verifyAccessToken } from '../utils/jwt.js';
import { HttpError } from '../utils/http-error.js';
import type { JwtPayload } from '../types/auth.js';

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Express {
    interface Request {
      user?: JwtPayload;
    }
  }
}

export const authenticate: RequestHandler = (req: Request, _res: Response, next: NextFunction) => {
  const authorizationHeader = req.headers.authorization;

  if (!authorizationHeader || !authorizationHeader.startsWith('Bearer ')) {
    next(new HttpError(401, 'UNAUTHORIZED', 'Invalid or missing token'));
    return;
  }

  const token = authorizationHeader.slice('Bearer '.length).trim();

  try {
    req.user = verifyAccessToken(token);
    next();
  } catch {
    next(new HttpError(401, 'UNAUTHORIZED', 'Invalid or missing token'));
  }
};