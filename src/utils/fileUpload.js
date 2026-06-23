import { v2 as cloudinary } from "cloudinary"
import { response } from "express";
import fs from "fs" //built-in in nodes.js


cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_CLOUD_API,
    api_secret: process.env.CLOUDINARY_CLOUD_API_SECRET // Click 'View API Keys' above to copy your API secret
});

const uploadOnCloudinary = async (filePath) => {
    try {
        if (!filePath) return null;

        const response = await cloudinary.uploader.upload(filePath, {
            resource_type: "auto"
        })
        //file uplaoded successfully 
        console.log("file is uploaded", response.url)
        fs.unlinkSync(filePath) 
        return response
    }
    catch (error) {
        fs.unlinkSync(filePath) // remove temporary save file from server as uploaded failed
        return null;
    }
}
    

export {uploadOnCloudinary}