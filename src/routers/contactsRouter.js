import express from "express";

import {
  handleGetAllContacts,
  handleGetContactById,
  handleAddContact,
  handleRemoveContact,
  handleUpdateContact
} from "../controllers/contactsController.js";

import { ctrlWrapper } from "../utils/ctrlWrapper.js";

import validateBody from "../middlewares/validateBody.js";
import isValidId from "../middlewares/isValidId.js";
import { addContactSchema, updateContactSchema } from "../schemas/contactsSchemas.js";

const contactsRouter = express.Router();

contactsRouter.get('/', ctrlWrapper(handleGetAllContacts));

contactsRouter.get('/:contactId', isValidId, ctrlWrapper(handleGetContactById));

contactsRouter.post(
  '/',
  validateBody(addContactSchema),
  ctrlWrapper(handleAddContact)
);

contactsRouter.delete('/:contactId', isValidId, ctrlWrapper(handleRemoveContact));

contactsRouter.patch(
  '/:contactId',
  isValidId,
  validateBody(updateContactSchema),
  ctrlWrapper(handleUpdateContact)
);

export default contactsRouter;
