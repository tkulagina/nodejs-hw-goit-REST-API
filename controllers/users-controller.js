const bcrypt = require ('bcrypt');
const jwt = require ('jsonwebtoken');
const dotenv = require ('dotenv');
const gravatar = require ('gravatar');

const {User} = require ("../models/user");
const {HttpError} = require ("../helpers");
const {cntrlWrapper} = require ("../middleware");


dotenv.config()
const {SECRET_KEY} = process.env;

const register = async (req, res) => {
    const {email, password} = req.body;
    const user = await User.findOne ({email});
    if (user) {
        throw HttpError (409, "Email in use");
    }

    const hashPassword = await bcrypt.hash (password, 10);
    const avatarURL = gravatar.url (email);

    const newUser = await User.create({...req.body, password: hashPassword, avatarURL});

    res.status(201).json({        
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
        "subscription": "starter",
    })
}

const logout = async (req, res) => {
    const {_id} = req.user;
    await User.findByIdAndUpdate (_id, {token: ""});

    res.status(204).json();
}

module.exports = {
    register: cntrlWrapper(register),
    login: cntrlWrapper(login),
    getCurrent: cntrlWrapper(getCurrent),
    logout: cntrlWrapper(logout),
}