import {Router} from 'express';
import { verifyJWT } from '../middlewares/auth.middleware.js';
import { deleteLikeVideo, likeVideo } from '../controllers/like.controller.js';

const likeRouter = Router();

likeRouter.post('/video', verifyJWT, likeVideo);

likeRouter.delete('/delete', verifyJWT, deleteLikeVideo);

export {likeRouter}