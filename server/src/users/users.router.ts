import express from "express";
import {
  acceptFriendRequest,
  createUser,
  sendFriendRequest,
} from "./users.controller";

const userRouter = express.Router();

userRouter.post("/", createUser);
userRouter.post("/send-friend-request/:id", sendFriendRequest);
userRouter.post("/accept-friend-request/:id", acceptFriendRequest);

export default userRouter;
