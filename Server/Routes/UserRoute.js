import express from "express";
import { checkAuth, login, signup, updateProfile } from "../controllers/UserController.js";
import { protectRoute } from "../middleware/auth.js";
const userrouter=express.Router();

userrouter.post("/signup",signup)
userrouter.post("/login",login)
userrouter.put("/update-profile",protectRoute,updateProfile);
userrouter.get("/check",protectRoute,checkAuth);
 

export default userrouter