const express = require("express");
const router = express.Router();
const passport = require("passport");
const UserModel = require("../models/userModel");
const { isAuthenticated, isManager } = require("../middleware/auth");

// ================= Landing Page =================
router.get("/", (req, res) => {
  res.render("index", { title: "MWF - Landing Page" });
});

// ================= Signup (Manager Only) =================
router.get("/signup", isManager, (req, res) => {
  res.render("signup", { title: "Register User", user: req.user });
});

router.post("/signup", isManager, (req, res) => {
  const { fullname, email, role, password } = req.body;

  if (!email || !password || !role) {
    return res.status(400).send("All fields are required");
  }

  const newUser = new UserModel({ fullname, email, role });

  UserModel.register(newUser, password, (err) => {
    if (err) {
      console.error("Error registering user:", err);
      return res.status(500).send("Error registering user");
    }
    res.redirect("/userlist");
  });
});

// ================= Sign In =================
router.get("/signin", (req, res) => {
  res.render("signin", { title: "Login Page" });
});

router.post("/signin", (req, res, next) => {
  passport.authenticate("local", (err, user, info) => {
    if (err) return next(err);
    if (!user) return res.redirect("/signin");

    // ✅ Proper session handling
    req.logIn(user, (err) => {
      if (err) return next(err);

      // ✅ Redirect based on role
      if (user.role === "Manager") return res.redirect("/stocklist");
      if (user.role === "Attendant") return res.redirect("/saleslist");
      return res.render("nonUser");
    });
  })(req, res, next);
});

// ================= Logout =================
router.get("/logout", (req, res, next) => {
  req.logout(function (err) {
    if (err) return next(err);

    // ✅ Completely destroy the session
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
