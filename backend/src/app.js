import express from 'express';
import 'dotenv/config';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import userRouter from './routes/user.route.js';
import { videoRouter } from './routes/video.route.js';
import { likeRouter } from './routes/like.route.js';
import { commentRouter } from './routes/comment.route.js';
import { tweetRouter } from './routes/tweet.router.js';
import { subscriptionRouter } from './routes/subscription.route.js';
import { playlistRouter } from './routes/playlist.route.js';

const app = express();

app.use(express.json({limit: '16kb'}));
app.use(express.static('public'));
app.use(express.urlencoded({extended:true, limit: '16kb'}));

app.use(cors({
    origin: process.env.CORS_ORIGIN,
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true
}));

app.use(cookieParser());

//Routes
app.use('/api/v1/users', userRouter);
app.use('/api/v1/videos', videoRouter);
app.use('/api/v1/likes', likeRouter);
app.use('/api/v1/comments', commentRouter);
app.use('/api/v1/tweets', tweetRouter);
app.use('/api/v1/subscriptions/:channel', subscriptionRouter);
app.use('/api/v1/playlists', playlistRouter);

export default app;