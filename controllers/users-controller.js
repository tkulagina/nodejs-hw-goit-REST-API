const bcrypt = require ('bcrypt');
const jwt = require ('jsonwebtoken');
const dotenv = require ('dotenv');
const gravatar = require ('gravatar');
const path = require ('path');
const fs = require ('fs/promises');
const Jimp = require ('jimp');
const { v4: uuidv4 } = require ('uuid');

const {User} = require ("../models/user");
const {HttpError, sendEmail} = require ("../helpers");
const {cntrlWrapper} = require ("../middleware");

const avatarsDir = path.join (__dirname, "../", "public", "avatars");

dotenv.config()
const {SECRET_KEY, BASE_URL} = process.env;

const register = async (req, res) => {
    const {email, password} = req.body;
    const user = await User.findOne ({email});
    if (user) {
        throw HttpError (409, "Email in use");
    }

    const hashPassword = await bcrypt.hash (password, 10);
    const avatarURL = gravatar.url (email);
    const verificationToken = uuidv4();

    const newUser = await User.create({...req.body, password: hashPassword, avatarURL, verificationToken});

    const verificationEmail = {
        to: email,
        subject: "Verify email",
        html: `<a target="_blank" href="${BASE_URL}/users/verify/${verificationToken}">Click verify email</a>`
    };

    await sendEmail(verificationEmail);

    res.status(201).json({        
        user: {
            email: newUser.email,
            subscription: "starter",
          }
    });
}

const verifyEmail = async (req, res) => {
    const {verificationToken} = req.params;
    const user = await User.findOne({verificationToken});
    if (!user) {
        throw HttpError (404, "User not found")
    }

    await User.findByIdAndUpdate(user._id, {verify: true, verificationToken: ""});

    res.json({
        message: 'Verification successful'
    })
}

const resendVerifyEmail = async (req, res) => {
    const {email} = req.body;
    const user = await User.findOne({email});
    if (!user) {
        throw HttpError (400, "missing required field email")
    }

    if (user.verify) {
        throw HttpError (400, "Verification has already been passed")
    }

    const verificationEmail = {
        to: email,
        subject: "Verify email",
        html: `<a target="_blank" href="${BASE_URL}/users/verify/${user.verificationToken}">Click verify email</a>`
    };

    await sendEmail(verificationEmail); 

    res.json ({
        "message": "Verification email sent"
    })
}

const login = async (req, res) => {
    const {email, password} = req.body;
    const user = await User.findOne ({email});
    if (!user) {
        throw HttpError (401, "Email or password is wrong")
    }

    if (!user.verify) {
        throw HttpError (404, "User not found")
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

const updateAvatar = async (req, res) => {
    const {_id} = req.user;
    const {path: tempUpload, originalname} = req.file;
    
    const filename = `${_id}_${originalname}`;
    try {
        const resultUpload = path.join (avatarsDir, filename);
        await fs.rename (tempUpload, resultUpload);
        const avatarURL = path.join ("avatars", filename);

        Jimp.read(resultUpload, (error, image) => {
            if (error) throw HttpError(404, "Avatar not found");
            image.resize(250, 250).write(resultUpload);
          });

        await User.findByIdAndUpdate (_id, {avatarURL});
         res.json ({
        "avatarURL": avatarURL,
    });
    } catch (error) { 
        await fs.unlink(tempUpload);
        throw HttpError (401, "Not authorized");
       }

}

module.exports = {
    register: cntrlWrapper(register),
    verifyEmail: cntrlWrapper(verifyEmail),
    resendVerifyEmail: cntrlWrapper(resendVerifyEmail),
    login: cntrlWrapper(login),
    getCurrent: cntrlWrapper(getCurrent),
    logout: cntrlWrapper(logout),
    updateAvatar: cntrlWrapper(updateAvatar),
}