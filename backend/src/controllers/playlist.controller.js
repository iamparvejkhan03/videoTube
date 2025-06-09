import asyncHandler from "../utils/asyncHandler.js";
import { apiError } from "../utils/apiError.js";
import { apiResponse } from "../utils/apiResponse.js";
import { Playlist } from "../models/playlist.model.js";

const addInPlaylist = asyncHandler(async (req, res) => {
    const owner = req.user._id;
    const {vid} = req.params;
    const {pid} = req.query;

    if(!owner){
        throw new apiError(401, 'You need to login in order to create or add a video to a playlist.');
    }

    if(!pid){
        return await createPlaylist(req, res);
    }

    const playlist = await Playlist.findByIdAndUpdate(pid, {$push: {videos:vid}}, {new: true});

    if(!playlist){
        throw new apiError(500, 'Could not add to playlist.');
    }

    res.status(200).json(new apiResponse(200, 'Added to playlist.', playlist));
})

const createPlaylist = asyncHandler(async (req, res) => {
    const {name, description} = req.body;
    const owner = req.user._id;

    if(!owner){
        throw new apiError(401, 'You need to login in order to create a playlist.');
    }

    if(!name || !description){
        throw new apiError(400, 'Name and description are required to create a playlist.');
    }

    const playlist = await Playlist.create({
        name, description, videos:[], owner
    })

    if(!playlist){
        throw new apiError(500, 'Could not create the playlist.');
    }

    res.status(200).json(new apiResponse(200, 'Playlist created.', playlist));
})

const deletePlaylist = asyncHandler(async (req, res) => {
    const owner = req.user._id;
    const {vid} = req.params;

    if(!owner){
        throw new apiError(401, 'You need to login in order to add a video to a playlist.');
    }

    const playlist = await Playlist.findOneAndDelete({owner});

    if(!playlist){
        throw new apiError(500, 'Could not add to playlist.');
    }

    res.status(200).json(new apiResponse(200, 'Playlist deleted.', playlist));
})

export {addInPlaylist, deletePlaylist, createPlaylist}