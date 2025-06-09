import asyncHandler from "../utils/asyncHandler.js";
import { apiError } from "../utils/apiError.js";
import { apiResponse } from "../utils/apiResponse.js";
import { Subscription } from "../models/subscription.model.js";

const subscribe = asyncHandler(async (req, res) => {
    const subscriber = req.user._id;
    const {channel} = req.params;

    if(!subscriber){
        throw new apiError(401, 'You need to login in order to subscribe.');
    }

    const subscribe = await Subscription.create({
        subscriber,
        channel
    })

    if(!subscribe){
        throw new apiError(500, 'Could not subscribe.');
    }

    res.status(200).json(new apiResponse(200, 'Subscription added.', subscribe));
})

const unsubscribe = asyncHandler(async (req, res) => {
    const subscriber = req.user._id;
    const {channel} = req.params;

    if(!subscriber){
        throw new apiError(401, 'You need to login in order to subscribe.');
    }

    const unsubscribe = await Subscription.findOneAndDelete({subscriber, channel});

    if(!unsubscribe){
        throw new apiError(401, 'Some error occured while unsubscribing.');
    }

    res.status(200).json(new apiResponse(200, 'Unsubscribed.', unsubscribe));
})

export {subscribe, unsubscribe}