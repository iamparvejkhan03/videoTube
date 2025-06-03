import asyncHandler from '../utils/asyncHandler.js';

const registerUser = asyncHandler(async (req, res) => {
    //Here the res and req are parameters intially and they are coming from the asyncHandler's function
    //that it created to call the function inside the try and catch block and allot the req, and res to it.
    res.status(200).send("Data received successfully.");
});

export {registerUser}