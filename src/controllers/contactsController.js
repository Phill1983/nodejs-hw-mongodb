import {
  getAllContacts,
  getAllContactsCount,
  getContactById,
  createContact,
  updateContact,
  deleteContact,
} from '../services/contactsService.js';

import { uploadToCloudinary, cloudinaryDestroy } from '../utils/cloudinaryTools.js';
import { ctrlWrapper } from "../utils/ctrlWrapper.js";

// Отримати всі контакти
const getAllContactsController = async (req, res) => {
  const userId = req.user._id;
  const { page = 1, perPage = 10, sortBy = 'createdAt', sortOrder = 'asc' } = req.query;
  const skip = (page - 1) * perPage;

  const contacts = await getAllContacts(userId, skip, perPage, sortBy, sortOrder);
  const total = await getAllContactsCount(userId);
  const totalPages = Math.ceil(total / perPage);

  res.status(200).json({
    status: 200,
    message: 'Successfully found contacts!',
    data: {
      data: contacts,
      page: Number(page),
      perPage: Number(perPage),
      totalItems: total,
      totalPages,
      hasPreviousPage: Number(page) > 1,
      hasNextPage: Number(page) < totalPages,
    },
  });
};

// Отримати контакт за ID
const getContactByIdController = async (req, res) => {
  const { contactId } = req.params;
  const userId = req.user._id;

  const contact = await getContactById(contactId, userId);

  if (!contact) {
    return res.status(404).json({ message: 'Contact not found' });
  }

  res.status(200).json({
    status: 200,
    message: `Successfully found contact with id ${contactId}!`,
    data: contact,
  });
};

// Створити новий контакт
const createContactController = async (req, res) => {
  const { name, phoneNumber, email, isFavourite, contactType } = req.body;
  const userId = req.user._id;

  const photo = req.body.photo || null;
  const newContact = await createContact({
    name,
    phoneNumber,
    email,
    isFavourite,
    contactType,
    userId,
    photo,
  });

  res.status(201).json({
    status: 201,
    message: 'Contact created successfully!',
    data: newContact,
  });
};
// Оновити контакт
const updateContactController = async (req, res) => {
  const { contactId } = req.params;
  const userId = req.user._id;

  const existingContact = await getContactById(contactId, userId);
  if (!existingContact) {
    return res.status(404).json({ message: 'Contact not found' });
  }

  if (req.file) {
    if (existingContact.photo?.public_id) {
      await cloudinaryDestroy(existingContact.photo.public_id);
    }

    const result = await uploadToCloudinary(req.file.buffer, {
      folder: 'contacts_photos',
    });

    req.body.photo = {
      url: result.secure_url,
      public_id: result.public_id,
    };
  }

  const updatedContact = await updateContact(contactId, userId, req.body);
  if (!updatedContact) {
    return res.status(404).json({ message: 'Contact not found' });
  }

  const cleanContact = updatedContact.toObject?.() || updatedContact;
  delete cleanContact.__v;

  const photoValue =
    cleanContact.photo && typeof cleanContact.photo === 'object'
      ? cleanContact.photo
      : cleanContact.photo
      ? { url: cleanContact.photo }
      : null;

  res.status(200).json({
    status: 200,
    message: 'Contact updated successfully!',
    data: {
      ...cleanContact,
      photo: photoValue,
    },
  });
};

// Видалити контакт
const deleteContactController = async (req, res) => {
  const { contactId } = req.params;
  const userId = req.user._id;

  const deletedContact = await deleteContact(contactId, userId);
  if (!deletedContact) {
    return res.status(404).json({ message: 'Contact not found' });
  }

  res.status(204).send();
};

// Експорт обгорнутих контролерів
export const getAllContactsControllerWrapped = ctrlWrapper(getAllContactsController);
export const getContactByIdControllerWrapped = ctrlWrapper(getContactByIdController);
export const createContactControllerWrapped = ctrlWrapper(createContactController);
export const updateContactControllerWrapped = ctrlWrapper(updateContactController);
export const deleteContactControllerWrapped = ctrlWrapper(deleteContactController);
