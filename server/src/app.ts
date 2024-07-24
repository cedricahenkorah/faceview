import express, { Request, Response } from "express";
import morgan from "morgan";
import userRouter from "./users/users.router";
import { corsOptions } from "./config/corsOptions";
import cors from "cors";
import authRouter from "./auth/auth.router";

const app = express();

app.use(cors(corsOptions));
app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", (req: Request, res: Response) => {
  res.send("faceview server is live");
});

app.use("/users", userRouter);
app.use("/auth", authRouter);

export default app;
