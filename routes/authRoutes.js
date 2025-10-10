const express = require("express");
const router = express.Router();
const passport = require("passport");
const UserModel = require("../models/userModel");
const { isAuthenticated, isManager } = require("../middleware/auth");
const flash = require("connect-flash");

// ================= Landing Page =================
router.get("/", (req, res) => {
  res.render("index", { title: "MWF - Landing Page" });
});

// ================= Signup (Manager Only) =================
router.get("/signup", isManager, (req, res) => {
  res.render("signup", { title: "Register User", user: req.user });
});

router.post("/signup", isManager, async (req, res) => {
  const { fullname, email, role, password } = req.body;

  if (!email || !password || !role) {
    return res.status(400).send("All fields are required");
  }

  try {
    const newUser = new UserModel({ fullname, email, role });
    await UserModel.register(newUser, password);
    res.redirect("/userlist");
  } catch (err) {
    console.error("Error registering user:", err);
    res.status(500).send("Error registering user");
  }
});

// ================= Sign In =================

// GET login page
router.get("/signin", (req, res) => {
  res.render("signin", {
    title: "Login Page",
    error: req.flash("error"),
  });
});

// POST login
router.post("/signin", (req, res, next) => {
  passport.authenticate("local", (err, user, info) => {
    if (err) return next(err);

    if (!user) {
      req.flash("error", info?.message || "Invalid email or password");
      return res.redirect("/signin");
    }

    req.logIn(user, (err) => {
      if (err) return next(err);

      //  DEBUG: check user role
      console.log("Logged in user:", user);

      // Redirect based on role
      if (user.role === "Manager") return res.redirect("/dashboard");
      if (user.role === "Attendant") return res.redirect("/sales");

      return res.render("nonUser", { title: "Access Denied" });
    });
  })(req, res, next);
});


// ================= Logout =================
router.get("/logout", (req, res, next) => {
  req.logout(function (err) {
    if (err) return next(err);

    req.session.destroy(() => {
      res.clearCookie("connect.sid");
      res.redirect("/signin");
    });
  });
});

// ================= User List =================
router.get("/userlist", isAuthenticated, async (req, res) => {
  try {
    const users = await UserModel.find().sort();
    res.render("userList", { title: "User Table", user: req.user, users });
  } catch (err) {
    console.error("Error fetching users:", err);
    res.status(500).send("Server error");
  }
});

// ================= Edit User =================
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

// ================= Delete User =================
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
