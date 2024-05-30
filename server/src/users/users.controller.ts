import User from "./users.model";
import mongoose from "mongoose";
import { Request, Response } from "express";
import bcrypt from "bcrypt";

export async function createUser(req: Request, res: Response) {
  const { username, email, password } = req.body;

  if (!username || !email || !password)
    return res
      .status(400)
      .json({ message: "Please provide all required fields" });

  try {
    const usernameExists = await User.findOne({ username }).lean().exec();

    if (usernameExists)
      return res.status(409).json({ message: "This username already exists" });

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = await User.create({
      username,
      email,
      password: hashedPassword,
    });

    if (user)
      return res
        .status(200)
        .json({ user, message: "You have successfullly created your account" });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
}
export async function sendFriendRequest(req: Request, res: Response) {
  const { id } = req.params;
  const { username } = req.body;

  if (!mongoose.Types.ObjectId.isValid(id))
    return res.status(400).json({ message: "Invalid user ID" });

  if (!username)
    return res.status(400).json({ message: "Username has not been provided" });

  try {
    const friendExists = await User.findOne({
      username,
      friends: { $in: [id] },
    });

    let userId = friendExists?._id;

    if (friendExists)
      return res.status(409).json({ message: "This user is already a friend" });

    const friendRequestExists = await User.findOne({
      username,
      friendRequestsSent: { $in: [id] },
    });

    if (friendRequestExists)
      return res
        .status(409)
        .json({ message: "This user has already been sent a friend request" });

    const friendRequestExistsB = await User.findOne({
      _id: userId,
      friendRequestsSent: { $in: [userId] },
    });

    if (friendRequestExistsB)
      return res
        .status(409)
        .json({ message: "This user has already sent you a friend request" });

    const userA = await User.findOneAndUpdate(
      { username },
      { $push: { friendRequestsSent: id } },
      { new: true }
    );

    const userB = await User.findByIdAndUpdate(
      id,
      {
        $push: { friendRequestsReceived: userA?._id },
      },
      { new: true }
    );

    if (!userA || !userB)
      return res
        .status(400)
        .json({ message: "Failed to add this user as a friend" });

    return res.status(200).json({
      userA,
      message: "You successfully added this user as your friend",
    });
  } catch (error) {
    return res.status(500).json({ message: "Internal Server Error" });
  }
}
