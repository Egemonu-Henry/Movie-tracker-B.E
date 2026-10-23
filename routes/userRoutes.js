import express from "express";
import { loginUser, registerUser, getMe } from "../controllers/userController.js";
import {protect} from '../middleware/auth.js';

const userRouter = express.Router();

userRouter.post('/register', registerUser)
userRouter.post('/login', loginUser)
userRouter.get("/me", protect, getMe);

export default userRouter