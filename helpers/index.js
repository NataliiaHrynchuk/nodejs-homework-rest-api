require('dotenv').config();
const sgMail = require('@sendgrid/mail');
const { SENDGRID_API_KEY } = process.env;

sgMail.setApiKey(SENDGRID_API_KEY);

const sendEmail = async (data) => {
  const email = { ...data, from: 'natagrinchukk@gmail.com' };
  try {
    await sgMail.send(email);
    return true;
  } catch (error) {
    throw error;
  }
};

function tryCatchWrapper(enpointFn) {
  return async (req, res, next) => {
    try {
      await enpointFn(req, res, next);
    } catch (error) {
      return next(error);
    }
  };
}

class RequestError extends Error {
  constructor(status, message) {
    super(message);
    this.name = 'HttpError';
    this.status = status;
  }
}

const isConflict = ({ name, code }) =>
  name === 'MongoServerError' && code === 11000;
const handleSchemaValidationErrors = (error, data, next) => {
  error.status = isConflict(error) ? 409 : 400;
  next();
};

module.exports = {
  sendEmail,
  tryCatchWrapper,
  RequestError,
  handleSchemaValidationErrors,
};
