import express from "express";
import { login } from "./auth.controller";

const authRouter = express.Router();

authRouter.post("/", login);

export default authRouter;
