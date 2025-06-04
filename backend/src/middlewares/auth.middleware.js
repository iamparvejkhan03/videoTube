import jwt from 'jsonwebtoken';
import asyncHandler from '../utils/asyncHandler.js';
import { apiError } from '../utils/apiError.js';
import User from '../models/user.model.js';

const verifyJWT = asyncHandler(async (req, res, next) => {
    const accessToken = req.cookies?.accessToken || req.headers.Authorization && req.headers.accessTokenuthorization.split(" ")[1];

    if(!accessToken){
        throw new apiError(400, 'Unauthorized access without token');
    }

    const decodedToken = await jwt.verify(accessToken, process. env.ACCESS_TOKEN_SECRET);

    const user = await User.findById(decodedToken?._id);

    if(!user){
        throw new apiError(400, 'User not found due to access token wrong.');
    }

    req.user = user;

    next();
});

export {verifyJWT}