import cors from 'cors';
import express from 'express';

import { corsOptions } from './config/cors.js';
import { errorHandler, notFoundHandler } from './middlewares/error.middleware.js';
import { router } from './routes/index.js';

export const app = express();

app.use(cors(corsOptions));
app.use(express.json());

app.use('/api', router);

app.use(notFoundHandler);
app.use(errorHandler);