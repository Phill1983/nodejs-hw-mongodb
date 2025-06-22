import express from 'express';
import cors from 'cors';
import pino from 'pino';
import { initMongoConnection } from './db/initMongoConnection.js';
import contactsRouter from './routers/contactsRouter.js';
import { notFoundHandler } from './middlewares/notFoundHandler.js';
import { errorHandler } from './middlewares/errorHandler.js';


const logger = pino(({
  transport: {
    target: 'pino-pretty',
    options: {
      colorize: true,
    },
  },
}));

export const setupServer = async () => {
  const app = express();

  app.use(cors());
  app.use(express.json());

  app.use('/contacts', contactsRouter);

  app.use(notFoundHandler);
  app.use(errorHandler);


  

  const PORT = process.env.PORT || 10000;

  await initMongoConnection();
  app.listen(PORT, () => {
    logger.info(`Server is running on port ${PORT}`);
  });
};
