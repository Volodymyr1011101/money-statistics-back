import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';

import authRouter from './routers/auth.js';
import categoriesRouter from './routers/categories.js';
import userRouter from './routers/user.js';
import transactionRouter from './routers/transactions.js';

import { getEnvVariable } from './utils/getEnvVariable.js';
import { notFoundHandler } from './middleware/notFoundHandler.js';
import { errorHandler } from './middleware/errorHandler.js';

dotenv.config();
export const startServer = () => {
  const app = express();

  app.use(cors());
  app.use(cookieParser());
  app.use(express.json());

  app.get('/ping', (req, res) => {
    res.json({
      message: 'Pong!',
    });
  });

  app.use('/auth', authRouter);
  app.use('/categories', categoriesRouter);
  app.use('transactions/', transactionRouter);
  app.use('/user', userRouter);

  app.use(notFoundHandler);

  app.use(errorHandler);

  const port = Number(getEnvVariable('PORT', 3000));

  app.listen(port, () => {
    console.log(`Server started on port ${port}`);
  });
};
