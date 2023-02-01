const { RequestError } = require('../helpers/index');
const { isValidObjectId } = require('mongoose');
const { Unauthorized } = require('http-errors');
const jwt = require('jsonwebtoken');
const { User } = require('../models/users/user');
const { SECRET_KEY } = process.env;
const multer = require('multer');
const path = require('path');
const Jimp = require('jimp');

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
    const error = new RequestError(
      400,
      `${contactId} is not correct id format`
    );
    next(error);
  }
  next();
};

const auth = async (req, res, next) => {
  const { authorization = '' } = req.headers;
  const [bearer, token] = authorization.split(' ');

  try {
    if (bearer !== 'Bearer') {
      throw new Unauthorized('Not authorized');
    }
    const { id } = jwt.verify(token, `${SECRET_KEY}`);
    const user = await User.findById(id);
    if (!user || !user.token) {
      throw new Unauthorized('Not authorized');
    }
    req.user = user;
    next();
  } catch (error) {
    if (
      error.message === 'Invalid signature' ||
      error.message === 'jwt expired'
    ) {
      error.status = 401;
      error.message = 'Not authorized';
    }
    next(error);
  }
};

const tempDir = path.join(__dirname, '../', 'temp');
const multerConfig = multer.diskStorage({
  destination: tempDir,
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  },
});

const upload = multer({
  storage: multerConfig,
});

const changeAvatarSize = async (req, res, next) => {
  const { path } = req.file;
  try {
    await Jimp.read(path).then((img) => {
      return img.resize(250, 250).writeAsync(path);
    });
  } catch (error) {
    next(error);
  }
  next();
};

module.exports = {
  validateBody,
  isValidId,
  auth,
  upload,
  changeAvatarSize,
};
