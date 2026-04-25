import * as dotenv from 'dotenv';

dotenv.config();

export const databaseConfig = {
  url: process.env.DATABASE_URL || 'postgresql://localhost:5432/expense_splitter',
  poolSize: 20,
  idleTimeout: 30000,
  connectionTimeout: 5000,
  maxLifetimeSeconds: 1800,
};

export default databaseConfig;
