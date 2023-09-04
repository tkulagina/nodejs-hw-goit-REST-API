const {User} = require ("../models/user");
const {HttpError} = require ("../helpers");
const {cntrlWrapper} = require ("../middleware");

const register = async (req, res) => {
    const newUser = await User.create(req.body);

    res.status(201).json({       
        name: newUser.name, 
        email: newUser.email,
    });
}

module.exports = {
    register: cntrlWrapper(register),
}