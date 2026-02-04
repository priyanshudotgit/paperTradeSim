import mongoose from "mongoose";
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: [true, "Username is required"],
        unique: true,
        lowercase: true,
        trim: true,
        index: true,
    },
    age: {
        type: Number,
        required: [true, "Please enter your age"],
    },
    gender: {
        type: String,
        enum: ["male", "female", "other", "na"],
        default: "na",
    },
    email: {
        type: String,
        required: [true, "Please enter an Email ID"],
        unique: true,
        lowercase: true,
        trim: true,
    },
    fullName: {
        type: String,
        required: [true, "Please enter your full name"],
        trim: true,
        index: true,
    },
    avatar: {
        type: String, // cloudinary
        default: "https://cdn-icons-png.flaticon.com/512/13567/13567817.png"
    },
    watchList: [
        {
            type: String,
        }
    ],
    walletBalance: {
        type: Number,
        required: [true, "Please specify balance amount"],
        default: 10000,
    },
    password: {
        type: String,
        required: [true, "Password is required"], // might consider google auth in future
    },
    refreshToken: {
        type: String,
    }
}, {timestamps: true});

// hash password before saving
userSchema.pre("save", async function(next){
    if(!this.isModified("password")) return;

    this.password = await bcrypt.hash(this.password, 10);
});

// check password
userSchema.methods.isPasswordCorrect = async function(password){
    return await bcrypt.compare(password, this.password);
};

// jwt token
userSchema.methods.generateAccessToken = function(){
    return jwt.sign(
        {
            _id: this._id,
            username: this.username,
            fullname: this.fullName,
            email: this.email
        },
        process.env.ACCESS_TOKEN_SECRET,
        {
            expiresIn: process.env.ACCESS_TOKEN_EXPIRY
        }
    )
};

userSchema.methods.generateRefreshToken = function(){
    return jwt.sign(
        {
            _id: this._id,
        },
        process.env.REFRESH_TOKEN_SECRET,
        {
            expiresIn: process.env.REFRESH_TOKEN_EXPIRY
        }
    )
};

export const User = mongoose.model("User", userSchema);