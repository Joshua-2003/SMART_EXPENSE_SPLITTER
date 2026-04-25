import express, { Express, Request, Response, NextFunction } from 'express';
import cors from 'cors';
import * as dotenv from 'dotenv';

// Config imports
import { corsConfig, serverConfig } from '@config/index.js';

// Middleware imports
import { errorHandler, notFoundHandler } from '@middlewares/errorHandler.js';

// Route imports (will be added as implementation progresses)
import authRoutes from '@routes/authRoutes.js';
// import userRoutes from '@routes/userRoutes';
// import groupRoutes from '@routes/groupRoutes';
// import expenseRoutes from '@routes/expenseRoutes';
// import accountabilityRoutes from '@routes/accountabilityRoutes';
// import notificationRoutes from '@routes/notificationRoutes';

dotenv.config();

/**
 * Initialize Express Application
 */
export function createApp(): Express {
  const app = express();

  // =====================================================================
  // MIDDLEWARE SETUP
  // =====================================================================

  // Body parser middleware
  app.use(express.json({ limit: '10mb' }));
  app.use(express.urlencoded({ limit: '10mb', extended: true }));

  // CORS middleware
  app.use(cors(corsConfig));

  // Request logging middleware (optional)
  app.use((_req: Request, _res: Response, next: NextFunction) => {
    console.log(`[${new Date().toISOString()}] ${_req.method} ${_req.path}`);
    next();
  });

  // =====================================================================
  // HEALTH CHECK ENDPOINT
  // =====================================================================

  app.get('/api/health', (_req: Request, res: Response) => {
    res.status(200).json({
      status: 'success',
      data: {
        message: 'Smart Expense Splitter API is running',
        environment: serverConfig.environment,
        version: '1.0.0',
      },
      timestamp: new Date().toISOString(),
    });
  });

  // =====================================================================
  // ROUTE SETUP
  // =====================================================================

  // Authentication routes
  app.use('/api/auth', authRoutes);

  // Routes will be mounted here by Backend Implementation Agent
  // app.use('/api/users', userRoutes);
  // app.use('/api/groups', groupRoutes);
  // app.use('/api/expenses', expenseRoutes);
  // app.use('/api/accountability', accountabilityRoutes);
  // app.use('/api/notifications', notificationRoutes);

  // =====================================================================
  // ERROR HANDLING MIDDLEWARE
  // =====================================================================

  // Not found handler (must be after all routes)
  app.use(notFoundHandler);

  // Error handler (must be last)
  app.use(errorHandler);

  return app;
}

export default createApp;
