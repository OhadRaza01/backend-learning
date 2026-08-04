import { Router } from "express";
import { changeCurrentPassword, getUserChannelProfile, loginUser, logoutUser, refreshAccessToken, registerUser , updateAccountDetails, updateAvatar, updateCoverImage } from "../controllers/user.controller.js";
import { upload } from "../middlewares/multer.middleware.js";
import jwtVerify from "../middlewares/auth.middleware.js";


const router = Router()

router.route("/register").post(
    upload.fields([
        {
            name: "avatar",
            maxCount: 1
        },
        {
            name: "coverImage",
            maxCount: 1
        }
    ]),
    registerUser
)

router.route("/login").post(loginUser)

//secured routes
router.route("/logout").post(jwtVerify, logoutUser)

router.route("/refresh-token").post(refreshAccessToken)

router.route("/change-password").post(jwtVerify , changeCurrentPassword)

router.route("/update-account-info").post(jwtVerify , updateAccountDetails)

router.route("/update-avatar").post(
    jwtVerify,
    upload.single("avatar"),
    updateAvatar
)

router.route("/update-cover-image").post(
    jwtVerify,
    upload.single("coverImage"),
    updateCoverImage
)

router.route("/channel/:username").get(jwtVerify , getUserChannelProfile)

export default router