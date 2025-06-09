import {Router} from 'express';
import { verifyJWT } from '../middlewares/auth.middleware.js';
import { deleteVideo, getAllVideos, updateVideo, uploadVideo } from '../controllers/video.controller.js';
import { upload } from '../middlewares/multer.middleware.js';

const videoRouter = Router();

videoRouter.post('/upload', verifyJWT, upload.fields([{name:'thumbnail', maxCount:1}, {name:'video', maxCount:1}]), uploadVideo);

videoRouter.get('/', getAllVideos);

videoRouter.patch('/edit', verifyJWT, updateVideo);

videoRouter.delete('/delete', verifyJWT, deleteVideo);

export {videoRouter}