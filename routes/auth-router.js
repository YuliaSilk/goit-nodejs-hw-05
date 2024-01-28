import express from 'express';
import { authenticate, isEmptyBody, upload } from '../middlewares/index.js';
import {validateBody} from "../decorators/index.js";
import { userSignupSchema, userSigninSchema, userEmailSchema } from '../models/User.js';
import authController from '../controllers/auth-controller.js';

const authRouter = express.Router();

authRouter.post("/signup", isEmptyBody, validateBody(userSignupSchema), authController.singup);
authRouter.post("/signin", isEmptyBody, validateBody(userSigninSchema), authController.signin);

authRouter.get("/current", authenticate, authController.getCurrent);

authRouter.post("/signout", authenticate, authController.signout);

authRouter.patch("/users/avatars", authenticate, upload.single("avatar"), authController.updateAvatar)

authRouter.get("/verify/:verificationToken", authController.verify)

authRouter.post("/verify", isEmptyBody, validateBody(userEmailSchema), authController.resendVerifyEmail);

export default authRouter;

