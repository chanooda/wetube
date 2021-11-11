import bcrypt from "bcrypt";
import User from "../models/User";

export const getJoin = (req, res) => {
  res.render("join", { pageTitle: "Join" });
};
export const postJoin = async (req, res) => {
  const { name, username, email, password, password2, location } = req.body;
  if (password !== password2) {
    return res.status(400).render("join", {
      errorMessage: "Password confirmation does not match",
    });
  }
  const exists = await User.exists({ email });
  if (exists) {
    return res.status(400).render("join", {
      errorMessage: "This username or e-mai is already taken.",
    });
  }
  try {
    await User.create({
      name,
      username,
      email,
      password,
      location,
    });
    return res.redirect("/login");
  } catch (error) {
    return res
      .status(400)
      .render("join", { pageTitle: "Join", errorMessage: error.message });
  }
};
export const getLogin = (req, res) => {
  res.render("Login", { pageTitle: "Log in" });
};

export const postLogin = async (req, res) => {
  const { username, password } = req.body;
  const user = await User.findOne({ username });
  if (!user) {
    res.status(400).render("login", {
      pageTitle: "login",
      errorMessage: "An account with this username does not exists",
    });
  }
  const ok = await bcrypt.compare(password, user.password);
  if (!ok) {
    res.status(400).render("login", {
      pageTitle: "login",
      errorMessage: "Wrong Password",
    });
  }
  req.session.loggedIn = true;
  req.session.user = user;
  return res.redirect("/");
};

export const see = (req, res) => res.send("See User");
export const edit = (req, res) => res.send("Edit User");
export const logout = (req, res) => res.send("LogOut");
export const remove = (req, res) => res.send("Dlelete User");
