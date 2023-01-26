const Joi = require('joi');
const phoneRegexp = require('./pattern');

const addContactsSchema = Joi.object({
  name: Joi.string()
    .min(3)
    .required()
    .error(new Error('missing required name field')),
  email: Joi.string()
    .min(5)
    .required()
    .error(new Error('missing required email field')),
  phone: Joi.string()
    .pattern(phoneRegexp)
    .required()
    .error(new Error('missing required phone field')),
  favorite: Joi.boolean(),
});

const updateContactsSchema = Joi.object({
  name: Joi.string().min(3),
  email: Joi.string().min(5),
  phone: Joi.string().pattern(phoneRegexp),
  favorite: Joi.boolean(),
})
  .required()
  .error(new Error('missing fields'));

const updateStatusSchema = Joi.object({
  favorite: Joi.boolean().required().error(new Error('missing field favorite')),
});

module.exports = {
  addContactsSchema,
  updateContactsSchema,
  updateStatusSchema,
};
