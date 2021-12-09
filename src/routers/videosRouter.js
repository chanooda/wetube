import express from "express";

import {
  watch,
  getEdit,
  deleteVideo,
  postEdit,
  getUpload,
  postUpload,
} from "../controllers/videoController";
import { protecterMiddleware, videoUploadFiles } from "../middleware";

const videoRouter = express.Router();

videoRouter.get("/:id([0-9a-f]{24})", watch);
videoRouter
  .route("/:id([0-9a-f]{24})/delete")
  .all(protecterMiddleware)
  .get(deleteVideo);
videoRouter
  .route("/:id([0-9a-f]{24})/edit")
  .all(protecterMiddleware)
  .get(getEdit)
  .post(postEdit);
videoRouter
  .route("/upload")
  .all(protecterMiddleware)
  .get(getUpload)
  .post(
    videoUploadFiles.fields([
      { name: "video", maxCount: 1 },
      { name: "thumb", maxCount: 1 },
    ]),
    postUpload
  );

export default videoRouter;
