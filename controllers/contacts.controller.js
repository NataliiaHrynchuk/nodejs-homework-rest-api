const { Contact } = require('../models/contacts');
const { RequestError } = require('../helpers/index');

const listContacts = async (req, res, next) => {
    const contacts = await Contact.find();
    await res.json(contacts);
    next();
};

const getById = async (req, res, next) => {
    const { contactId } = req.params;
    const contact = await Contact.findById(contactId);

    if (!contact) {
        return next(new RequestError(404, "Not found"));
    }

    return res.json(contact);
};

const addContact = async (req, res) => {
    const contact = await Contact.create(req.body);
    res.status(201).json(contact);
};

const updateContact = async (req, res, next) => {
    const { contactId } = req.params;
    const contact = await Contact.findByIdAndUpdate(contactId, req.body, { new: true });
    if (!contact) {
        return next(new RequestError(404, "Not found"));
    }
    return res.status(200).json({ contact });
};

const updateStatusContact = async (req, res, next) => {
    const { contactId } = req.params;
    const contact = await Contact.findByIdAndUpdate(contactId, req.body, { new: true });
    if (!contact) {
        return next(new RequestError(404, "Not found"));
    }
    return res.status(200).json({ contact });
};

const removeContact = async (req, res, next) => {
    const { contactId } = req.params;
    const contact = await Contact.findByIdAndRemove(contactId);
    if (!contact) {
        throw new RequestError(404, "Not found");
    }
  
    return res.status(200).json({ message: "Contact deleted" });
};

module.exports = {
    listContacts,
    getById,
    addContact,
    updateContact,
    updateStatusContact,
    removeContact
}