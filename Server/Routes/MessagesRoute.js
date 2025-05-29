import express from "express"
import { protectRoute } from "../middleware/auth.js";
import { deleteMessage, getMessages, getUsersforSideBar, markMessageAsSeen, sendMessage } from "../controllers/MessageController.js";

import mongoose from "mongoose";
import Message from "../models/Message.js";

const messageRouter=express.Router();


messageRouter.get("/users",protectRoute,getUsersforSideBar);
messageRouter.get("/:id",protectRoute,getMessages);
messageRouter.put("/mark/:id",protectRoute,markMessageAsSeen);
messageRouter.post("/send/:id",protectRoute,sendMessage);
// DELETE /api/messages/:id
messageRouter.delete("/:id", deleteMessage);

export default messageRouter;