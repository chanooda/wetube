import express from "express";
import {
  logout,
  getEdit,
  postEdit,
  see,
  startGithubLogin,
  finishGithubLogin,
} from "../controllers/userController";
import { protecterMiddleware, publicOnlyMiddleware } from "../middleware";

const userRouter = express.Router();

userRouter.route("/edit").all(protecterMiddleware).get(getEdit).post(postEdit);
userRouter.get("/logout", logout);
userRouter.get("/github/start", publicOnlyMiddleware, startGithubLogin);
userRouter.get("/github/finish", publicOnlyMiddleware, finishGithubLogin);
userRouter.get(":id", see);

export default userRouter;
