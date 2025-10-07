const express = require("express");
const router = express.Router();
const passport = require("passport");
const UserModel = require("../models/userModel");

// Import middleware from auth.js
const { isAuthenticated, isManager } = require("../middleware/auth");

// Landing page
router.get("/", (req, res) => {
  res.render("index", { title: "MWF - Landing Page" });
});

// Manager-only signup page
router.get("/signup", isManager, (req, res) => {
  res.render("signup", { title: "Register User", user: req.user });
});

// POST /signup - Only Manager can register users
router.post("/signup", isManager, (req, res) => {
  const { fullname, email, role, password } = req.body;

  if (!email || !password || !role) {
    return res.status(400).send("All fields are required");
  }

  const newUser = new UserModel({ fullname, email, role });

  UserModel.register(newUser, password, (err, user) => {
    if (err) {
      console.error("Error registering user:", err);
      return res.status(500).send("Error registering user");
    }
    res.redirect("/userlist");
  });
});

// ===== SIGNIN =====
router.get("/signin", (req, res) => {
  res.render("signin", { title: "Login Page" });
});

router.post(
  "/signin",
  passport.authenticate("local", { failureRedirect: "/signin" }),
  (req, res) => {
    // Redirect based on role
    if (req.user.role === "Manager") return res.redirect("/stock");
    if (req.user.role === "Attendant") return res.redirect("/sales");
    return res.render("nonUser");
  }
);

// ===== LOGOUT =====
router.get("/logout", (req, res, next) => {
  req.logout(err => {
    if (err) return next(err);
    res.redirect("/signin");
  });
});

// ===== USER LIST =====
router.get("/userlist", isAuthenticated, async (req, res) => {
  try {
    const users = await UserModel.find().sort();
    res.render("userList", { title: "User Table", user: req.user, users });
  } catch (err) {
    console.error("Error fetching users:", err);
    res.status(500).send("Server error");
  }
});

// ===== EDIT USER =====
router.get("/edituser/:id", isManager, async (req, res) => {
  try {
    const foundUser = await UserModel.findById(req.params.id).lean();
    if (!foundUser) return res.status(404).send("User not found");
    res.render("editUser", { title: "Edit User", foundUser, user: req.user });
  } catch (err) {
    console.error("Error loading user:", err);
    res.status(500).send("Server error");
  }
});

router.post("/edituser/:id", isManager, async (req, res) => {
  try {
    const { fullname, email, role } = req.body;
    await UserModel.findByIdAndUpdate(req.params.id, { fullname, email, role });
    res.redirect("/userlist");
  } catch (err) {
    console.error("Error updating user:", err);
    res.status(500).send("Server error");
  }
});

// ===== DELETE USER =====
router.post("/deleteuser/:id", isManager, async (req, res) => {
  try {
    await UserModel.findByIdAndDelete(req.params.id);
    res.redirect("/userlist");
  } catch (err) {
    console.error("Error deleting user:", err);
    res.status(500).send("Server error");
  }
});

module.exports = router;
