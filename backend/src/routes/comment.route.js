import {Router} from 'express';
import { verifyJWT } from '../middlewares/auth.middleware.js';
import { addComment, allCommentsOfChannel, deleteComment, editComment } from '../controllers/comment.controller.js';

const commentRouter = Router();

commentRouter.post('/add', verifyJWT, addComment);

commentRouter.delete('/delete', verifyJWT, deleteComment);

commentRouter.patch('/edit', verifyJWT, editComment);

commentRouter.get('/', allCommentsOfChannel);

export {commentRouter}