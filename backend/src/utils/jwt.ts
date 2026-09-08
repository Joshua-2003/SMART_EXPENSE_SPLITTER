import jwt from 'jsonwebtoken';

import { env } from '../config/env.js';
import type { JwtPayload } from '../types/auth.js';

export const TOKEN_EXPIRES_IN_SECONDS = 86400;

export function signAccessToken(payload: JwtPayload): string {
  return jwt.sign(payload, env.jwtSecret, { expiresIn: TOKEN_EXPIRES_IN_SECONDS });
}
