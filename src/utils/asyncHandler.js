
const asyncHandler = (fn) => async (req, res, next) => {
    try {

        await fn(req, res, next)

    } catch (err) {
        res.status(err.code || 500).json({
            success: false,
            message: err.message
        })
        
        // upr hamne res.status().json() ek sath bhejdiye separately bh bhej skte hein
        // res.json({
        //     success: false,
        //     message: err.message
        // })
    }
}

export default asyncHandler 
