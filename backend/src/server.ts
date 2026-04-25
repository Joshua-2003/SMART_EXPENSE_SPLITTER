import { createApp } from './app';
import { serverConfig, databaseConfig } from '@config/index';
import { db, testDatabaseConnection, closeDatabase } from '@db/db';

/**
 * Start the Express server
 */
async function startServer(): Promise<void> {
  try {
    // Test database connection
    console.log('Testing database connection...');
    const dbConnected = await testDatabaseConnection();

    if (!dbConnected) {
      console.error('Failed to connect to database. Exiting...');
      process.exit(1);
    }

    // Create Express app
    const app = createApp();

    // Start listening
    const server = app.listen(serverConfig.port, () => {
      console.log(`
        ╔════════════════════════════════════════════════════════════╗
        ║  Smart Expense Splitter API Server                         ║
        ╠════════════════════════════════════════════════════════════╣
        ║  Environment: ${serverConfig.environment.padEnd(44)} ║
        ║  Port: ${serverConfig.port.toString().padEnd(52)} ║
        ║  Database: ${databaseConfig.url.substring(0, 44).padEnd(44)} ║
        ╠════════════════════════════════════════════════════════════╣
        ║  Server running at: http://localhost:${serverConfig.port}              ║
        ║  Health check: http://localhost:${serverConfig.port}/api/health         ║
        ╚════════════════════════════════════════════════════════════╝
      `);
    });

    // Graceful shutdown
    // Para sa system or 3rd party na need to send a signal to stop the server gracefully
    process.on('SIGTERM', async () => {
      console.log('SIGTERM received, shutting down gracefully...');
      server.close(async () => {
        await closeDatabase();
        process.exit(0);
      });
    });

    // Like for example na g cntrl + c ka sa terminal to stop the server
    process.on('SIGINT', async () => {
      console.log('SIGINT received, shutting down gracefully...');
      server.close(async () => {
        await closeDatabase();
        process.exit(0); // Sinasabi natin na successful exit (0) since this is a normal shutdown, not an error 
      });
    });

    // Sometimes may mga process tayo na wwalang try catch block, so we can catch unhandled promise rejections globally to prevent the server from crashing unexpectedly
    // So we can avoid a ghost error na bigla na lang mag crash yung server without any logs
    process.on('unhandledRejection', (reason: Error) => {
      console.error('Unhandled Rejection:', reason);
      process.exit(1); // Exit with failure code to indicate something went wrong
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
}

// Start the server
startServer();
