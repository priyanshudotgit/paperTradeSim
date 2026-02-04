import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from '../utils/ApiResponse.js';
import { asyncHandler } from "../utils/asyncHandler.js";
import { User } from "../models/index.js";

const generateAccessAndRefreshToken = async(userId) => {
    try {
        const user = await User.findOne(userId);
        const accessToken = user.generateAccessToken();
        const refreshToken = user.generateRefreshToken();

        user.refreshToken = refreshToken;
        await user.save({validateBeforeSave: false})

        return {accessToken, refreshToken}
    } catch (error) {
        throw new ApiError(500, "Error generating tokens")
    }
}

const registerUser = asyncHandler(async (req, res) => {
    // get data
    const {username, age, gender, email, fullName, password} = req.body;

    // empty validation
    if([username, email, fullName, password].some((field) => field?.trim() === "") || !age){
        throw new ApiError(400, "Field(s) cannot be empty");
    }

    if(gender && !["male", "female", "other", "na"].includes(gender)){
        throw new ApiError(400, "Invalid gender selected");
    }

    // already existing user
    const userExists = await User.findOne({
        $or: [{ username }, { email }]
    })

    if(userExists){
        throw new ApiError(409, "User with email or username already exists");
    }

    // create user
    const user = await User.create({
        username: username.toLowerCase(),
        age,
        gender: gender || "na",
        email,
        fullName,
        password
    })

    const createdUser = await User.findById(user._id).select(
        "-password -refreshToken"
    )

    if(!createdUser){
        throw new ApiError(500, "Error registering user");
    }

    return res.status(201).json(
        new ApiResponse(200, createdUser, "User registered Successfully")
    )
})

const loginUser = asyncHandler(async (req, res) => {
    const {username, email, password} = req.body;

    if(!username && !email){
        throw new ApiError(400, "Username or Email is required");
    }

    const user = await User.findOne({
        $or: [{ username }, { email }]
    })

    if(!user){
        throw new ApiError(404, "User does not exist");
    }

    const isPasswordValid = user.isPasswordCorrect(password);

    if(!isPasswordValid){
        throw new ApiError(401, "Invalid User Password");
    }

    const {accessToken, refreshToken} = await generateAccessAndRefreshToken(user._id);

    const loggedInUser = await User.findById(user._id).select("-password -refreshToken");

    return res
    .status(200)
    .cookie("accessToken", accessToken, {httpOnly: true, secure: true})
    .cookie("refreshToken", refreshToken, {httpOnly: true, secure: true})
    .json(
        new ApiResponse(200, {user: loggedInUser, accessToken, refreshToken}, "User Logged In Successfully")
    )
})

const logoutUser = asyncHandler(async (req, res) => {
    await User.findByIdAndUpdate(
        req.user_id,
        {
            $unset: {
                refreshToken: 1
            }
        },
        {
            new: true
        }
    )

    return res
    .status(200)
    .clearCookie("accessToken", {httpOnly: true, secure: true})
    .clearCookie("refreshToken", {httpOnly: true, secure: true})
    .json(new ApiResponse(200, {}, "User Logged Out Successfully"))
})

const getCurrentUser = asyncHandler(async(req, res) => {
    return res
    .status(200)
    .json(new ApiResponse(200, req.user, "User fetched successfully"))
})

export {registerUser, loginUser, logoutUser, getCurrentUser};