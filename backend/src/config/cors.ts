import * as dotenv from 'dotenv';

dotenv.config();

const corsOriginString = process.env.CORS_ORIGIN || 'http://localhost:5173';
const corsOrigins = corsOriginString.split(',').map((origin) => origin.trim());

export const corsConfig = {
  origin: corsOrigins,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  optionsSuccessStatus: 200,
};

export default corsConfig;
