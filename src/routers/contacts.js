import express from 'express';
import {
  getAllContactsControllerWrapped,
  getContactByIdControllerWrapped,
  createContactControllerWrapped,
  updateContactControllerWrapped,
  deleteContactControllerWrapped,
} from '../controllers/contactsController.js';
import authenticate from '../middlewares/authenticate.js';
import isValidId from '../middlewares/isValidId.js';
import upload from "../middlewares/upload.js"; 
import { cloudinaryUpload } from "../middlewares/cloudinaryUpload.js";

const router = express.Router();

router.get('/', authenticate, getAllContactsControllerWrapped);
router.get('/:contactId', authenticate, isValidId, getContactByIdControllerWrapped);
router.patch('/:contactId', authenticate, isValidId, upload.single("photo"), cloudinaryUpload, updateContactControllerWrapped);
router.delete('/:contactId', authenticate, isValidId, deleteContactControllerWrapped);
router.post("/", authenticate, upload.single("photo"), cloudinaryUpload, createContactControllerWrapped);

export default router;
