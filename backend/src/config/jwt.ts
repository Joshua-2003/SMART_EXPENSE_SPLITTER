import * as dotenv from 'dotenv';

dotenv.config();

export const jwtConfig = {
  secret: process.env.JWT_SECRET || 'default-secret-change-in-production',
  expiration: process.env.JWT_EXPIRATION || '24h',
  algorithm: 'HS256' as const,
};

export default jwtConfig;
