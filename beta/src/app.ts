import cors from 'cors';
import express from 'express';
import { env } from './config/env.js';
import router from './routes/index.js';

export const app = express();

app.use(cors({ origin: env.corsOrigin }));
app.use(express.json());

app.use('/api/v1', router);
