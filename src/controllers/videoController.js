import Video, { formatHashtags } from "../models/Video";
import User from "../models/User";
//import { createFFmpeg, fetchFile } from "@ffmpeg/ffmpeg";
//import { Blob } from "node:buffer";
import Comment from "../models/Comment";
import { async } from "regenerator-runtime";

var fs = require("fs");
var request = require("request");

export const home = async (req, res) => {
  const videos = await Video.find()
    .sort({ createdAt: "desc" })
    .populate("owner");
  return res.render("home", { pageTitle: "Home", videos });
};
export const search = async (req, res) => {
  const { keyword } = req.query;
  let videos = [];
  if (keyword) {
    videos = await Video.find({
      title: { $regex: new RegExp(keyword, "i") },
      hashtags: { $regex: new RegExp(keyword, "i") },
    }).populate("owner");
  }
  return res.render("search", { pageTitle: "Search", videos });
};
export const watch = async (req, res) => {
  const { id } = req.params;
  const video = await Video.findById(id)
    .populate("owner")
    .populate([
      {
        path: "comments",
        model: "Comment",
        populate: {
          path: "owner",
          model: "User",
        },
      },
    ]);

  if (!video) {
    return res.status(404).render("404", { pageTitle: "Page not found." });
  } else {
    return res.render("watch", { pageTitle: video.title, video });
  }
};

export const getEdit = async (req, res) => {
  const { id } = req.params;
  const {
    user: { _id },
  } = req.session;
  const video = await Video.findById(id);
  if (!video) {
    return res.status(404).render("404", { pageTitle: "Page not found." });
  }
  if (String(video.owner) !== String(_id)) {
    req.flash("error", "Not authorized");
    return res.status(403).redirect("/");
  }
  return res.render("edit", { pageTitle: `Edit: ${video.title}`, video });
};
export const postEdit = async (req, res) => {
  const { id } = req.params;
  const {
    user: { _id },
  } = req.session;
  const video = await Video.findById(id);
  const { title, description, hashtags } = req.body;
  if (!video) {
    return res.render("404", { pageTitle: "Page not found." });
  }
  if (String(video.owner) !== String(_id)) {
    req.flash("error", "Not authorized");
    return res.status(403).redirect("/");
  }
  try {
    await Video.findByIdAndUpdate(id, {
      title,
      description,
      hashtags: Video.formatHashtags(hashtags),
    });
  } catch (error) {
    console.log(error);
    req.flash("error", "Not authorized");
    return res.status(403).redirect("edit");
  }
  return res.redirect(`/videos/${id}`);
};

export const getUpload = (req, res) => {
  return res.render("upload", { pageTitle: "Upload Video" });
};
export const postUpload = async (req, res) => {
  const {
    user: { _id },
  } = req.session;
  const { video, thumb } = req.files;
  const { title, description, hashtags } = req.body;

  // if (!thumb) {
  //   // const ffmpeg = createFFmpeg({
  //   //   log: true,
  //   // });

  //   // await ffmpeg.load();

  //   // ffmpeg.FS(
  //   //   "writeFile",
  //   //   `${video[0].path}.mp4`,
  //   //   await fetchFile(video[0].path)
  //   // );

  //   // await ffmpeg.run(
  //   //   "-i",
  //   //   `${video[0].path}.mp4`,
  //   //   "-ss",
  //   //   "00:00:01",
  //   //   "-frames:v",
  //   //   "1",
  //   //   "thumbnail.jpg"
  //   // );

  //   // const thumbFile = ffmpeg.FS("readFile", "thumbnail.jpg");
  //   // const thumbBlob = new Blob([thumbFile.buffer], { type: "image/jpg" });
  //   // thumbUrl = URL.createObjectURL(thumbBlob);

  //   // console.log("asddddddddddd", thumbUrl);
  //   // var requestOptions = { method: "GET", uri: thumbUrl };
  //   // request(requestOptions).pipe(fs.createWriteStream("sample.jpg"));
  // }

  try {
    const newVideo = await Video.create({
      title,
      fileUrl: video[0].location,
      thumbUrl: thumb ? thumb[0].location.replace(/[\\]/g, "/") : " ",
      owner: _id,
      description,
      hashtags: hashtags === "" ? [] : Video.formatHashtags(hashtags),
    });
    const user = await User.findById(_id);

    user.videos.push(newVideo._id);
    user.save();

    return res.redirect("/");
  } catch (error) {
    return res
      .status(400)
      .render("upload", { pageTitle: "Upload", errorMessage: error.message });
  }
};

export const registerView = async (req, res) => {
  const { id } = req.params;
  const video = await Video.findById(id);
  if (!video) {
    return res.sendStatus(404);
  }
  video.meta.views = video.meta.views + 1;
  await video.save();
  return res.sendStatus(200);
};

export const creatComment = async (req, res) => {
  const {
    params: { id },
    body: { text },
    session: { user },
  } = req;

  const video = await Video.findById(id);
  const userModel = await User.findById(user._id);
  if (!video || !userModel) {
    return res.sendStatus(404);
  }
  const comment = await Comment.create({
    text,
    owner: user._id,
    video: id,
  });
  video.comments.push(comment._id);
  userModel.comments.push(comment._id);
  video.save();
  userModel.save();
  return res.status(201).json({ newCommentId: comment._id });
};
export const DeleteComment = async (req, res) => {
  const {
    params: { id },
    body: { videoId },
    session: { user },
  } = req;
  const comment = await Comment.findById(id);
  const video = await Video.findById(videoId);
  const userModel = await User.findById(user._id);
  console.log(comment, video, userModel);
  if (!video) {
    res.status(404).render("404", { pageTitle: "Video not found." });
  }
  if (String(comment.owner) !== String(user._id)) {
    req.flash("error", "Not You are not the owner of the comment");
    return res.status(403).redirect("/");
  }
  userModel.comments.splice(user.videos.indexOf(id), 1);
  video.comments.splice(user.videos.indexOf(id), 1);
  userModel.save();
  video.save();
  await Comment.findByIdAndDelete(id);
  return res.status(200).json({ CommentId: comment._id });
};
export const deleteVideo = async (req, res) => {
  const { id } = req.params;
  const {
    user: { _id },
  } = req.session;
  const video = await Video.findById(id);
  const user = await User.findById(video.owner);
  let qweasd;
  const commentList = video.comments;
  if (!video) {
    res.status(404).render("404", { pageTitle: "Video not found." });
  }
  if (String(video.owner) !== String(_id)) {
    req.flash("error", "Not You are not the owner of the video");
    return res.status(403).redirect("/");
  }
  await user.videos.splice(user.videos.indexOf(id), 1);

  await User.findByIdAndUpdate(video.owner, {
    videos: user.videos,
  });

  await Video.findByIdAndDelete(id);
  for (const el of commentList) {
    console.log("eleleleleleleleleelelelelel", el);
    qweasd = await User.findOne({ comments: el });
    console.log("1111111111111111111111", qweasd);
    await qweasd.comments.splice(qweasd.comments.indexOf(el), 1);
    const qwe = await User.findByIdAndUpdate(qweasd._id, {
      comments: qweasd.comments,
    });
    console.log("2222222222222222222222", qwe);
    console.log("3333333333333333333333", qweasd);
    await Comment.findOneAndDelete(el);
  }

  res.redirect("/");
};
