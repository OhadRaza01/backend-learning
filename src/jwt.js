import jwt from "jsonwebtoken"

const token = jwt.sign(
    { 
        name: "test",
        fullname : "ohad raza"
    }
    , "secret123",
    {
        expiresIn:"1d"
    }
)
console.log(token)