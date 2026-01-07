import express, { Router } from "express";
import { registerUser, login } from "../controllers/auth.controllers.js";
import { validate } from "../middlewares/validator.middleware.js";
import { userRegisterValidator, userLoginValidator } from "../validators/index.js";
const userRouter = Router();

userRouter.route("/register").post(userRegisterValidator(), validate,  registerUser);
userRouter.route("/login").post(userLoginValidator(), validate, login);


export default userRouter;
 