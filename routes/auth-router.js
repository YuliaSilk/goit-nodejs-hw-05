import express from 'express';
import { authenticate, isEmptyBody, isValidId } from '../middlewares/index.js';
import {validateBody} from "../decorators/index.js";
import { userSignupSchema, userSigninSchema } from '../models/User.js';
import authController from '../controllers/auth-controller.js';

const authRouter = express.Router();

authRouter.post("/signup", isEmptyBody, validateBody(userSignupSchema), authController.singup);
authRouter.post("/signin", isEmptyBody, validateBody(userSigninSchema), authController.signin);

authRouter.get("/current", authenticate, authController.getCurrent);

authRouter.post("/signout", authenticate,authController.signout);


export default authRouter;

