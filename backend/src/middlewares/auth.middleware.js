import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import jwt from 'jsonwebtoken';
import { User } from "../models/index.js";

export const verifyJWT = asyncHandler(async (req, _, next) => {
    try {
        // check for token
        const token = req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ", "");

        if(!token){
            throw new ApiError(401, "Unauthorized Access");
        }

        // decide token
        const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

        // find user
        const user = await User.findById(decodedToken?._id).select("-password -refreshToken")

        if(!user){
            throw new ApiError(401, "Invalid access token");
        }

        // attach user to req
        req.user = user;
        next();
    } catch (error) {
        throw new ApiError(401, error?.message || "Invalid access token")
    }
})