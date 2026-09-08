import jwt from 'jsonwebtoken';

import { env } from '../config/env.js';
import type { JwtPayload } from '../types/auth.js';

export const TOKEN_EXPIRES_IN_SECONDS = 86400;

export function signAccessToken(payload: JwtPayload): string {
  return jwt.sign(payload, env.jwtSecret, { expiresIn: TOKEN_EXPIRES_IN_SECONDS });
}

export function verifyAccessToken(token: string): JwtPayload {
  const decoded = jwt.verify(token, env.jwtSecret);
  if (typeof decoded === 'string' || !decoded.userId || !decoded.email) {
    throw new jwt.JsonWebTokenError('Invalid token payload');
  }
  return { userId: decoded.userId, email: decoded.email };
}
