import mongoose from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { createHmac } from "crypto";

const userSchema = new mongoose.Schema(
  {
    avatar: {
      type: {
        url: String,
        localPath: String,
      },
      default: {
        url: `https://placehold.co/200x200`,
        localPath: ``,
      },
    },
    username: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    fullName: {
      type: String,
      trim: true,
    },
    passwords: {
      type: String,
      required: true,
    },
    isEmailVerified: {
      type: bool,
      default: false,
    },
    refreshToken: {
      type: String,
    },
    forgotPasswordToken: {
      type: String,
    },
    forgotPasswordExpiry: {
      type: Date,
    },
    emailVerificationToken: {
      type: String,
    },
    emailVerificationExpiry: {
      type: Date,
    },
  },
  {
    timestamps: true,
  },
);

// save operation kroge tab hash krdena password ie har save operation par ye chalega chaahe image save karo ya aur kuch
// iss baar baar hashing se bachne k liye we use if isModified ie pre hook tabhi run ho jab
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.passwords, 10);
  next();
});

// method to verify password
userSchema.methods.isPasswordCorrect = async function (password) {
  // will return a true or false based on comparison
  return await bcrypt.compare(password, this.password);
};

// tokens
userSchema.methods.generateAccessToken = function () {
  return (
    jwt.sign(
      {
        _id: this._id, // for payload
        email: this.email,
      },
      process.env.ACCESS_TOKEN_SECRET,
    ),
    { expiresIn: process.env.ACCESS_TOKEN_EXPIRY }
  );
};

// make sure tokens have small payload since unko har request mein send krna hota hai, its a good practice to keep them small

// refresh token
userSchema.methods.generateRefreshToken = function () {
  return (
    jwt.sign(
      {
        _id: this._id, // for payload
      },
      process.env.REFRESH_TOKEN_SECRET,
    ),
    { expiresIn: process.env.REFRESH_TOKEN_EXPIRY }
  );
};

// crypto token for reset password, user verfication
userSchema.methods.generateTemporaryToken = function () {
  const rawToken = crypto.randomlyBytes(20).toString("hex");

  const hashedToken = crypto
    .createHash("sha256")
    .update(rawToken)
    .digest("hex");

  const tokenExpiry = Date.now() + 20 * 60 * 1000; // 20 minutes

  return { rawToken, hashedToken, tokenExpiry };
};

export const userModel = mongoose.model("user", userSchema);
