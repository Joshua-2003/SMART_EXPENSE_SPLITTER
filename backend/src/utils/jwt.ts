import jwt from 'jsonwebtoken';

import { env } from '../config/env.js';
import type { JwtPayload } from '../types/auth.js';

const TOKEN_EXPIRES_IN = '24h';

export function signAccessToken(payload: JwtPayload): string {
  return jwt.sign(payload, env.jwtSecret, { expiresIn: TOKEN_EXPIRES_IN });
}
