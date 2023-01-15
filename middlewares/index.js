const { RequestError } = require('../helpers/index');
const { isValidObjectId } = require('mongoose');

function validateBody(schema) {
    return (req, res, next) => {
        const { error } = schema.validate(req.body);
        if (error) {
            return next(new RequestError(400, error.message));
        }

        return next();
    };
};

const isValidId = (req, res, next) => {
    const { contactId } = req.params;
    const isCorrectId = isValidObjectId(contactId);
    if (!isCorrectId) {
        const error = new RequestError(400, `${contactId} is not correct id format`);
        next(error);
    }
    next();
}; 

module.exports = {
    validateBody,
    isValidId
};