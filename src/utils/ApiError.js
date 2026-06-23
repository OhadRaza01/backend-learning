class ApiError extends Error {
    constructor(
        statusCode,
        message = "something went wrong",
        errors = [],
        stack = ""
    ) {
        super(message)
        this.statusCode = statusCode
        this.data = null
        this.errors = errors
        this.success = false

        //stack hota hai Error ki fulldetail kia error hai konse functions execute hue kis line pr error aya debugging mai help krta hai
        if (stack) {
            this.stack = stack
        }
        else {
            Error.captureStackTrace(this , this.constructor)
        }
    }


}


export { ApiError }