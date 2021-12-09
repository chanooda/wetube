import multer from "multer";

export const localsMiddleware = (req, res, next) => {
  res.locals.loggedIn = Boolean(req.session.loggedIn);
  res.locals.loggendInUser = req.session.user || {};
  next();
};

export const protecterMiddleware = (req, res, next) => {
  if (req.session.loggedIn) {
    return next();
  } else {
    req.flash("error", "Log in please");
    return res.redirect("/login");
  }
};

export const publicOnlyMiddleware = (req, res, next) => {
  if (!req.session.loggedIn) {
    return next();
  } else {
    req.flash("error", "Not authorized");
    return res.redirect("/");
  }
};

export const avatarUploadFiles = multer({
  dest: "uploads/avatars/",
  limits: { fileSize: 3000000 },
});
export const videoUploadFiles = multer({
  dest: "uploads/videos/",
  limits: { fileSize: 3000000000 },
});
