const express = require('express');
const { tryCatchWrapper } = require('../../helpers/index.js');

const { register } = require('../../controllers/auth.controller');

const authRouter = express.Router();

authRouter.post('/register', tryCatchWrapper(register));

module.exports = authRouter;