import asyncHandler from '../utils/asyncHandler.js';
import {apiError} from '../utils/apiError.js';
import User from '../models/user.model.js';
import {uploadOnCloudinary} from '../utils/cloudinary.js';
import {apiResponse} from '../utils/apiResponse.js';
import jwt from 'jsonwebtoken';
import mongoose, { Schema } from 'mongoose';

const registerUser = asyncHandler(async (req, res) => {
    //Here the res and req are parameters intially and they are coming from the asyncHandler's function
    //that it created to call the function inside the try and catch block and allot the req, and res to it.
    
    const { username, email, fullName, password } = req.body;

    if(
        [username, email, fullName, password].some(field => field.trim() === "")
    ){
        throw new apiError(400, 'All fields are required');
    }

    const userAlreadyExists = await User.findOne({
        $or: [{email}, {username}]
    })

    if(userAlreadyExists){
        throw new apiError(400, 'Username or email already exists');
    }

    const avatarLocalPath = req.files?.avatar[0]?.path;
    const coverImageLocalPath = req.files?.coverImage[0]?.path;

    if(!avatarLocalPath){
        throw new Error(500, 'Avatar image is required.');
    }

    const avatar = await uploadOnCloudinary(avatarLocalPath);
    const coverImage = await uploadOnCloudinary(coverImageLocalPath);

    if(!avatar){
        throw new apiError(400, 'Avatar image is required.');
    }

    const user = await User.create({
        username: username.toLowerCase(),
        email,
        fullName,
        password,
        avatar: avatar?.secure_url,
        coverImage: coverImage?.secure_url || ""
    });

    const userCreated = await User.findById(user._id).select("-password -refreshToken");

    if(!userCreated){
        throw new apiError(500, 'Some error occured while creating the user.');
    }

    res.status(200).json(new apiResponse(200, 'User created successfully.', userCreated));
})

const generateAccessAndRefreshToken = async (user) => {
    try{
        const accessToken = await user.generateAccessToken();
        const refreshToken = await user.generateRefreshToken();

        user.refreshToken = refreshToken;
        await user.save();
        //{validateBeforeSave:true}

        return {accessToken, refreshToken};
    }catch(error){
        throw new apiError(500, 'Some error occured while generating the access and refresh token.');
    }
}

const loginUser = asyncHandler(async (req, res) => {
    const {email, username, password} = req.body;

    if(!email || !username){
        throw new apiError(400, 'Email or username are required.');
    }

    const user = await User.findOne({
        $or: [{email}, {username}]
    });

    if(!user){
        throw new apiError(400, 'No user found!');
    }

    const isPasswordValid = await user.isPasswordCorrect(password);

    if(!isPasswordValid){
        throw new apiError(400, 'Password is not correct!');
    }

    const options = {
        httpOnly:true,
        secure:true
    }

    const {accessToken, refreshToken} = await generateAccessAndRefreshToken(user);

    res.status(200).cookie("accessToken", accessToken, options).cookie("refreshToken", refreshToken, options).json(new apiResponse(200, 'Logged-in successfully.', {user, accessToken, refreshToken}));
})

const logOutUser = asyncHandler(async (req, res) => {
    const user = await User.findByIdAndUpdate(req.user._id, {refreshToken: ""}, {new:true});

    const options = {
        httpOnly:true,
        secure:true
    }

    res.status(200).clearCookie('accessToken', options).clearCookie('refreshToken', options).json(new apiResponse(200, 'Logged out successfully.'));
});

const refreshAccessToken = asyncHandler(async (req, res) => {
    const refreshToken = req.cookies.refreshToken || req.body.refreshToken;

    if(!refreshToken){
        throw new apiError(401, 'Refresh token not received for refreshing access token.');
    }

    const decodedToken = await jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);

    const user = await User.findById(decodedToken._id);

    if(!user){
        throw new apiError(404, 'User not found with the refresh token id');
    }

    if(refreshToken !== user.refreshToken){
        throw new apiError(401, 'The refresh token does not the one in the database.');
    }

    const {accessToken, refreshToken:newRefreshToken} = await generateAccessAndRefreshToken(user);

    const options = {
        httpOnly:true,
        secure:true
    }

    res.status(200).cookie('accessToken', accessToken, options).cookie('refreshToken', newRefreshToken, options).json(new apiResponse(200, 'Access token refreshed.', {accessToken, newRefreshToken}));
})

const updateUserPassword = asyncHandler(async (req, res) => {
    const {oldPassword, newPassword} = req.body;

    if(!oldPassword || !newPassword){
        throw new apiError(400, 'Old and new both passwords are required.');
    }

    const user = req.user;

    if(!user){
        throw new apiError(400, 'There was some error in fetching the user in the update password.');
    }

    const isPasswordCorrect = await user.isPasswordCorrect(oldPassword);

    if(!isPasswordCorrect){
        throw new apiError(400, 'Old password is wrong and does not match the one in the database.');
    }

    user.password = newPassword;
    await user.save({validateBeforeSave:false});

    res.status(200).json(new apiResponse(200, 'Password has been updated successfully.'));

})

const updateUserDetails = asyncHandler(async (req, res) => {
    const user = req.user;

    if(!user){
        throw new apiError(400, 'User was not attached to req.user.');
    }

    const {username, email} = req.body;

    if(!(username || email)){
        throw new apiError(400, 'Username and email are requied.');
    }

    user.username = username;
    user.email = email;

    await user.save({validateBeforeSave:false});

    res.status(200).json(new apiResponse(200, 'Username and email updated successfully.'));
})

const updateUserAvatar = asyncHandler(async (req, res) => {
    const avatarLocalPath = req.file?.path;

    if(!avatarLocalPath){
        throw new apiError(404, 'Avatar not uploaded.');
    }

    const avatarUrl = await uploadOnCloudinary(avatarLocalPath);

    if(!avatarUrl){
        throw new apiError(500, 'Could not upload the image on cloudinary.');
    }

    const user = req.user;

    if(!user){
        throw new apiError(404, 'User was not attached in the request.');
    }

    user.avatar = avatarUrl.secure_url;
    await user.save({validateBeforeSave:false});

    res.status(200).json(new apiResponse(200, 'Avatar updated successfully.'));
})

const updateUserCoverImage = asyncHandler(async (req, res) => {
    const coverImageLocalPath = req.file?.path;

    if(!coverImageLocalPath){
        throw new apiError(404, 'CoverImage not uploaded.');
    }

    const coverImageUrl = await uploadOnCloudinary(coverImageLocalPath);

    if(!coverImageUrl){
        throw new apiError(500, 'Could not upload the cover image on cloudinary.');
    }

    const user = req.user;

    if(!user){
        throw new apiError(404, 'User was not attached in the request.');
    }

    user.coverImage = coverImageUrl.secure_url;
    await user.save({validateBeforeSave:false});

    res.status(200).json(new apiResponse(200, 'CoverImage updated successfully.'));
})

const getCurrentUser = asyncHandler(async (req, res) => {
    const user = req.user;

    if(!user){
        throw new apiError(500, 'There was some error getting the current error/');
    }

    res.status(200).json(new apiResponse(200, 'Current user fetched.', user));
})

const getChannelProfileData = asyncHandler(async (req, res) => {
    const {username} = req.params;
    const userId = new mongoose.Types.ObjectId(req.user._id);
    

    const channelProfileData = await User.aggregate([
        {
            $match: {
                username: username?.toLowerCase()
            }
        },
        {
            $lookup: {
                from: "subscriptions",
                localField: "_id",
                foreignField: "channel",
                as: "allSubscriptions"
            }
        },
        {
            $lookup: {
                from: "subscriptions",
                localField: "_id",
                foreignField: "subscriber",
                as: "subscribedTo"
            }
        },
        {
            $addFields: {
                subscribersCount: {
                    $size: "$allSubscriptions"
                },
                subscribedToCount: {
                    $size: "$subscribedTo"
                },
                isSubscribed: {
                    $cond: {
                        if: {$in: [userId, '$allSubscriptions.subscriber']},
                        then: true,
                        else: false
                    }
                }
            }
        },
        {
            $project: {
                username:1, email:1, fullName:1, avatar:1, coverImage:1, subscribersCount:1, subscribedToCount:1, isSubscribed:1
            }
        }
    ]);

    // console.log(channelProfileData);

    if(!channelProfileData?.length){
        throw new apiError(400, 'Channel data not recieved.');
    }

    res.status(200).json(new apiResponse(200, 'Channel data received.', channelProfileData));
})

const getUsersWatchHistory = asyncHandler(async (req, res) => {
    const userId = new mongoose.Types.ObjectId(req.user._id);

    const user = await User.aggregate([
        {
            $match: {_id: userId}
        },
        {
            $lookup: {
                from: "videos",
                localField: "watchHistory",
                foreignField: "_id",
                as: "watchHistory",
                pipeline: [
                    {
                        $lookup: {
                            from: 'users',
                            localField: 'owner',
                            foreignField: '_id',
                            as: 'owner', 
                            pipeline: [
                                {
                                    $project: {
                                        username:1,
                                        fullName:1,
                                        avatar:1
                                    }
                                }
                            ]
                        },
                    },
                    {
                        $addFields: {
                            owner: {
                                $first: '$owner'
                            }
                        }
                    }
                ]
            }
        }
    ]);

    // console.log(user);

    if(!user){
        throw new apiError(500, 'Error while getting the watch history.');
    }

    res.status(200).json(new apiResponse(200, 'Watch history fetched.', user[0].watchHistory));
})

export {registerUser, loginUser, logOutUser, refreshAccessToken, updateUserPassword, updateUserDetails, updateUserAvatar, updateUserCoverImage, getCurrentUser, getChannelProfileData, getUsersWatchHistory}