const { Conflict, NotFound, Unauthorized } = require('http-errors');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { User } = require('../models/users/user');
const { SECRET_KEY } = process.env;
const path = require('path');
const fs = require('fs/promises');
const gravatar = require('gravatar');
const { nanoid } = require('nanoid');
const { sendEmail } = require('../helpers/index');

const register = async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });
  if (user) {
    throw new Conflict('Email in use');
  }

  const hashPassword = bcrypt.hashSync(password, bcrypt.genSaltSync(10));
  const avatarURL = gravatar.url(email);
  const verficationToken = nanoid();
  await User.create({
    email,
    password: hashPassword,
    avatarURL,
    verficationToken,
  });

  const mail = {
    to: email,
    subject: 'Підтвердження email',
    html: `<a target="_blank" href="http://localhost:3000/api/users/verify/${verficationToken}">Підтвердити email </a>`,
  };

  await sendEmail(mail);

  res.status(201).json({
    data: {
      user: {
        email,
        password,
        avatarURL,
        verficationToken,
      },
    },
  });
};

const verifyEmail = async (req, res) => {
  const { verficationToken } = req.params;
  const user = await User.findOne({ verficationToken });
  if (!user) {
    throw NotFound();
  }
  await User.findByIdAndUpdate(user._id, {
    verify: true,
    verficationToken: null,
  });
  res.json({ message: 'Verification successful' });
};

const login = async (req, res, next) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user || !user.verify) {
    throw new Unauthorized('Email is wrong or not verify');
  }
  const passCompare = bcrypt.compareSync(password, user.password);

  if (!passCompare) {
    throw new Unauthorized('Password is wrong');
  }

  const payload = {
    id: user._id,
  };
  const { subscription } = user;
  const token = jwt.sign(payload, `${SECRET_KEY}`, { expiresIn: '1h' });
  await User.findByIdAndUpdate(user._id, { token });

  res.status(200).json({
    data: {
      user: {
        email,
        subscription,
      },
      token,
    },
  });
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

const avatarDir = path.join(__dirname, '../', 'public', 'avatars');

const updateAvatar = async (req, res, next) => {
  console.log('req.file:', req.file);
  try {
    const { path: tempUpload, filename } = req.file;
    const { _id } = req.user;
    const [extention] = filename.split('.').reverse();
    const avatarName = `${_id}.${extention}`;
    const resultUpload = path.join(avatarDir, avatarName);
    await fs.rename(tempUpload, resultUpload);
    const avatarURL = path.join('avatars', resultUpload);
    await User.findByIdAndUpdate(_id, { avatarURL });
    return res.status(200).json({ avatarURL });
  } catch (err) {
    await fs.unlink(req.file.path);
    throw err;
  }
};

module.exports = {
  register,
  verifyEmail,
  login,
  getCurrent,
  logout,
  updateSubscription,
  updateAvatar,
};
