const express = require("express");
const router = express.Router();
const passport = require("passport");
const UserModel = require("../models/userModel");

// GET /signup - render signup page
router.get("/signup", (req, res) => {
    res.render("signup", { title: "Sign Up Page" });
});

// POST /signup - register new user
router.post("/signup", (req, res) => {
  const { fullname, email, role, password } = req.body;
  console.log( "signup request body:", req.body); // Debug

  if (!email || !password || !role) {
    return res.status(400).send("All fields are required");
  }
   const newUser = new UserModel({ fullname, email, role });

  UserModel.register(newUser, password, (err, user) => {
    if (err) {
      console.error("Error registering user:", err);
      return res.status(500).send("Error registering user");
    }
    console.log("User registered:", email);
    res.redirect("/signin");
  });
});

// GET /signin - render login page
router.get("/signin", (req, res) => {
    res.render("signin", { title: "Login Page" });
});

// POST /signin - login user
router.post(
    "/signin",
    passport.authenticate("local", { failureRedirect: "/signin" }),
    (req, res) => {
        console.log("Logged-in user role:", `"${req.user.role}"`);
        // Redirect based on role
        if (req.user.role === "Manager") return res.redirect("/stock");
        if (req.user.role === "Attendant") return res.redirect("/sales");
        return res.render("nonUser");
    }
);

// GET /logout - log out user
router.get("/logout", (req, res, next) => {
    req.logout(err => {
        if (err) return next(err);
        res.redirect("/signin");
    });
});

// GET /userlist - show all users
router.get("/userlist", async (req, res) => {
    try {
        const users = await UserModel.find().lean();
        res.render("userList", { user: users });
    } catch (err) {
        console.error("Error fetching users:", err);
        res.status(500).send("Server error");
    }
});

module.exports = router;
