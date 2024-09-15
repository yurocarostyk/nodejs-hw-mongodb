import express from 'express';
import cors from 'cors';
import pino from 'pino-http';

import { env } from './utils/env.js';

import { notFoundHandler } from './middlewares/notFoundHandler.js';
import { errorHandler } from './middlewares/errorHandler.js';

import ContactsRouter from './routers/contacts.js';


const PORT = Number(env('PORT', '3000'));

export const setupServer = () => {
  const app = express();

  app.use(express.json());
  app.use(cors());

  app.use(
    pino({
      transport: {
        target: 'pino-pretty',
      },
    }),
  );

  app.get('/', (req, res, next) => {
    res.json({
      message: 'Hello World!',
    });
  });

  app.use('/contacts', ContactsRouter);

  app.use(notFoundHandler);

  app.use(errorHandler);

  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
};