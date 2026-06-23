import mongoose from "mongoose"
import jwt from "jsonwebtoken"
import bcrypt from "bcrypt"

const userSchema = new mongoose.Schema({

    username: {
        type: String,
        required: [true, "Username is required"],
        unique: true,
        lowercase: true,
        trim: true,
        index: true
    },
    
    email: {
        type: String,
        required: [true , "Fmail is required"],
        unique: true,
        lowercase: true,
        trim: true,
    },
    
    fullName: {
        type: String,
        required: [true, "Fullname is required"],
        trim: true,
        index: true
    },
    
    avatar: {
        type: String, //cloudnary url
        required: true
    },

    coverImage: {
        type: String, //cloudnary url
    },

    watchHistory: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Video"
        }
    ],

    password: {
        type: String,
        required: [true, "Password is required"]
    },

    refreshToken: {
        type: String
    }

}, { timestamps: true })

userSchema.pre("save", async function (next) {

    // check if password is modified or not 
    if (!this.isModified("password")) return next()

    this.password = await bcrypt.hash(this.password, 8)
    next();
})

//method to check password that user insert password correctly
userSchema.methods.isPasswordCorrect = async function (password) {
    return await bcrypt.compare(password, this.password)
}

userSchema.methods.generateAccessToken = function () {
    return jwt.sign(
        {
            _id: this._id,
            email: this.email,
            username: this.username,
            fullName: this.fullName
        },
        process.env.ACCESS_TOKEN_SECRET,
        {
            expiresIn: process.env.ACCESS_TOKEN_EXPIRY
        }
    )
}

userSchema.methods.generateRefreshToken = function () {
    return jwt.sign(
        {
            _id: this._id,
        },
        process.env.REFRESH_TOKEN_SECRET,
        {
            expiresIn: process.env.REFRESH_TOKEN_EXPIRY
        }
    )
}

export const User = mongoose.model("User", userSchema)  