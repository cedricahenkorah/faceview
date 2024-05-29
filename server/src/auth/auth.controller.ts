import { Request, Response } from "express";
import User from "../users/users.model";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export async function login(req: Request, res: Response) {
  const { username, password } = req.body;
  const secretKey = process.env.ACCESS_TOKEN_SECRET;

  if (!secretKey) {
    throw new Error("ACCESS_TOKEN_SECRET is not defined");
  }

  if (!username || !password)
    return res
      .status(400)
      .json({ message: "Please provide all required fields" });

  const user = await User.findOne({ username });

  if (!user) return res.status(401).json({ message: "Unauthorized access" });

  const match = await bcrypt.compare(password, user.password);

  if (!match) return res.status(401).json({ message: "Unauthorized access" });

  const accessToken = jwt.sign(
    { userInfo: { username: user.username, email: user.email } },
    secretKey,
    { expiresIn: "1d" }
  );

  res.cookie("jwt", accessToken, {
    httpOnly: true,
    secure: true,
    sameSite: "none",
    maxAge: 1 * 24 * 60 * 60 * 1000,
  });

  return res.status(200).json({
    accessToken,
    user: {
      id: user._id,
      email: user.email,
      username: user.username,
    },
  });
}
