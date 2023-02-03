const express = require('express');
const { tryCatchWrapper } = require('../../helpers/index.js');
const {
  auth,
  validateBody,
  upload,
  changeAvatarSize,
} = require('../../middlewares/index.js');

const {
  register,
  verifyEmail,
  login,
  getCurrent,
  logout,
  updateSubscription,
  updateAvatar,
} = require('../../controllers/users.controller');

const {
  registerUserSchema,
  loginUserSchema,
  updateSubscriptionUserSchema,
} = require('../../models/users/joiusersschemas');

const router = express.Router();

router.post(
  '/register',
  validateBody(registerUserSchema),
  tryCatchWrapper(register)
);

router.post('/login', validateBody(loginUserSchema), tryCatchWrapper(login));

router.get('/current', auth, tryCatchWrapper(getCurrent));

router.get('/verify/:verificationToken', tryCatchWrapper(verifyEmail));

router.post('/logout', auth, tryCatchWrapper(logout));

router.patch(
  '/updateSubscription',
  auth,
  validateBody(updateSubscriptionUserSchema),
  tryCatchWrapper(updateSubscription)
);

router.patch(
  '/avatars',
  auth,
  upload.single('avatar'),
  changeAvatarSize,
  tryCatchWrapper(updateAvatar)
);
module.exports = router;
