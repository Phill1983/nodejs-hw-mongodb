import { Contact } from '../models/contactModel.js';

export const getAllContacts = async () => {
  const contacts = await Contact.find();
  return contacts;
};

export const getContactById = async (contactId) => {
    const contact = await Contact.findById(contactId);
    return contact;
};
  
export const addContact = async (contactData) => {
    const newContact = await Contact.create(contactData);
    return newContact;
};
  
export const removeContact = async (contactId) => {
    const deletedContact = await Contact.findByIdAndDelete(contactId);
    return deletedContact;
};
  
