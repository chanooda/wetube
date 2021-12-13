import express from "express";
import {
  registerView,
  creatComment,
  DeleteComment,
} from "../controllers/videoController";

const apiRouter = express.Router();

apiRouter.post("/videos/:id([0-9a-f]{24})/view", registerView);
apiRouter.post("/videos/:id([0-9a-f]{24})/comment", creatComment);
apiRouter.delete("/comment/:id([0-9a-f]{24})", DeleteComment);

export default apiRouter;
