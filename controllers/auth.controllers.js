import { userModel } from "../models/user.models.js";
import { ApiResponse } from "../utils/api-response.js";
import { ApiError } from "../utils/api-error.js";
import { asyncHandler } from "../utils/async-handler.js";
import { emailVerificationMailgenContent, sendEmail } from "../utils/mail.js";

const generateAccessAndRefreshTokens = async (userId) => {
  try {
    const user = await userModel.findById(userId);
    const accessToken = user.generateAccessToken();
    const refreshToken = user.generateRefreshToken();

    user.refreshToken = refreshToken;

    // Saves the updated user document to the database without running schema validations.
    // `validateBeforeSave: false` is used when we intentionally skip validations
    // (e.g., updating only a token or a derived field) to avoid unnecessary validation errors on unchanged fields.

    await user.save({
      validateBeforeSave: false,
    });

    return { accessToken, refreshToken };
  } catch (error) {
    throw new ApiError(
      500,
      "Something went wrong while generating access token!!",
    );
  }
};

const registerUser = asyncHandler(async (req, res) => {
  const { email, username, password, role } = req.body;

  const existingUser = await userModel.findOne({
    // if there exists a user with same email or name
    $or: [{ username }, { email }],
  });

  if (existingUser) {
    throw new ApiError(409, "User with email or username already exists!", []);
  }

  const user = await userModel.create({
    email,
    password,
    username,
    isEmailVerified: false,
  });

  // first generate temp token for verification
  const { rawToken, hashedToken, tokenExpiry } = user.generateTemporaryToken();

  user.emailVerificationToken = hashedToken;
  user.emailVerificationExpiry = tokenExpiry;

  await user.save({
    validateBeforeSave: false,
  });

  // now send email to the user
  await sendEmail({
    email: user?.email,
    subject: "Please verify your email",
    mailgenContent: emailVerificationMailgenContent(
      user.username,
      `${req.protocol}://${req.get("host")}/api/v1/users/verify-email/${rawToken}`,
    ),
  });

  const createdUser = await userModel
    .findById(user._id)
    .select(
      "-password -refreshToken -emailVerificationToken -emailVerificationExpiry",
    );

  if (!createdUser) {
    throw new ApiError(500, "Something went wrong while registering the user!");
  }

  return res
    .status(201)
    .json(
      new ApiResponse(
        200,
        { user: createdUser },
        "User registered successfully and verification has been sent on your email!",
      ),
    );
});

const login = asyncHandler(
  async (req,res) =>{
    const {email, password, username} = req.body
    
    if(!email){
      throw new ApiError(400, "Email is reqd!")
    }
    
    const user = await userModel.findOne({
      email
    })
    
    if(!user){
      throw new ApiError(400, "User does not exists!")
    }
    
    const isPasswordValid = await user.isPasswordCorrect(password);
    
    if(!isPasswordValid){
      throw new ApiError(400, "Invalid Credentials!")
    }
    
    const { accessToken, refreshToken } = await generateAccessAndRefreshTokens(user._id)
    
    const loggedInUser = await userModel
      .findById(user._id)
      .select(
        "-password -refreshToken -emailVerificationToken -emailVerificationExpiry",
      );
  
    const options = {
      httpOnly : true,
      secure : true
    }
    
    return res.status(200).cookie("accessToken", accessToken, options).cookie("refreshToken", refreshToken, options).json(
      new ApiResponse(
        200,
        {
          user: loggedInUser,
          accessToken,
          refreshToken
        },
        "User Logged in Successfully!"
      )
    )
    
  }
)


export { registerUser, login };
