const { Schema, model } = require('mongoose');
const Joi = require('joi');
const { handleSchemaValidationErrors } = require('../helpers/index');

const emailRegexp = /[a-z0-9]+@[a-z0-9]+/;


const userSchema = Schema({
    password: {
        type: String,
        minLength: [6, "password should be at least 6 characters long"],
        required: [true, 'Set password for user'],
    },
    email: {
        type: String,
        required: [true, 'Email is required'],
        unique: true, 
        match: [emailRegexp, "User email is not valid"],
    },
    subscription: {
        type: String,
        enum: ["starter", "pro", "business"],
        default: "starter"
    },
    token: {
        type: String,
        default: null
    }
},
    {versionKey: false,}
);

userSchema.post('save', handleSchemaValidationErrors);

const registerUserSchema = Joi.object({
    password: Joi.string().min(6).required(),
    email: Joi.string().pattern(emailRegexp).required(),
    subscription: Joi.string(),
});

const loginUserSchema = Joi.object({
    password: Joi.string().min(6).required(),
    email: Joi.string().pattern(emailRegexp).required(),
});

const User = model('user', userSchema);

const schemas = {
    registerUserSchema,
    loginUserSchema,
};

module.exports = {
    User,
    schemas
};