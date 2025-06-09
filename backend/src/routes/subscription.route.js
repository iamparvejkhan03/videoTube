import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { subscribe, unsubscribe } from "../controllers/subscription.controller.js";

const subscriptionRouter = Router();

subscriptionRouter.post('/subscribe', verifyJWT, subscribe);

subscriptionRouter.delete('/unsubscribe', verifyJWT, unsubscribe);

export {subscriptionRouter}