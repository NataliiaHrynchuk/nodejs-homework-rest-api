const { Conflict, Unauthorized } = require('http-errors');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { User } = require('../models/users/user');
const { SECRET_KEY } = process.env;
const { avatarDir } = require('../path');
const path = require('path');
const fs = require('fs/promises');

const register = async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (user) {
    throw new Conflict('Email in use');
  }

  const hashPassword = bcrypt.hashSync(password, bcrypt.genSaltSync(10));
  const result = await User.create({ email, password: hashPassword });
  res.status(201).json(result);
};

const login = async (req, res, next) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user) {
    throw new Unauthorized('Email or password is wrong');
  }
  const passCompare = bcrypt.compareSync(password, user.password);

  if (!passCompare) {
    throw new Unauthorized('Email or password is wrong');
  }

  const payload = {
    id: user._id,
  };

  const token = jwt.sign(payload, `${SECRET_KEY}`, { expiresIn: '1h' });
  await User.findByIdAndUpdate(user._id, { token });
  res.status(200).json(token);
};

const getCurrent = async (req, res) => {
  const { email } = req.user;
  res.status(200).json({ email });
};
const logout = async (req, res) => {
  const { _id } = req.user;
  await User.findByIdAndUpdate(_id, { token: null });
  res.status(204).json();
};
const updateSubscription = async (req, res, next) => {
  const { _id } = req.user;

  const user = await User.findByIdAndUpdate(_id, req.body, { new: true });
  if (!user) {
    throw new Unauthorized('Email or password is wrong');
  }
  return res.status(200).json({ user });
};

const updateAvatar = async (req, res, next) => {
  console.log('body', req.body);
  console.log('file', req.file);
  console.log('user', req.user);
  const { _id } = req.user;

  const user = await User.findById(_id);

  if (!user) {
    throw new Unauthorized('Email or password is wrong');
  }
  const { path: tempUpload, filename } = req.file;
  const resultUpload = path.join(avatarDir, filename);
  console.log('tempUpload', tempUpload);
  console.log('resultUpload', resultUpload);
  await fs.rename(tempUpload, resultUpload);

  const avatarURL = path.join('public', 'avatars', filename);
  await User.findByIdAndUpdate(_id, { avatarURL });

  return res.status(200).json(avatarURL);
};

module.exports = {
  register,
  login,
  getCurrent,
  logout,
  updateSubscription,
  updateAvatar,
};
