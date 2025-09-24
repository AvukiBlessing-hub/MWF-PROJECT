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

    if (!email || !password) {
        return res.status(400).send("Email and password are required");
    }

    const newUser = new UserModel({ fullname, email, role });

    // Use callback style for reliable redirect
    UserModel.register(newUser, password, (err, user) => {
        if (err) {
            console.error("Error registering user:", err.message);
            return res.status(500).send("Error registering user");
        }
        console.log("User registered:", email);
        res.redirect("/signin"); //  redirect works
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
        // Redirect based on role
        if (req.user.role === "manager") return res.redirect("/dashboard");
        if (req.user.role === "Attendant") return res.redirect("/addsale");
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
