import asyncHandler from "../utils/asyncHandler.js";
import { apiError } from "../utils/apiError.js";
import { apiResponse } from "../utils/apiResponse.js";
import { Comment } from "../models/comment.model.js";
import mongoose from "mongoose";

const addComment = asyncHandler(async (req, res) => {
    const userId = req.user._id;
    const {vid} = req.query;
    const {content} = req.body;

    if(!userId){
        throw new apiError(401, 'You need to login in order to comment.');
    }

    const comment = await Comment.create({
        owner:userId,
        content,
        video:vid
    })

    if(!comment){
        throw new apiError(500, 'Could not add the comment.');
    }

    res.status(200).json(new apiResponse(200, 'Comment added.', comment));
})

const deleteComment = asyncHandler(async (req, res) => {
    const userId = req.user._id;
    const {cid} = req.query;

    if(!userId){
        throw new apiError(401, 'You are not logged in or authorized to delete the comment');
    }

    const commentDeleted = await Comment.findByIdAndDelete(cid);

    if(!commentDeleted){
        throw new apiError(401, 'Some error occured while deleting the comment.');
    }

    res.status(200).json(new apiResponse(200, 'Comment deleted.', commentDeleted));
})

const editComment = asyncHandler(async (req, res) => {
    const userId = req.user._id;
    const {cid} = req.query;
    const {content} = req.body;

    if(!userId){
        throw new apiError(401, 'You are not logged in or authorized to edit the comment.')
    }

    const updatedComment = await Comment.findByIdAndUpdate(cid, {content}, {new:true});

    if(!updatedComment){
        throw new apiError(500, 'Some error occured while updating the comment.');
    }

    res.status(200).json(new apiResponse(200, 'Comment updated', updatedComment));
})

const allCommentsOfChannel = asyncHandler(async (req, res) => {
    const {vid} = req.query;
    // const allComments = await Comment.find({video:vid})

    const allComments = await Comment.aggregate([
        {
            $match: {
                video: new mongoose.Types.ObjectId(vid)
            }
        },
        {
            $limit:1
        },
        {
            $lookup: {
                from: 'users',
                localField: 'owner',
                foreignField: '_id',
                as: 'owner'
            },
            $lookup: {
                from: 'videos',
                localField: 'video',
                foreignField: '_id',
                as: 'video'
            }
        },
        {
            $addFields: {
                username: '$owner.username',
                email: '$owner.email',
                title: '$video.title',
                description: '$video.description',
                duration: '$video.duration'
            }
        },
        {
            $project: {
                content:1, title:1, description:1, duration:1, username:1, email:1
            }
        }
    ])

    if(!allComments){
        throw new apiError(500, 'Some error occured while fetching the comments.');
    }

    res.status(200).json(new apiResponse(200, 'All comments fetched.', allComments));
})

export {addComment, deleteComment, editComment, allCommentsOfChannel}