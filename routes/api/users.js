const express = require('express');
const { tryCatchWrapper } = require('../../helpers/index.js');
const { auth, validateBody } = require('../../middlewares/index');

const {
  register,
  login,
  getCurrent,
  logout,
  updateSubscription,
} = require('../../controllers/users.controller');
const {
  registerUserSchema,
  loginUserSchema,
  updateSubscriptionUserSchema,
} = require('../../models/user');

const router = express.Router();

router.post(
  '/register',
  validateBody(registerUserSchema),
  tryCatchWrapper(register)
);

router.post('/login', validateBody(loginUserSchema), tryCatchWrapper(login));

router.get('/current', auth, tryCatchWrapper(getCurrent));

router.post('/logout', auth, tryCatchWrapper(logout));

router.patch(
  '/',
  auth,
  validateBody(updateSubscriptionUserSchema),
  tryCatchWrapper(updateSubscription)
);

module.exports = router;
