import asyncHandler from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { uploadOnCloudinary } from "../utils/fileUpload.js";
import { Video } from "../models/video.model.js";
import { ApiResponse } from "../utils/ApiResponse.js";

const uploadVideo = asyncHandler(async (req, res) => {

    const { title, description } = req.body

    if (!title || !description) {
        throw new ApiError(400, "All fields are required.")
    }

    const videoFileLocalPath = req.files?.videoFile?.[0]?.path
    const thumbnailLocalPath = req.files?.thumbnail?.[0]?.path

    if (!videoFileLocalPath) {
        throw new ApiError(400, "Video file is required")
    }

    if (!thumbnailLocalPath) {
        throw new ApiError(400, "Thumnail is required")
    }

    const videoFile = await uploadOnCloudinary(videoFileLocalPath)
    const thumbnail = await uploadOnCloudinary(thumbnailLocalPath)

    if (!videoFile || !thumbnail) {
        throw new ApiError(500, "something went wrong while uploading files to cloudinary")
    }

    const video = await Video.create({
        videoFile: videoFile.secure_url,
        videoPublicId : videoFile.public_id,

        thumbnail: thumbnail.secure_url,
        thumbnailPublicId : thumbnail.public_id,

        title,
        description,
        duration: videoFile.duration,
        owner: req.user._id
    })

    if (!video) {
        throw new ApiError(500, "something went wrong while uploading video")
    }

    return res
        .status(201)
        .json(
            new ApiResponse(201, { video }, "Video is uploaded successfully")
        )
})

export {uploadVideo}