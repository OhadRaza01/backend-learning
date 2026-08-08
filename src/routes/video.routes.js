import { Router } from "express";
import jwtVerify from "../middlewares/auth.middleware";
import { upload } from "../middlewares/multer.middleware";
import { uploadVideo } from "../controllers/video.controller";


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

export default router;