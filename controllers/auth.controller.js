const { User } = require('../models/user');

const register = async (req, res, next) => {
    const { email, password } = req.body;
    const saveedUser = await User.create({ email, password });
    res.status(201).json(saveedUser);
};

module.exports = {
    register,
}