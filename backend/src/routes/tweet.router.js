import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { addTweet, allTweetsOfChannel, deleteTweet, editTweet } from "../controllers/tweet.controller.js";

const tweetRouter = Router();

tweetRouter.post('/add', verifyJWT, addTweet);

tweetRouter.delete('/delete', verifyJWT, deleteTweet);

tweetRouter.patch('/edit', verifyJWT, editTweet);

tweetRouter.get('/', allTweetsOfChannel);

export {tweetRouter}