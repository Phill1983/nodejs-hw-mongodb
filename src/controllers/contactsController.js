import { getAllContacts } from '../services/contactsService.js';
import { getContactById } from '../services/contactsService.js';
import { addContact } from '../services/contactsService.js';
import { removeContact } from '../services/contactsService.js';

export const handleGetAllContacts = async (req, res) => {
  try {
    const contacts = await getAllContacts();

    res.status(200).json({
      status: 200,
      message: 'Successfully found contacts!',
      data: contacts,
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};


export const handleGetContactById = async (req, res) => {
    try {
      const { contactId } = req.params;
      const contact = await getContactById(contactId);
  
      if (!contact) {
        return res.status(404).json({ message: 'Contact not found' });
      }
  
      res.status(200).json({
        status: 200,
        message: `Successfully found contact with id ${contactId}!`,
        data: contact,
      });
    } catch (error) {
      res.status(500).json({ message: 'Server error', error: error.message });
    }
};
  
export const handleAddContact = async (req, res) => {
    try {
      const contactData = req.body;
  
      // Мінімальна валідація
      if (!contactData.name || !contactData.phoneNumber) {
        return res.status(400).json({ message: 'Missing required fields: name and phoneNumber' });
      }
  
      const newContact = await addContact(contactData);
  
      res.status(201).json({
        status: 201,
        message: 'Contact successfully added!',
        data: newContact,
      });
    } catch (error) {
      res.status(500).json({ message: 'Server error', error: error.message });
    }
};
  
export const handleRemoveContact = async (req, res) => {
    try {
      const { contactId } = req.params;
      const deletedContact = await removeContact(contactId);
  
      if (!deletedContact) {
        return res.status(404).json({ message: 'Contact not found' });
      }
  
      res.status(200).json({
        status: 200,
        message: `Contact with id ${contactId} deleted successfully`,
        data: deletedContact,
      });
    } catch (error) {
      res.status(500).json({ message: 'Server error', error: error.message });
    }
  };