import Video, { formatHashtags } from "../models/Video";

export const home = async (req, res) => {
  const videos = await Video.find({});
  return res.render("home", { pageTitle: "Home", videos });
};

export const search = (req, res) => {
  return res.send("Search Video");
};

export const watch = async (req, res) => {
  const { id } = req.params;
  const video = await Video.findById(id);
  if (video) {
    return res.render("watch", { pageTitle: video.title, video });
  } else {
    return res.render("404", { pageTitle: "Page not found." });
  }
};

export const getEdit = async (req, res) => {
  const { id } = req.params;
  const video = await Video.findById(id);
  if (!video) {
    return res.render("404", { pageTitle: "Page not found." });
  }
  return res.render("edit", { pageTitle: `Edit: ${video.title}`, video });
};

export const getUpload = (req, res) => {
  return res.render("upload", { pageTitle: "Upload Video" });
};

export const postEdit = async (req, res) => {
  const { id } = req.params;
  const video = await Video.exists({ id: id });
  const { title, description, hashtags } = req.body;
  if (!video) {
    return res.render("404", { pageTitle: "Page not found." });
  }
  try {
    await Video.findByIdAndUpdate(id, {
      title,
      description,
      hashtags: Video.formatHashtags(hashtags),
    });
  } catch (error) {
    console.log(error);
  }
  return res.redirect(`/videos/${id}`);
};

export const postUpload = async (req, res) => {
  const { title, description, hashtags } = req.body;

  try {
    await Video.create({
      title,
      description,
      hashtags: Video.formatHashtags(hashtags),
    });
  } catch (error) {
    console.log(error);
  }

  return res.redirect("/");
};
