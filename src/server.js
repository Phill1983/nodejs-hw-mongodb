import express from 'express';
import cors from 'cors';
import pino from 'pino';
// import { handleGetAllContacts } from './controllers/contactsController.js';
// import { handleGetContactById } from './controllers/contactsController.js';
import contactsRouter from './routers/contacts.js';
import authRouter from './routers/auth.js';
import cookieParser from 'cookie-parser';

const logger = pino(({
  transport: {
    target: 'pino-pretty',
    options: {
      colorize: true,
    },
  },
}));

export const setupServer = () => {
  const app = express();

  app.use(cors());
  app.use(express.json());
  app.use(cookieParser());
  app.use('/api/contacts', contactsRouter);
  app.use('/api/auth', authRouter);
 

  // app.get('/contacts', handleGetAllContacts);
  // app.get('/contacts/:contactId', handleGetContactById);

  // Not found handler
  app.use((req, res) => {
    res.status(404).json({ message: 'Not found' });
  });

  const PORT = process.env.PORT || 3000;

  app.listen(PORT, () => {
    logger.info(`Server is running on port ${PORT}`);
  });
};
