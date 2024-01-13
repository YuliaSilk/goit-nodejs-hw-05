import User from "../models/User.js";
import { HttpError } from "../helpers/index.js";
import { ctrlWrapper } from "../decorators/index.js";
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import "dotenv/config.js";
import fs from "fs/promises";
import path from "path";
import gravatar from "gravatar";
import Jimp from "jimp";

const {JWT_SECRET} = process.env;

const avatarsPath = path.resolve("public", "avatars");

export const avatarURL = gravatar.url("email", { s: '250', r: 'pg', d: 'indection' });

const signup = async(req, res) => {
    const {email, password} = req.body;
    const user = await User.findOne({email});
    if(user) {
        throw HttpError(409, "Email is already used")
    }
   
    const hashPassword = await bcrypt.hash(password, 10);

    const newUser = await User.create({...req.body, password: hashPassword});
    res.json({
    email: newUser.email,
     })
}

const signin = async(req, res) => { 
    const {email, password} = req.body;
    const user = await User.findOne({email});
    if(!user) {
        throw HttpError(401, "Email or password is wrong");
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

const updateAvatar = async(req, res) => {
    try {
        const image = await Jimp.read(req.file.buffer);
        image.resize(250, 250);
        const fileName = `${Date.now()} - ${Math.floor(Math.random() * 1000)}.png`;
        const filePath = path.join();
        const {path: oldPath, filename} = req.file;
        const newPath = path.join(avatarsPath, filename);
        await fs.rename(oldPath, newPath);
        const avatar = path.join("avatars", filename);
        image.write(filePath);
        req.user.avatarURL = `/avatars/${fileName}`;
        res.status(200).json({ avatarURL: req.user.avatarURL });
    } catch (error) {
        next(HttpError(401, error.message))
    }
   
}


export default {
    singup: ctrlWrapper(signup),
    signin: ctrlWrapper(signin),
    getCurrent: ctrlWrapper(getCurrent),
    signout: ctrlWrapper(signout),
    updateAvatar: ctrlWrapper(updateAvatar),
}