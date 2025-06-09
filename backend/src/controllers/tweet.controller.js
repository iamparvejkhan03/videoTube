import { Tweet } from "../models/tweet.model.js";
import { apiError } from "../utils/apiError.js";
import { apiResponse } from "../utils/apiResponse.js";
import asyncHandler from "../utils/asyncHandler.js";

const addTweet = asyncHandler(async (req, res) => {
    const owner = req.user._id;

    const {content} = req.body;

    if(!owner){
        throw new apiError(401, 'You need to login in order to tweet.');
    }

    if(!content){
        throw new apiError(404, 'Content is required for tweet.');
    }

    const tweet = await Tweet.create({owner, content});

    if(!tweet){
        throw new apiError(401, 'Some error occured while adding the tweet.');
    }

    res.status(200).json(new apiResponse(200, 'Tweet added.', tweet));
})

const deleteTweet = asyncHandler(async (req, res) => {
    const owner = req.user._id;
    const {tid} = req.query;

    if(!owner){
        throw new apiError(401, 'You are not logged in or authorized to delete the tweet');
    }

    const tweetDeleted = await Tweet.findByIdAndDelete(tid);

    if(!tweetDeleted){
        throw new apiError(401, 'Some error occured while deleting the tweet.');
    }

    res.status(200).json(new apiResponse(200, 'tweet deleted.', tweetDeleted));
})

const editTweet = asyncHandler(async (req, res) => {
    const owner = req.user._id;
    const {tid} = req.query;
    const {content} = req.body;

    if(!owner){
        throw new apiError(401, 'You are not logged in or authorized to edit the tweet.')
    }

    const updatedTweet = await Tweet.findByIdAndUpdate(tid, {content}, {new:true});

    if(!updatedTweet){
        throw new apiError(500, 'Some error occured while updating the tweet.');
    }

    res.status(200).json(new apiResponse(200, 'Tweet updated', updatedTweet));
})

const allTweetsOfChannel = asyncHandler(async (req, res) => {
    const {channel} = req.query;
    const allTweets = await Tweet.find({owner:channel});

    if(!allTweets){
        throw new apiError(500, 'Some error occured while fetching the tweets.');
    }

    res.status(200).json(new apiResponse(200, 'All tweets fetched.', allTweets));
})

export {addTweet, deleteTweet, editTweet, allTweetsOfChannel}