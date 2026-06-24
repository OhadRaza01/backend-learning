import asyncHandler from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { User } from "../models/user.model.js"
import { uploadOnCloudinary } from "../utils/fileUpload.js";
import {ApiResponse} from "../utils/ApiResponse.js"

const registerUser = asyncHandler(async (req, res) => {

    // get user details from front-end

    const { username, fullName, email, password } = req.body //req.body return object

    //validation

    if (
        [username, fullName, email, password].some((field) => field?.trim() === "")
    ) {
        throw new ApiError(400, "All fields are required")
    }

    //User.findOne({email}) or we can check multiple using or
    const userExisted = await User.findOne({
        $or: [{ username }, { email }]
    })

    if (userExisted) {
        throw new ApiError(409, "username or email is already registered")
    }

    //upload avatar and image 

    const avatarLocalPath = req.files?.avatar[0]?.path
    const coverImageLocalPath = req.files?.coverImage[0]?.path

    if (!avatarLocalPath) {
        throw new ApiError(409, "avatar is required")
    }

    const avatar = await uploadOnCloudinary(avatarLocalPath)
    const coverImage = await uploadOnCloudinary(coverImageLocalPath)

    if (!avatar) {
        throw new ApiError(409, "Avatar is required")
    }

    // create user in database

    const user = await User.create({
        fullName,
        avatar : avatar.url,
        coverImage : coverImage?.url || "",
        username : username.toLowerCase(),
        email,
        password
    })

    const createdUser = await User.findById(user._id).select(
        "-password -refreshToken"
    )

    if(!createdUser){
        throw new ApiError(500 , "something went wrong while registering user")
    }

    return res.status(201).json(
        new ApiResponse(201 , createdUser , "User Registered succesfully")
    )

})

export { registerUser }