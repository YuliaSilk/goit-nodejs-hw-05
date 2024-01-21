import User from "../models/User.js";
import { HttpError, sendEmail } from "../helpers/index.js";
import { ctrlWrapper } from "../decorators/index.js";
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import "dotenv/config.js";
import fs from "fs/promises";
import path from "path";
import gravatar from "gravatar";
import Jimp from "jimp";
import { nanoid } from "nanoid";

const {JWT_SECRET, BASE_URL} = process.env;

const avatarsPath = path.resolve("public", "avatars");

const signup = async(req, res) => {
    const {email, password} = req.body;
    const user = await User.findOne({email});
    if(user) {
        throw HttpError(409, "Email is already used")
    }
   
    const hashPassword = await bcrypt.hash(password, 10);
    const avatarURL = gravatar.url(email);
    const verificationCode = nanoid();
    const newUser = await User.create({...req.body, password: hashPassword, avatarURL} );
   
    const verifyEmail = {
        to: email,
        subject: "verify email",
        html: `<a target="_blank" href="${BASE_URL}/api/auth/verify/${verificationCode}">Click to verify email</a>`
    }

    await sendEmail(verifyEmail);
   
    res.status(201).json({
    email: newUser.email,
     })
    
     
}

const signin = async(req, res) => { 
    const {email, password} = req.body;
    const user = await User.findOne({email});
    if(!user) {
        throw HttpError(401, "Email or password is wrong");
    }

    if(!user.verify) {
        throw HttpError(401, "Email not verify");
    }

    const passwordCompare = await bcrypt.compare(password, user.password);
    if(!passwordCompare) {
        throw HttpError(401, "Email or password is wrong");
    }

    const {_id: id} = user;
    const payload = {
        id
    };

    const token = jwt.sign(payload, JWT_SECRET, {expiresIn: "23h"});
    await User.findByIdAndUpdate(id, {token});

    res.json({
        token,
    })
}

const verify = async(req, res) => {
    const {verificationCode} = req.params;
    const user = await User.findOne({verificationCode});
    if(!user) {
        throw HttpError(400, "Email already varify or not found");
    }
    await User.findByIdAndUpdate(user._id, {verify: true, verificationCode: ""})

    res.json({
        message: "Email verify success"
    })    
}

const resendVerifyEmail = async(req, res) => {
    const {email} = req.body;
    const user = await User.findOne({email});
    if(!user) {
        throw HttpError(404, "Email not found");
    }

    if(user.verify) {
        throw HttpError(400, "Email is already");
    }
    const verifyEmail = {
        to: email,
        subject: "verify email",
        html: `<a target="_blank" href="${BASE_URL}/api/auth/verify/${user.verificationCode}">Click to verify email</a>`
    }
    await sendEmail(verifyEmail);

    res.json({
        message: "Verify email send succes"
    })
}

const getCurrent = async(req, res) => {
    const {email} = req.user;

    res.json({
        email,
    })
}

const signout = async(req, res) => {
    const {_id} = req.user;
    await User.findByIdAndUpdate(_id, {token: ""});

    res.json({
        message: "Signout success"
    })
}


const updateAvatar = async (req, res, next) => {
    try {
      if (!req.file) {
            throw HttpError(400,  "Sorry, something is wrong! You don't have an avatar.");
          }
      const { _id } = req.user;
      const fileName = `${Date.now()}-${Math.floor(Math.random() * 1000)}.png`;
      const filePath = path.join(avatarsPath, fileName);
      const { path: oldPath, filename } = req.file;
      const newPath = path.join(avatarsPath, filename);
      await fs.rename(oldPath, newPath);
      const avatarURL = path.join(avatarsPath, filename);
        
      const image = await Jimp.read(filePath);
      image.resize(250, 250);
      await image.writeAsync(filePath);

      await User.findByIdAndUpdate(_id, 
        { $set: { avatarURL } },
        { new: true });
  
      res.status(200).json({ avatarURL });
    } catch (error) {
      next(HttpError(401, error.message));
    }
  };


export default {
    singup: ctrlWrapper(signup),
    verify: ctrlWrapper(verify),
    resendVerifyEmail: ctrlWrapper(resendVerifyEmail), 
    signin: ctrlWrapper(signin),
    getCurrent: ctrlWrapper(getCurrent),
    signout: ctrlWrapper(signout),
    updateAvatar: ctrlWrapper(updateAvatar),
}