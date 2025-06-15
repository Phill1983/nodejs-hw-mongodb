import express from 'express';
import cors from 'cors';
import pino from 'pino';
import { handleGetAllContacts } from './controllers/contactsController.js';
import { handleGetContactById } from './controllers/contactsController.js';

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

  app.get('/contacts', handleGetAllContacts);
  app.get('/contacts/:contactId', handleGetContactById);

  // Not found handler
  app.use((req, res) => {
    res.status(404).json({ message: 'Not found' });
  });

  const PORT = process.env.PORT || 10000;

  app.listen(PORT, () => {
    logger.info(`Server is running on port ${PORT}`);
  });
};
