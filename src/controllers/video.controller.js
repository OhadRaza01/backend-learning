import asyncHandler from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { uploadOnCloudinary } from "../utils/fileUpload.js";
import { Video } from "../models/video.model.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { deleteFileFromCloudinary } from "../utils/deleteFile.js";

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
        videoPublicId: videoFile.public_id,

        thumbnail: thumbnail.secure_url,
        thumbnailPublicId: thumbnail.public_id,

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

const deleteVideo = asyncHandler(async (req, res) => {

    const { videoId } = req.params

    if (!videoId) {
        throw new ApiError(404, "video not found")
    }

    const video = await Video.findOne({
        _id: videoId,
        owner: req.user._id
    });

    if (!video) {
        throw new ApiError(404, "Video not found or you are not authorized");
    }

    const videoPublicId = video.videoPublicId
    const thumbnailPublicId = video.thumbnailPublicId
    
    await deleteFileFromCloudinary(videoPublicId)
    await deleteFileFromCloudinary(thumbnailPublicId)
    
    await video.deleteOne();

    return res
        .status(200)
        .json(
            new ApiResponse(200, {}, "Video is deleted successfully")
        )

})

export { uploadVideo, deleteVideo }