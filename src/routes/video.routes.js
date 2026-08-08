import { Router } from "express";
import jwtVerify from "../middlewares/auth.middleware.js";
import { upload } from "../middlewares/multer.middleware.js";
import { deleteVideo, uploadVideo } from "../controllers/video.controller.js";


const router = Router()

router.route("/upload-video").post(
    jwtVerify,
    upload.fields([
        {
            name: "videoFile",
            maxCount: 1
        },
        {
            name: "thumbnail",
            maxCount: 1
        }
    ]),
    uploadVideo
)

router.route("/delete-video/:videoId").delete(
    jwtVerify,
    deleteVideo
)

export default router;