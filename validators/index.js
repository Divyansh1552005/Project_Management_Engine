import { body } from "express-validator";

const userRegisterValidator = () => {
  return [
    body("email")
      .trim()
      .notEmpty()
      .withMessage("Email is reqd")
      .isEmail()
      .withMessage("Email is invalid!"),

    body("username")
      .trim()
      .notEmpty()
      .withMessage("Username cannot be Empty!")
      .isLowercase()
      .withMessage("Username must be in lowercase!")
      .isLength({ min: 3 })
      .withMessage("Username  must be atleast 3 char long"),

    body("password").trim().notEmpty().withMessage("Password is Required!!"),

    body("fullName").optional().trim(),
  ];
};

const userLoginValidator = () => {
  return [
    body("email").optional().isEmail().withMessage("Email aint valid!"),
    body("password").notEmpty().withMessage("Password is required!"),
  ];
};


const userChangeCurrentPasswordValidator = () => {
  return [
    body("oldPassword").notEmpty().withMessage("Old password is required"),
    body("newPassword").notEmpty().withMessage("New password is required"),
  ];
};

const userForgotPasswordValidator = () => {
  return [
    body("email")
      .notEmpty()
      .withMessage("Email is required")
      .isEmail()
      .withMessage("Email is invalid"),
  ];
};

const userResetForgotPasswordValidator = () => {
  return [body("newPassword").notEmpty().withMessage("Password is required")];
};


export { userRegisterValidator, userLoginValidator, userChangeCurrentPasswordValidator, userForgotPasswordValidator, userResetForgotPasswordValidator };
