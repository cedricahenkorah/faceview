import express, { Request, Response } from "express";
import morgan from "morgan";
import { corsOptions } from "./config/corsOptions";
import cors from "cors";

const app = express();

app.use(cors(corsOptions));
app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", (req: Request, res: Response) => {
  res.send("faceview server is live");
});

export default app;
