import jwt from 'jsonwebtoken';
import { jwtConfig } from '@config/jwt.js';

interface TokenPayload {
  userId: string;
  iat?: number;
  exp?: number;
}

/**
 * Generate a JWT token for a user
 * @param userId - UUID of the user
 * @returns JWT token string
 */
export function generateToken(userId: string): string {
  return jwt.sign(
    { userId },
    jwtConfig.secret,
    {
      algorithm: jwtConfig.algorithm,
      expiresIn: jwtConfig.expiration,
    } as any
  );
}

/**
 * Verify and decode a JWT token
 * @param token - JWT token string
 * @returns Object with userId if valid, null if invalid
 */
export function verifyToken(token: string): TokenPayload | null {
  try {
    const decoded = jwt.verify(token, jwtConfig.secret, {
      algorithms: [jwtConfig.algorithm as any],
    });
    return decoded as TokenPayload;
  } catch (error) {
    return null;
  }
}

/**
 * Decode a JWT token without verification (for debugging only)
 * @param token - JWT token string
 * @returns Decoded payload or null if invalid
 */
export function decodeToken(token: string): TokenPayload | null {
  try {
    const decoded = jwt.decode(token);
    return decoded as TokenPayload | null;
  } catch (error) {
    return null;
  }
}
