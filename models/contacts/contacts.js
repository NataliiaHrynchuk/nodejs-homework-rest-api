const { Schema, model } = require('mongoose');
// const Joi = require('joi');
const { handleSchemaValidationErrors } = require('../../helpers/index');

const phoneRegexp = require('./pattern');

const contactSchema = Schema(
  {
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
    owner: {
      type: Schema.Types.ObjectId,
      ref: 'user',
      required: true,
    },
  },
  { versionKey: false }
);

contactSchema.post('save', handleSchemaValidationErrors);

const Contact = model('contact', contactSchema);

module.exports = Contact;
