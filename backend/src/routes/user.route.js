import { Router } from "express"
import { getChannelProfileData, getCurrentUser, getUsersWatchHistory, loginUser, logOutUser, refreshAccessToken, registerUser, updateUserAvatar, updateUserCoverImage, updateUserDetails, updateUserPassword } from "../controllers/user.controller.js";
import {upload} from '../middlewares/multer.middleware.js';
import { verifyJWT } from "../middlewares/auth.middleware.js";

const userRouter = Router();

userRouter.post('/register', upload.fields([
    {name: 'avatar', maxCount:1},
    {name: 'coverImage', maxCount:1}
]), registerUser);

userRouter.post('/login', upload.none(), loginUser);

userRouter.post('/logout', verifyJWT, logOutUser);

userRouter.post('/refresh-token', refreshAccessToken);

userRouter.patch('/update-password', verifyJWT, updateUserPassword);

userRouter.patch('/update-user-details', verifyJWT, updateUserDetails);

userRouter.patch('/update-user-avatar', verifyJWT, upload.single('avatar'), updateUserAvatar);

userRouter.patch('/update-user-cover-image', verifyJWT, upload.single('coverImage'), updateUserCoverImage);

userRouter.get('/get-current-user', verifyJWT, getCurrentUser);

userRouter.get('/c/:username', verifyJWT, getChannelProfileData);

userRouter.get('/history', verifyJWT, getUsersWatchHistory);

export default userRouter;