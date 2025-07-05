import express from 'express';
import {
  getAllContactsController,
  getContactByIdController,
  createContactController,
  updateContactController,
  deleteContactController,
} from '../controllers/contactsController.js';
import authenticate from '../middlewares/authenticate.js';

const router = express.Router();

router.get('/', authenticate, getAllContactsController);
router.get('/:contactId', authenticate, getContactByIdController);
router.post('/', authenticate, createContactController);
router.put('/:contactId', authenticate, updateContactController);
router.delete('/:contactId', authenticate, deleteContactController);

export default router;
