import express, { Router } from "express";
import {
  registerUser,
  login,
  logoutUser,
  getCurrentUser,
  changeCurrentPassword,
  resendEmailVerification,
  verifyEmail,
  refreshAccessToken,
  forgotPasswordRequest,
  resetForgotPassword,
} from "../controllers/auth.controllers.js";
import { validate } from "../middlewares/validator.middleware.js";
import {
  userRegisterValidator,
  userLoginValidator,
  userForgotPasswordValidator,
  userChangeCurrentPasswordValidator,
  userResetForgotPasswordValidator,
} from "../validators/index.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const userRouter = Router();

// unsecured routes
userRouter
  .route("/register")
  .post(userRegisterValidator(), validate, registerUser);
userRouter.route("/login").post(userLoginValidator(), validate, login);
userRouter.route("/verify-email/:verificationToken").get(verifyEmail);
userRouter.route("/refresh-token").post(refreshAccessToken);
userRouter
  .route("/forgot-password")
  .post(userForgotPasswordValidator(), validate, forgotPasswordRequest);
userRouter
  .route("/reset-password/:resetToken")
  .post(userResetForgotPasswordValidator(), validate, resetForgotPassword);

// secure routes
userRouter.route("/logout").post(verifyJWT, logoutUser);
userRouter.route("/current-user").get(verifyJWT, getCurrentUser);
userRouter
  .route("/change-password")
  .post(
    verifyJWT,
    userChangeCurrentPasswordValidator(),
    validate,
    changeCurrentPassword,
  );
userRouter
  .route("/resend-email-verification")
  .post(verifyJWT, resendEmailVerification);

export default userRouter;
