const { Conflict, Unauthorized } = require("http-errors");
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { User } = require('../models/user');
const { SECRET_KEY } = process.env;

const register = async (req, res) => {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (user) {
        throw new Conflict('Email in use');
    }

    const hashPassword = bcrypt.hashSync(password, bcrypt.genSaltSync(10));
    const result = await User.create({ email, password: hashPassword});
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
        id: user._id
    };

    const token = jwt.sign(payload, `${SECRET_KEY}`, { expiresIn: "1h" });
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
 }

module.exports = {
    register,
    login, 
    getCurrent,
    logout
}