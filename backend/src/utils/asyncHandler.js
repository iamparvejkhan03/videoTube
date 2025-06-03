const asyncHandler = (func) => async (req, res, next) => {
    try {
        await func(req, res, next);
    } catch (error) {
        console.error("Error in calling the asyncHandler function: ", func);
        res.status(500);
        next(error);
    }
}

export default asyncHandler;