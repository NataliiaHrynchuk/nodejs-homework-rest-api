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
const { schemas } = require('../../models/user');

const router = express.Router();

router.post(
  '/register',
  validateBody(schemas.registerUserSchema),
  tryCatchWrapper(register)
);

router.post(
  '/login',
  validateBody(schemas.loginUserSchema),
  tryCatchWrapper(login)
);

router.get('/current', auth, tryCatchWrapper(getCurrent));

router.post('/logout', auth, tryCatchWrapper(logout));

router.patch(
  '/',
  auth,
  validateBody(schemas.updateSubscriptionSchema),
  tryCatchWrapper(updateSubscription)
);

module.exports = router;
