import { Contact } from '../models/contactModel.js';

// Отримання всіх контактів користувача з пагінацією і сортуванням
export const getAllContacts = async (userId, skip, perPage, sortBy, sortOrder) => {
  const sortDirection = sortOrder === 'desc' ? -1 : 1;
  const sortObj = {};
  sortObj[sortBy] = sortDirection;

  return Contact.find({ userId }, '-__v')
    .sort(sortObj)
    .skip(skip)
    .limit(Number(perPage));
};

// Отримання кількості контактів користувача
export const getAllContactsCount = async (userId) => {
  return Contact.countDocuments({ userId });
};

// Отримання контакту за ID
export const getContactById = async (contactId, userId) => {
  return Contact.findOne({ _id: contactId, userId }, '-__v');
};

// Створення нового контакту
export const createContact = async (contactData) => {
  const newContact = await Contact.create(contactData);
  const { __v, ...cleanedContact } = newContact.toObject();
  return cleanedContact;
};

// Оновлення існуючого контакту
export const updateContact = async (contactId, userId, updateData) => {
  return Contact.findOneAndUpdate(
    { _id: contactId, userId },
    updateData,
    { new: true } // не використовуємо projection, бо підтримується не у всіх версіях
  ).select('-__v');
};

// Видалення контакту
export const deleteContact = async (contactId, userId) => {
  return Contact.findOneAndDelete({ _id: contactId, userId });
};
