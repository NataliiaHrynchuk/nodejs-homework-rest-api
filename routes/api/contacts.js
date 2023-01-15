const express = require('express');
const { tryCatchWrapper } = require('../../helpers/index.js');
const { validateBody, isValidId } = require('../../middlewares/index');
const { schemas } = require('../../models/contacts');

const {
  getContacts,
  getContact,
  addContact,
  updateContact,
  updateStatusContact,
  removeContact
} = require('../../controllers/contacts.controller');

const router = express.Router();

router.get('/', tryCatchWrapper(getContacts));

router.get('/:contactId',
  isValidId,
  tryCatchWrapper(getContact));

router.post('/',
  validateBody(schemas.addContactsSchema),
  tryCatchWrapper(addContact));

router.delete('/:contactId',
  isValidId,
  tryCatchWrapper(removeContact));

router.put('/:contactId',
  isValidId,
  validateBody(schemas.updateContactsSchema),
  tryCatchWrapper(updateContact));

router.patch('/:contactId/favorite',
  isValidId,
  validateBody(schemas.updateStatusSchema),
  tryCatchWrapper(updateStatusContact));

module.exports = router;
