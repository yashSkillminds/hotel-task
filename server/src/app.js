import express from 'express';
import authRouter from './routes/auth.routes.js';
import userRouter from './routes/user.routes.js';
import adminRouter from './routes/admin.routes.js';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import { SIZE_LIMIT } from './constants/constants.js';
import { errorHandler } from './middlewares/errorHandler.middleware.js';
import { logger } from './middlewares/logger.middleware.js';
import morgan from 'morgan';

const app = express();

// Health Route
app.get('/api/health', (_, res) => res.json({ status: 'ok' }));

// app.use(
//   cors({
//     origin: process.env.CLIENT_ORIGIN,
//     credentials: true,
//   }),
// );
app.use(express.json({ limit: SIZE_LIMIT }));
app.use(express.urlencoded({ extended: true, limit: SIZE_LIMIT }));
app.use(cookieParser());
app.use(
  morgan('combined', {
    stream: {
      write: (message) => logger.info(message.trim()),
    },
  }),
);

app.get('/', (_, res) => res.send('Hello!'));
app.use('/api/v1/auth', authRouter);
app.use('/api/v1', userRouter);
app.use('/api/v1', adminRouter);

app.use(errorHandler);

export { app };
