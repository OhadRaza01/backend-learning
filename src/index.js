import app from "./app.js";
import connectDB from "./db/index.js";
import 'dotenv/config'

const port = process.env.PORT || 3000

connectDB()
    .then(() => {
        app.listen(port, () => {
            console.log(`app is listening at port ${port}`)
        })
    })
    .catch((err) => {
        console.log("MongoDB connection failed !!", err)
    })

// import express from "express"

// const app = express();

// (async () => {
//     try {

//         await mongoose.connect(`${process.env.MONGODB_URL}/${DB_NAME}`)
//         app.on("error", (error) => {
//             console.log("Error :", error)
//         })

//         app.listen(process.env.PORT , ()=>{
//             console.log(`App is listening on port ${process.env.PORT}`)
//         })

//     } catch (error) {
//         console.log("Error:", error)
//     }
// })()