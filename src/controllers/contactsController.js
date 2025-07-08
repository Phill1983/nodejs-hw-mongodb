import { getAllContacts, getAllContactsCount, getContactById, createContact, updateContact, deleteContact } from '../services/contactsService.js';

export const getAllContactsController = async (req, res) => {
  try {
    const userId = req.user._id;

   
    const { page = 1, limit = 10 } = req.query;
    const skip = (page - 1) * limit;

  
    const contacts = await getAllContacts(userId, skip, limit);


    const total = await getAllContactsCount(userId); 

    res.status(200).json({
      status: 200,
      message: 'Successfully found contacts!',
      data: {
        contacts,
        total,
        page: Number(page),
        limit: Number(limit)
      },
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export const getContactByIdController = async (req, res) => {
  try {
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
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export const createContactController = async (req, res) => {
  try {
    const userId = req.user._id;
    const newContact = await createContact({ ...req.body, userId });

    res.status(201).json({
      status: 201,
      message: 'Contact created successfully!',
      data: newContact,
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export const updateContactController = async (req, res) => {
  try {
    const { contactId } = req.params;
    const userId = req.user._id;



    const updatedContact = await updateContact(contactId, userId, req.body);



    if (!updatedContact) {
      return res.status(404).json({ message: 'Contact not found' });
    }

    res.status(200).json({
      status: 200,
      message: 'Contact updated successfully!',
      data: updatedContact,
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export const deleteContactController = async (req, res) => {
  try {
    const { contactId } = req.params;
    const userId = req.user._id;
    const deletedContact = await deleteContact(contactId, userId);

    if (!deletedContact) {
      return res.status(404).json({ message: 'Contact not found' });
    }

    res.status(204).send();;
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
