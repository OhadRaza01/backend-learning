import { v2 as cloudinary } from "cloudinary"
import { response } from "express";
import 'dotenv/config'

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_CLOUD_API,
    api_secret: process.env.CLOUDINARY_CLOUD_API_SECRET // Click 'View API Keys' above to copy your API secret
});

const deleteFileFromCloudinary = async (publicId) => {

    try {

        if (!publicId) return null;

        const result = await cloudinary.uploader.destroy(publicId);

        return result;

    } catch (error) {
        console.log("Error Deleting file from cloudinary")
        return null
    }
}

export{deleteFileFromCloudinary}