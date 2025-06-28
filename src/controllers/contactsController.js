import Contact from '../models/contactModel.js';
import createError from 'http-errors';
import mongoose from 'mongoose';

// ===== GET ALL =====
export const handleGetAllContacts = async (req, res) => {
  const {
    type,
    isFavourite,
    page = 1,
    perPage = 10,
    sortBy = "name",
    sortOrder = "asc",
  } = req.query;

  const filter = {};

  if (type) {
    filter.contactType = type;
  }

  if (isFavourite !== undefined) {
    filter.isFavourite = isFavourite === "true";
  }

  const skip = (page - 1) * perPage;
  const sortDirection = sortOrder === "desc" ? -1 : 1;

  const totalItems = await Contact.countDocuments(filter);
  const totalPages = Math.ceil(totalItems / perPage);

  const contacts = await Contact.find(filter)
    .sort({ [sortBy]: sortDirection })
    .skip(skip)
    .limit(Number(perPage));

  if (contacts.length === 0) {
    throw createError(404, "No contacts found");
  }

  res.status(200).json({
    status: 200,
    message: "Successfully found contacts!",
    data: {
      data: contacts,
      page: Number(page),
      perPage: Number(perPage),
      totalItems,
      totalPages,
      hasPreviousPage: Number(page) > 1,
      hasNextPage: Number(page) < totalPages,
    },
  });
};

// ===== GET BY ID =====
export const handleGetContactById = async (req, res) => {
  const { contactId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(contactId)) {
    throw createError(400, 'Invalid contact ID format');
  }

  const contact = await Contact.findById(contactId);

  if (!contact) {
    throw createError(404, 'Contact not found');
  }

  res.status(200).json({
    status: 200,
    message: `Successfully found contact with id ${contactId}!`,
    data: contact,
  });
};

// ===== ADD CONTACT =====
export const handleAddContact = async (req, res) => {
  const contactData = req.body;

  const requiredFields = ['name', 'phoneNumber', 'contactType'];
  for (const field of requiredFields) {
    if (!contactData[field]) {
      throw createError(400, `Missing required field: ${field}`);
    }
  }

  const newContact = await Contact.create(contactData);

  res.status(201).json({
    status: 201,
    message: 'Successfully created a contact!',
    data: newContact,
  });
};

// ===== REMOVE CONTACT =====
export const handleRemoveContact = async (req, res) => {
  const { contactId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(contactId)) {
    throw createError(400, 'Invalid contact ID format');
  }

  const deletedContact = await Contact.findByIdAndDelete(contactId);

  if (!deletedContact) {
    throw createError(404, 'Contact not found');
  }

  res.status(200).json({
    status: 200,
    message: `Contact with id ${contactId} deleted successfully`,
    data: deletedContact,
  });
};

// ===== UPDATE CONTACT =====
export const handleUpdateContact = async (req, res) => {
  const { contactId } = req.params;
  const updateData = req.body;

  if (!mongoose.Types.ObjectId.isValid(contactId)) {
    throw createError(400, 'Invalid contact ID format');
  }

  const updatedContact = await Contact.findByIdAndUpdate(contactId, updateData, {
    new: true,
  });

  if (!updatedContact) {
    throw createError(404, 'Contact not found');
  }

  res.status(200).json({
    status: 200,
    message: 'Successfully patched a contact!',
    data: updatedContact,
  });
};
