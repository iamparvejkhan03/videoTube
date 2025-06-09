import asyncHandler from "../utils/asyncHandler.js";
import { apiError } from "../utils/apiError.js";
import { apiResponse } from "../utils/apiResponse.js";
import { Like } from "../models/like.model.js";

const likeVideo = asyncHandler(async (req, res) => {
    const userId = req.user._id;

    if(!userId){
        throw new apiError(401, 'Please login to like a video.');
    }

    const {vid} = req.query;

    if(!vid){
        throw new apiError(401, 'This video can not be liked.');
    }

    const liked = await Like.create({
        likedBy:userId,
        video:vid,
        comments:[],
        tweets:[]
    })

    if(!liked){
        throw new apiError(500, 'Some error while liking the video.');
    }

    res.status(200).json(new apiResponse(200, 'Video liked.', liked));
})

const deleteLikeVideo = asyncHandler(async (req, res) => {
    const userId = req.user._id;

    if(!userId){
        throw new apiError(401, 'Please login to like a video.');
    }

    const {lid} = req.query;

    if(!lid){
        throw new apiError(401, 'This video can not be liked.');
    }

    const likeDeleted = await Like.findByIdAndDelete(lid);

    if(!likeDeleted){
        throw new apiError(401, 'Some error occured while removing the like from the video.');
    }

    res.status(200).json(new apiResponse(200, 'Video like removed.', likeDeleted));
})

export {likeVideo, deleteLikeVideo}

// const deleteComment = asyncHandler(async (req, res) => {
//     const userId = req.user._id;
//     const {cid} = req.query;

//     if(!userId){
//         throw new apiError(401, 'You are not logged in or authorized to delete the comment');
//     }

    

//     if(!commentDeleted){
//         throw new apiError(401, 'Some error occured while deleting the comment.');
//     }

//     res.status(200).json(new apiResponse(200, 'Comment deleted.', commentDeleted));
// })