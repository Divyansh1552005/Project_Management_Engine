import express, { Router } from "express";
import { registerUser, login, logoutUser } from "../controllers/auth.controllers.js";
import { validate } from "../middlewares/validator.middleware.js";
import { userRegisterValidator, userLoginValidator } from "../validators/index.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const userRouter = Router();

userRouter.route("/register").post(userRegisterValidator(), validate,  registerUser);
userRouter.route("/login").post(userLoginValidator(), validate, login);

// secure routes
userRouter.route("/logout").post(verifyJWT, logoutUser);



export default userRouter;
 