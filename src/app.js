import express from "express"
import cors from "cors"
import cookieParser from "cookie-parser"

const app = express()

//configureing app
app.use(cors({
    origin: process.env.CORS_ORIGIN,
    credentials : true
}))
app.use(express.json({limit : "16kb"})) //server json mai data accept krega ab
app.use(express.urlencoded({extended :true , limit : "16kb"}))
app.use(express.static("public"))
app.use(cookieParser())

import userRouter from "./routes/user.routes.js"

app.use("/api/v1/users" , userRouter)
app.get("/",(req , res)=>{
    res.send("<h1>hehe suii</h1>")
})

export default app