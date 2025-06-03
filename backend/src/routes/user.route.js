import { Router } from "express"
import { registerUser } from "../controllers/user.controller.js";

const userRouter = Router();

userRouter.get('/', registerUser);

export default userRouter;