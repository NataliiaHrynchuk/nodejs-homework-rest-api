const Contact = require('../models/contacts/contacts');
const { RequestError } = require('../helpers/index');

const getContacts = async (req, res, next) => {
  const { _id } = req.user;
  const { page = 1, limit = 20, favorite } = req.query;
  const skip = (page - 1) * limit;
  if (!favorite) {
    const contacts = await Contact.find({ owner: _id }, '', {
      skip,
      limit: Number(limit),
    }).populate('owner', '_id email');
    return res.json(contacts);
  }
  const contacts = await Contact.find({ owner: _id, favorite }, '', {
    skip,
    limit: Number(limit),
  }).populate('owner', '_id email');
  return res.json(contacts);
};

const getContact = async (req, res, next) => {
  const { contactId } = req.params;
  const contact = await Contact.findById(contactId);

  if (!contact) {
    return next(new RequestError(404, 'Not found'));
  }

  return res.json(contact);
};

const addContact = async (req, res) => {
  const { _id } = req.user;
  const contact = await Contact.create({ ...req.body, owner: _id });
  res.status(201).json(contact);
};

const updateContact = async (req, res, next) => {
  const { contactId } = req.params;
  const contact = await Contact.findByIdAndUpdate(contactId, req.body, {
    new: true,
  });
  if (!contact) {
    return next(new RequestError(404, 'Not found'));
  }
  return res.status(200).json({ contact });
};

const updateStatusContact = async (req, res, next) => {
  const { contactId } = req.params;
  const contact = await Contact.findByIdAndUpdate(contactId, req.body, {
    new: true,
  });
  if (!contact) {
    return next(new RequestError(404, 'Not found'));
  }
  return res.status(200).json({ contact });
};

const removeContact = async (req, res, next) => {
  const { contactId } = req.params;
  const contact = await Contact.findByIdAndRemove(contactId);
  if (!contact) {
    throw new RequestError(404, 'Not found');
  }

  return res.status(200).json({ message: 'Contact deleted' });
};

module.exports = {
  getContacts,
  getContact,
  addContact,
  updateContact,
  updateStatusContact,
  removeContact,
};
