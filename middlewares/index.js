const { RequestError } = require('../helpers/index');
const { isValidObjectId } = require('mongoose');
const { Unauthorized } = require('http-errors');
const jwt = require('jsonwebtoken');
const { User } = require('../models/user');
const { SECRET_KEY } = process.env;

const validateBody = (schema) => {
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

const auth = async (req, res, next) => {
    const { authorization = "" } = req.headers;
    const [bearer, token] = authorization.split(" ");
    
    try {
        if (bearer !== "Bearer") {
        throw new Unauthorized('Not authorized');
        }
        const { id } = jwt.verify(token, `${SECRET_KEY}`);
        const user = await User.findById(id);
        if (!user || !user.token) {
            throw new Unauthorized('Not authorized');
        }
        req.user = user;
        next();
    } catch(error) {
        if (error.message === "Invalid signature" || error.message === "jwt expired") {
            error.status = 401;
            error.message = 'Not authorized';
        }
        next(error);
    }
    
}

module.exports = {
    validateBody,
    isValidId,
    auth,
};