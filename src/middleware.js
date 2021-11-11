export const localsMiddleware = (req, res, next) => {
  console.log(res.locals);
  res.locals.loggedIn = Boolean(req.session.loggedIn);
  res.locals.loggendInUser = req.session.user;

  next();
};
