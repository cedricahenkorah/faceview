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
