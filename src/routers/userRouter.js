import express from "express";
import {
  logout,
  getEdit,
  postEdit,
  see,
  startGithubLogin,
  finishGithubLogin,
  getChangePassword,
  postChangePassword,
} from "../controllers/userController";
import {
  protecterMiddleware,
  publicOnlyMiddleware,
  avatarUploadFiles,
} from "../middleware";

const userRouter = express.Router();

userRouter
  .route("/edit")
  .all(protecterMiddleware)
  .get(getEdit)
  .post(avatarUploadFiles.single("avatar"), postEdit);
userRouter
  .route("/change-password")
  .get(getChangePassword)
  .post(postChangePassword);
userRouter.get("/logout", logout);
userRouter.get("/github/start", publicOnlyMiddleware, startGithubLogin);
userRouter.get("/github/finish", publicOnlyMiddleware, finishGithubLogin);
userRouter.get("/:id", see);

export default userRouter;
