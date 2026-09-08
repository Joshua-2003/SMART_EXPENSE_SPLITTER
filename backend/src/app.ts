import cors from 'cors';
import express from 'express';

import { corsOptions } from './config/cors.js';

export const app = express();

app.use(cors(corsOptions));
app.use(express.json());