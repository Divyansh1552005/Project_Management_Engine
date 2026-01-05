import mongoose from "mongoose";
import bcrypt from "bcrypt"


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
userSchema.pre("save", async function(next){
  if(!this.isModified("password")) return next()
  this.password = await bcrypt.hash(this.passwords, 10)
  next()
})

// method to verify password 
userSchema.methods.isPasswordCorrect = async function(password){
  // will return a true or false based on comparison
  return await bcrypt.compare(password, this.password)
}

export const userModel = mongoose.model("user", userSchema);
