import {
  getAllContacts,
  getContactById,
  addContact,
  updateContact,
  removeContact,
  getContactsByType,
} from '../services/contactsService.js';
import createError from 'http-errors';

import mongoose from 'mongoose';

export const handleGetAllContacts = async (req, res) => {

  const { type } = req.query;
  let contacts;

  if (type) {
    contacts = await getContactsByType(type);

    if (contacts.length === 0) {
      throw createError(404, `No contacts found with type: ${type}`);
    }

    res.status(200).json({
      status: 200,
      message: `Successfully found contacts with type: ${type}`,
      data: contacts,
    });
    
  } else {
    contacts = await getAllContacts();

    res.status(200).json({
      status: 200,
      message: 'Successfully found contacts!',
      data: contacts,
    });
  };
};

export const handleGetContactById = async (req, res) => {
  const { contactId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(contactId)) {
    throw createError(400, 'Invalid contact ID format');
  }

  const contact = await getContactById(contactId);

  if (!contact) {
    throw createError(404, 'Contact not found');
  }

  res.status(200).json({
    status: 200,
    message: `Successfully found contact with id ${contactId}!`,
    data: contact,
  });
};

export const handleAddContact = async (req, res) => {
  const contactData = req.body;

  const requiredFields = ['name', 'phoneNumber', 'contactType'];
  for (const field of requiredFields) {
    if (!contactData[field]) {
      throw createError(400, `Missing required field: ${field}`);
    }
  }

  const newContact = await addContact(contactData);

  res.status(201).json({
    status: 201,
    message: 'Successfully created a contact!',
    data: newContact,
  });
};

export const handleRemoveContact = async (req, res) => {
  const { contactId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(contactId)) {
    throw createError(400, 'Invalid contact ID format');
  }

  const deletedContact = await removeContact(contactId);

  if (!deletedContact) {
    throw createError(404, 'Contact not found');
  }

  res.status(200).json({
    status: 200,
    message: `Contact with id ${contactId} deleted successfully`,
    data: deletedContact,
  });
};

export const handleUpdateContact = async (req, res) => {
  const { contactId } = req.params;
  const updateData = req.body;

  if (!mongoose.Types.ObjectId.isValid(contactId)) {
    throw createError(400, 'Invalid contact ID format');
  }

  const updatedContact = await updateContact(contactId, updateData);

  if (!updatedContact) {
    throw createError(404, 'Contact not found');
  }

  res.status(200).json({
    status: 200,
    message: 'Successfully patched a contact!',
    data: updatedContact,
  });
};