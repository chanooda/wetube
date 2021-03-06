import multer from "multer";
import multerS3 from "multer-s3";
import aws from "aws-sdk";

const s3 = new aws.S3({
  credentials: {
    accessKeyId: process.env.AWS_ID,
    secretAccessKey: process.env.AWS_SECRET,
  },
});

const heroku = process.env.NODE_ENV === "production";

const s3ImageUploader = multerS3({
  s3: s3,
  bucket: "wetube-chanooda/images",
  acl: "public-read",
});

const s3VideoUploader = multerS3({
  s3: s3,
  bucket: "wetube-chanooda/videos",
  acl: "public-read",
});

export const localsMiddleware = (req, res, next) => {
  res.locals.loggedIn = Boolean(req.session.loggedIn);
  res.locals.loggendInUser = req.session.user || {};
  res.locals.heroku = heroku;
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
  storage: heroku ? s3ImageUploader : undefined,
});
export const videoUploadFiles = multer({
  dest: "uploads/videos/",
  limits: { fileSize: 3000000000 },
  storage: heroku ? s3VideoUploader : undefined,
});
