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

export { userRegisterValidator, userLoginValidator };
