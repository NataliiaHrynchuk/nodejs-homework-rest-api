const express = require('express');
const { tryCatchWrapper } = require('../../helpers/index.js');
const { auth, validateBody} = require('../../middlewares/index');

const { register, login, getCurrent, logout } = require('../../controllers/users.controller');
const { schemas } = require('../../models/user');

const router = express.Router();

router.post('/register', validateBody(schemas.joiRegisterSchema), tryCatchWrapper(register));
router.post('/login', validateBody(schemas.joiLoginSchema), tryCatchWrapper(login));
router.get('/current', auth, tryCatchWrapper(getCurrent));
router.post('/logout', auth, tryCatchWrapper(logout) )

module.exports = router;