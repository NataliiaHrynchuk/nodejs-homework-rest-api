const { Schema, model } = require('mongoose');
const Joi = require('joi');
const { handleSchemaValidationErrors } = require('../helpers/index');

const phoneRegexp = /^\d{3}-\d{3}-\d{4}$/;

const contactSchema = Schema({
  name: {
    type: String,
    unique: true,
    required: [true, 'Set name for contact'],
  },
  email: {
    type: String,
    unique: true,
    required: [true, 'Set email for contact'],
  },
  phone: {
    type: String,
    match: phoneRegexp,
    unique: true,
    required: [true, 'Set phone for contact'],
  },
  favorite: {
    type: Boolean,
    default: false,
  },
},
{ versionKey: false, }
);


contactSchema.post('save', handleSchemaValidationErrors);


const addContactsSchema = Joi.object({
    name: Joi.string().min(3).required().error(new Error('missing required name field')),
    email: Joi.string().min(5).required().error(new Error('missing required email field')),
    phone: Joi.string().pattern(phoneRegexp).required().error(new Error('missing required phone field')),
    favorite: Joi.boolean()
});
    

const updateContactsSchema = Joi.object({
    name: Joi.string().min(3),
    email: Joi.string().min(5),
    phone: Joi.string().pattern(phoneRegexp),
    favorite: Joi.boolean()
}).required().error(new Error('missing fields'));

const updateStatusSchema = Joi.object({
  favorite: Joi.boolean().required().error(new Error('missing field favorite'))
})

const schemas = {
    addContactsSchema,
    updateContactsSchema,
    updateStatusSchema
}

const Contact = model('contact', contactSchema);

module.exports = {
    Contact,
    schemas
}



