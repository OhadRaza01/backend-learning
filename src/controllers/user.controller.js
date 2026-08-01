import asyncHandler from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { User } from "../models/user.model.js"
import { uploadOnCloudinary } from "../utils/fileUpload.js";
import { ApiResponse } from "../utils/ApiResponse.js"
import "dotenv/config"
import jwt from "jsonwebtoken"

//options of cookies
const options = {
    httpOnly: true,
    secure: true
}

const generateAccessTokenAndRefreshToken = async (userId) => {

    try {

        const user = await User.findOne(userId)

        const accessToken = user.generateAccessToken();
        const refreshToken = user.generateRefreshToken();

        user.refreshToken = refreshToken
        await user.save({ validateBeforeSave: false })

        return { accessToken, refreshToken }
    }
    catch (error) {
        throw new ApiError(500, "something went wrong while generating refresh and access token")
    }
}

const registerUser = asyncHandler(async (req, res) => {

    // get user details from front-end

    const { username, fullName, email, password } = req.body //req.body return object
    // console.log(username, fullName, email, password)
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
    // const coverImageLocalPath = req.files?.coverImage[0]?.path

    let coverImageLocalPath;
    if (req.files && req.files.coverImage && req.files.coverImage.length > 0) {
        coverImageLocalPath = req.files.coverImage[0].path
    }

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
        avatar: avatar.url,
        coverImage: coverImage?.url || "",
        username: username.toLowerCase(),
        email,
        password
    })

    const createdUser = await User.findById(user._id).select(
        "-password -refreshToken"
    )

    if (!createdUser) {
        throw new ApiError(500, "something went wrong while registering user")
    }

    return res.status(201).json(
        new ApiResponse(201, createdUser, "User Registered succesfully")
    )

})

const loginUser = asyncHandler(async (req, res) => {

    //sbse pehle to email or password extract hoga req.body se
    //validate hogi fields kai khaali to nhi hein na 
    //check hoga email sahi format mai hai ya nh
    //is password correct method se password verify hoga 
    //phr user ko validate krenge ham
    //phr access token and refresh token generate krenge jiski madad se user login krega 
    //send cookies to user

    const { username, email, password } = req.body

    if (!username && !email) {
        throw new ApiError(400, "Username or email is required")
    }

    const user = await User.findOne({
        $or: [{ username }, { email }]
    })

    if (!user) {
        throw new ApiError(404, "user doesnot exist")
    }

    const isPasswordValid = await user.isPasswordCorrect(password)

    if (!isPasswordValid) {
        throw new ApiError(401, "Invalid user credentials")
    }

    const { accessToken, refreshToken } = await generateAccessTokenAndRefreshToken(user._id)

    const loggedInUser = await User.findById(user._id).select("-password -refreshToken")

    return res.status(200)
        .cookie("accessToken", accessToken, options)
        .cookie("refreshToken", refreshToken, options)
        .json(
            new ApiResponse(
                200,
                {
                    user: loggedInUser, accessToken, refreshToken
                },
                "user logged in succesfully"
            )
        )

})

const logoutUser = asyncHandler(async (req, res) => {

    const userId = req.user._id

    await User.findByIdAndUpdate(
        userId,
        {
            $unset: {
                refreshToken: 1
            }
        }
    )

    const options = {
        httpOnly: true,
        secure: true
    }

    return res.status(200)
        .clearCookie("accessToken", options)
        .clearCookie("refreshToken", options)
        .json(
            new ApiResponse(200, {}, "User logged out successfully")
        )
})

const refreshAccessToken = asyncHandler(async (req, res) => {

    const incomingRefreshToken = req.cookies?.refreshToken || req.body.refreshToken

    if (!incomingRefreshToken) {
        throw new ApiError(401, "Unauthorized Access")
    }

    try {
        const decodedToken = jwt.verify(incomingRefreshToken, process.env.REFRESH_TOKEN_SECRET)

        const user = await User.findById(decodedToken._id)

        if (!user) {
            throw new ApiError(401, "Invalid refresh token")
        }

        if (incomingRefreshToken !== user?.refreshToken) {
            throw new ApiError(401, "Refresh token is not valid")
        }

        const { accessToken, refreshToken } = await generateAccessTokenAndRefreshToken(user._id)

        return res.status(200)
            .cookie("accessToken", accessToken, options)
            .cookie("refreshToken", refreshToken, options)
            .json(
                new ApiResponse(200, {}, "access token is refreshed")
            )

    } catch (error) {
        throw new ApiError(401, error?.message || ("invalid refresh token"))
    }

})

const changeCurrentPassword = asyncHandler(async (req, res) => {

    const { oldPassword, newPassword, confirmPassword } = req.body

    const user = await User.findById(req.user?._id)

    if (!oldPassword || !newPassword || !confirmPassword) {
        throw new ApiError(400, "All password fields are required.")
    }

    const isPasswordValid = await user.isPasswordCorrect(oldPassword)

    if (!isPasswordValid) {
        throw new ApiError(400, "old password is invalid")
    }

    if (!(newPassword === confirmPassword)) {
        throw new ApiError(400, "new password and confirm password should be same.")
    }

    user.password = newPassword

    user.save({ validateBeforeSave: false })

    return res
    .status(200)
    .json(
        new ApiResponse(200 , {} , "Password is changed successfully.")
    )
})

export { registerUser, loginUser, logoutUser, refreshAccessToken , changeCurrentPassword }