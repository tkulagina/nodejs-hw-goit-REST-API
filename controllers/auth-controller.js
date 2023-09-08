const bcrypt = require ('bcrypt');
const jwt = require ('jsonwebtoken');

const {User} = require ("../models/user");
const {HttpError} = require ("../helpers");
const {cntrlWrapper} = require ("../middleware");
const {SECRET_KEY} = process.env;

const dotenv = require ('dotenv');
dotenv.config()

const register = async (req, res) => {
    const {email, password} = req.body;
    const user = await User.findOne ({email});
    if (user) {
        throw HttpError (409, "Email in use");
    }

    const hashPassword = await bcrypt.hash (password, 10);

    const newUser = await User.create({...req.body, password: hashPassword});

    res.status(201).json({ 
        password: newUser.password,
        user: {
            email: newUser.email,
            subscription: "starter",
          }
    });
}

const login = async (req, res) => {
    const {email, password} = req.body;
    const user = await User.findOne ({email});
    if (!user) {
        throw HttpError (401, "Email or password is wrong")
    }

    const passwordCompare = await bcrypt.compare (password, user.password);
    if (!passwordCompare) {
        throw HttpError (401, "Email or password is wrong")
    }

    const payload = {
        id: user._id,
    }

    const token = jwt.sign(payload, SECRET_KEY, {expiresIn: "23h"})
    await User.findByIdAndUpdate (user._id, {token});

    res.json ({              
        "token": token,
        user: {
              email: user.email,
              "subscription": "starter"
            }
    })
}

const getCurrent = async (req, res) => {
    const {email} = req.user;

    res.json ({        
        email,
    })
}

const logout = async (req, res) => {
    const {_id} = req.user;
    await User.findByIdAndUpdate (_id, {token: ""});

    res.json ({
        message: "logout success"
    })
}

module.exports = {
    register: cntrlWrapper(register),
    login: cntrlWrapper(login),
    getCurrent: cntrlWrapper(getCurrent),
    logout: cntrlWrapper(logout),
}