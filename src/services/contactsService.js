import { Contact } from '../models/contactModel.js';

// export const getAllContacts = async (userId, skip, limit) => {
//   return await Contact.find({ userId }, '-__v', { skip, limit: Number(limit) });
// };


export const getAllContacts = async (userId, skip, perPage, sortBy, sortOrder) => {
  const sortDirection = sortOrder === 'desc' ? -1 : 1;
  const sortObj = {};
  sortObj[sortBy] = sortDirection;

  return Contact.find({ userId }, '-__v')
    .sort(sortObj)
    .skip(skip)
    .limit(Number(perPage));
};

// export const getAllContactsCount = async (userId) => {
//   return Contact.countDocuments({ userId });
// };

export const getAllContactsCount = async (userId) => {
  return await Contact.countDocuments({ userId });
};

export const getContactById = async (contactId, userId) => {
  return Contact.findOne({ _id: contactId, userId }, '-__v');
};

export const createContact = async (contactData) => {
  return Contact.create(contactData, '-__v');
};

export const updateContact = async (contactId, userId, updateData) => {

  

  return Contact.findOneAndUpdate(
    { _id: contactId, userId },
    updateData,
    { new: true }, '-__v'
  );
};

export const deleteContact = async (contactId, userId) => {
  return Contact.findOneAndDelete({ _id: contactId, userId });
};
