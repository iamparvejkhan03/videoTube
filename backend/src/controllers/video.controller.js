import User from "../models/user.model.js";
import Video from "../models/video.model.js";
import { apiError } from "../utils/apiError.js";
import { apiResponse } from "../utils/apiResponse.js";
import asyncHandler from "../utils/asyncHandler.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";

const uploadVideo = asyncHandler(async (req, res) => {
    const {title, description } = req.body;

    if(!title || !description){
        throw new apiError(400, 'Title and description are required.');
    }

    console.log(req.files);

    const localThumbnailPath = req.files?.thumbnail[0]?.path;

    const localVideoPath = req.files?.video[0]?.path;

    if(!localThumbnailPath){
        throw new apiError(400, 'Video Thumbnail is required or some error occured in multer.');
    }

    if(!localVideoPath){
        throw new apiError(400, 'Video file is required or some error occured in multer.');
    }

    const user = req.user;

    if(!user){
        throw new apiError(400, 'There was some error while assigning the user.');
    }

    const cloudinaryThumbnail = await uploadOnCloudinary(localThumbnailPath);

    const cloudinaryVideo = await uploadOnCloudinary(localVideoPath, "video");

    if(!cloudinaryVideo){
        throw new apiError(400, 'There was some error while uploading the video file on cloudinary.');
    }

    if(!cloudinaryThumbnail){
        throw new apiError(400, 'There was some error while uploading the video thumbnail on cloudinary.');
    }

    const videoData = await Video.create({
        title, thumbnail:cloudinaryThumbnail.secure_url, description, duration:cloudinaryVideo.duration, video:cloudinaryVideo.secure_url, owner:user._id
    })

    if(!videoData){
        throw new apiError(400, 'There was some error in uploading the video in database.');
    }

    res.status(200).json(new apiResponse(200, 'Video uploaded successfully.', videoData));
})

const getAllVideos = asyncHandler(async (req, res) => {
    const videos = await Video.find();

    if(!videos){
        throw new apiError(400, 'There was some error in fetching all the videos.');
    }

    res.status(200).json(new apiResponse(200, 'All videos received.', videos));
})

const updateVideo = asyncHandler(async (req, res) => {
    const {vid} = req.query;

    const userId = req.user._id;

    const {title, description} = req.body;

    if(!title || !description){
        throw new apiError(400, 'Title and description are required.');
    }

    if(!vid){
        throw new apiError(400, 'Video id is needed.');
    }

    const video = await Video.findOne({_id:vid, owner:userId});

    if(!video){
        throw new apiError(404, 'Could find the video or you are not authorized to edit the video.');
    }

    // console.log(video);

    video.title = title;
    video.description = description;

    await video.save({validateBefore:false});

    res.status(200).json(new apiResponse(200, 'Video updated.', video));
})

const deleteVideo = asyncHandler(async (req, res) => {
    const userId = req.user._id;

    if(!userId){
        throw new apiError(401, 'You are not authorized to delete the video.');
    }

    const {vid} = req.query;

    if(!vid){
        throw new apiError(400, 'Could not delete the video as no video was provided to delete.');
    }  
    
    const video = await Video.find({_id:vid, owner:userId});

    if(!video){
        throw new apiError(404, 'Could find the video or you are not authorized to delete this video.');
    }

    const videoDeleted = await Video.findByIdAndDelete(vid);

    if(!videoDeleted){
        throw new apiError(500, 'Some error occured while deleting the video.');
    }

    res.status(200).json(new apiResponse(200, 'Video deleted successfully.', videoDeleted));
})

export {uploadVideo, getAllVideos, updateVideo, deleteVideo}