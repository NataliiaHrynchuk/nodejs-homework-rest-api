const { Schema, model } = require('mongoose');

const { handleSchemaValidationErrors } = require('../../helpers/index');

const emailRegexp = require('./pattern');

const userSchema = Schema(
  {
    password: {
      type: String,
      minLength: [6, 'password should be at least 6 characters long'],
      required: [true, 'Set password for user'],
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      match: [emailRegexp, 'User email is not valid'],
    },
    subscription: {
      type: String,
      enum: ['starter', 'pro', 'business'],
      default: 'starter',
    },
    avatarURL: {
      type: String,
      required: true,
    },
    token: {
      type: String,
      default: null,
    },
    verify: {
      type: Boolean,
      default: false,
    },
    verificationToken: {
      type: String,
      required: [true, 'Verify token is required'],
    },
  },
  { versionKey: false }
);

userSchema.post('save', handleSchemaValidationErrors);

const User = model('user', userSchema);

module.exports = { User };
