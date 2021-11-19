export const localsMiddleware = (req, res, next) => {
  console.log(res.locals);
  res.locals.loggedIn = Boolean(req.session.loggedIn);
  res.locals.loggendInUser = req.session.user || {};

  next();
};

export const protecterMiddleware = (req, res, next) => {
  if (req.session.loggedIn) {
    return next();
  } else {
    return res.redirect("/login");
  }
};

export const publicOnlyMiddleware = (req, res, next) => {
  if (!req.session.loggedIn) {
    return next();
  } else {
    return res.redirect("/");
  }
};
