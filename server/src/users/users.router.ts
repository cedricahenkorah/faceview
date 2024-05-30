import express from "express";
  sendFriendRequest,

const userRouter = express.Router();

userRouter.post("/", createUser);
userRouter.post("/send-friend-request/:id", sendFriendRequest);

export default userRouter;
