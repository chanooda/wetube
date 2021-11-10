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
  await User.create({
    name,
    username,
    email,
    password,
    location,
  });
  return res.redirect("/login");
};
export const login = (req, res) => res.send("Login");

export const see = (req, res) => res.send("See User");
export const edit = (req, res) => res.send("Edit User");
export const logout = (req, res) => res.send("LogOut");
export const remove = (req, res) => res.send("Dlelete User");
