const express = require('express');
const { tryCatchWrapper } = require('../../helpers/index.js');
const { auth, validateBody, isValidId } = require('../../middlewares/index');
const {
  addContactsSchema,
  updateContactsSchema,
  updateStatusSchema,
} = require('../../models/contacts/joicontactsschemas');

const {
  getContacts,
  getContact,
  addContact,
  updateContact,
  updateStatusContact,
  removeContact,
} = require('../../controllers/contacts.controller');

const router = express.Router();

router.get('/', auth, tryCatchWrapper(getContacts));

router.get('/:contactId', isValidId, tryCatchWrapper(getContact));

router.post(
  '/',
  auth,
  validateBody(addContactsSchema),
  tryCatchWrapper(addContact)
);

router.delete('/:contactId', isValidId, tryCatchWrapper(removeContact));

router.put(
  '/:contactId',
  isValidId,
  validateBody(updateContactsSchema),
  tryCatchWrapper(updateContact)
);

router.patch(
  '/:contactId/favorite',
  isValidId,
  validateBody(updateStatusSchema),
  tryCatchWrapper(updateStatusContact)
);

module.exports = router;
