import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';
import { databaseConfig } from '@config/database';
import { sql } from 'drizzle-orm';
import * as schema from '@models/schema';

/**
 * Database Connection Setup
 * Uses Drizzle ORM with PostgreSQL
 */

let pool: Pool | null = null;

/**
 * Initialize database pool
 */
function initializePool(): Pool {
  if (!pool) {
    pool = new Pool({
      connectionString: databaseConfig.url,
      max: databaseConfig.poolSize, // Maximum number of connections in the pool. For example 20 max - Meaning 20 connections can be open at the same time. If all connections are in use, additional requests will wait until a connection is released back to the pool.
      idleTimeoutMillis: databaseConfig.idleTimeout, // For example 30000 ms (30 seconds) - This is the time a connection can remain idle before being closed. If a connection is idle for longer than this duration, it will be automatically closed to free up resources.
      connectionTimeoutMillis: databaseConfig.connectionTimeout, // For example 5000 ms (5 seconds) - This is the time to wait for a connection to be established before timing out. If a connection cannot be established within this time frame, an error will be thrown.
    });

    pool.on('error', (err) => { // For detection of unexpected errors on idle clients in the pool like network issues or database restarts. This helps in logging and debugging connection issues.
      console.error('Unexpected error on idle client', err);
      process.exit(-1); // Exit the process with an error code to indicate a failure. This is important because if the database connection is lost, the application cannot function properly, so it's better to restart it and attempt to reconnect.
    });
  }

  return pool;
}

/**
 * Create Drizzle ORM instance
 */
export const db = drizzle(initializePool(), { schema }); // Drizzle ORM instance na gagamitin natin sa buong application para mag interact sa database gamit yung defined schema at mga query builders ng Drizzle. We use to pass the pool para sya na ang mag handle ng database connections efficiently through connection pooling

/**
 * Close database connection
 */
export async function closeDatabase(): Promise<void> {
  if (pool) {
    await pool.end();
    pool = null;
  }
}

/**
 * Test database connection
 */
export async function testDatabaseConnection(): Promise<boolean> {
  try {
    const result = await db.execute(sql`SELECT NOW()`);
    console.log('✓ Database connection successful');
    return true;
  } catch (error) {
    console.error('✗ Database connection failed:', error);
    return false;
  }
}

export default db;
