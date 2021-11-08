let videos = [
  {
    title: "First video",
    rating: 4,
    views: 1,
    upload: "2 minutes ago",
    comments: 23,
    id: 1,
  },
  {
    title: "Second video",
    rating: 1,
    views: 123213123,
    upload: "24 minutes ago",
    comments: 2123,
    id: 2,
  },
  {
    title: "Third video",
    rating: 3,
    views: 123213123,
    upload: "24 minutes ago",
    comments: 2123,
    id: 3,
  },
];

export const trending = (req, res) =>
  res.render("home", { pageTitle: "Home", videos });
export const search = (req, res) => res.send("Search Video");
export const watch = (req, res) => {
  const { id } = req.params;
  const video = videos[id - 1];
  return res.render("watch", { pageTitle: `Watching: ${video.title}`, video });
};
export const getEdit = (req, res) => {
  const { id } = req.params;
  const video = videos[id - 1];
  return res.render("edit", { pageTitle: `Editing: ${video.title}`, video });
};

export const postEdit = (req, res) => {
  const { id } = req.params;
  const { title } = req.body;
  videos[id - 1].title = title;
  return res.redirect(`/videos/${id}`);
};

export const getUpload = (req, res) => {
  return res.render("upload", { pageTitle: "Upload Video" });
};
export const postUpload = (req, res) => {
  return res.render("/");
};
