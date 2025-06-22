import express from 'express';
import {
  handleGetAllContacts,
  handleGetContactById,
  handleAddContact,
    handleRemoveContact,
    handleUpdateContact
} from '../controllers/contactsController.js';
import { ctrlWrapper } from '../utils/ctrlWrapper.js';


const contactsRouter = express.Router();

contactsRouter.get('/', ctrlWrapper(handleGetAllContacts));
contactsRouter.get('/:contactId', ctrlWrapper(handleGetContactById));
contactsRouter.post('/', ctrlWrapper(handleAddContact)); 
contactsRouter.delete('/:contactId', ctrlWrapper(handleRemoveContact));
contactsRouter.patch('/:contactId', ctrlWrapper(handleUpdateContact));
export default contactsRouter;
