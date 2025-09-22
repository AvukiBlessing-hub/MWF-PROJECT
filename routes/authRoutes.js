const express = require("express");
const router = express.Router();
const passport = require("passport");
const UserModel = require("../models/userModel");
const stockModel = require("../models/stockModel");

//getting athe manager form
router.get("/signup", (req, res) => {
    res.render("signup", { title: "signup Page" });
});

// GET: Show all users from MongoDB
router.get("/userlist", async (req, res) => {
    try {
        const users = await UserModel.find().lean(); // fixed typo UserModelserModel -> UserModel
        res.render("userList", { user: users }); // pass users to Pug
    } catch (err) {
        console.error("Error fetching users:", err);
        res.status(500).send("Server error");
    }
});

router.post("/signup", async (req, res) => {
    try {
        let existingUser = await UserModel.findOne({ email: req.body.email });
        if (existingUser) {
            return res.status(400).send("User already exists")
        } else {
            const user = new UserModel(req.body);
            await UserModel.register(user, req.body.password, (error) => {
                if (error) {
                    throw error;
                }
                console.log(req.body);
                return res.redirect("/signin"); //  redirect only after successful registration
            })
        }
    } catch (error) {
        res.status(400).send("Something went wrong, please try again")
    }
})

router.get("/signin", (req, res) => {
    res.render("signin", { title: "signin Page" });
});

// router.post(
//     "/signin",
//     passport.authenticate("local", { failureRedirect: "/signin" }),
//     (req, res) => {
//         req.session.user = req.user;

//         if (req.user.role === "manager") {
//             return res.redirect("/dashboard");
//         } else if (req.user.role === "Attendent") {
//             res.redirect("/addsale")
//         } else (res.render("nonUser"))
//     });

router.get("/layout", (req, res) => {
    if (req.session) {
        req.session.destroy((error) => {
            if (error) {
                return res.status(500).send("Error loggingout")
            }
            res.redirect("/")
        })
    }
});
//   router.post("/layout", (req,res)=>{
//     req.logout((error)
// )
//   }
// )
module.exports = router;
