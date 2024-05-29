import express, { Request, Response } from "express";
import morgan from "morgan";
import userRouter from "./users/users.router";
import { corsOptions } from "./config/corsOptions";
import cors from "cors";

const app = express();

app.use(cors(corsOptions));
app.use(morgan("dev"));

app.get("/", (req: Request, res: Response) => {
  res.send("faceview server is live");
});
app.use("/users", userRouter);

export default app;
