import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { addInPlaylist, createPlaylist, deletePlaylist } from "../controllers/playlist.controller.js";

const playlistRouter = Router();

playlistRouter.post('/add-video/:vid', verifyJWT, addInPlaylist);

playlistRouter.post('/create', verifyJWT, createPlaylist);

playlistRouter.delete('/delete/:vid', verifyJWT, deletePlaylist);

export {playlistRouter}