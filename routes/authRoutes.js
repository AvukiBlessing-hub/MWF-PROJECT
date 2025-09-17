const express = require("express");
const router = express.Router();
const passport = require("passport");
const UserModels = require("../models/userModels");
const stockModels = require("../models/stockModels")
//getting athe manager form
router.get("/manager", (req, res) => {
    res.render("manager", { title: "Manager Page" });
});

router.get("/manager", (req, res) => {
    const user = new UserModels(req.body);
    console.log(req.body);
    user.save();
    res.redirect("/login");
});

// GET: Show all users from MongoDB
router.get("/userlist", async (req, res) => {
  try {
    const users = await userModel.find().lean(); // query MongoDB
    res.render("userList", { user: users }); // pass users to Pug
  } catch (err) {
    console.error("Error fetching users:", err);
    res.status(500).send("Server error");
  }
});

router.post("/manager", async (req, res) => {
    try {
        const user = new UserModels(req.body);
        res.redirect("/login")
        let existingUser = await UserModels.findOne({ email: req.body.email });
        if (existingUser) {
            return res.status(400).send("User already exists")
        } else {
            await UserModels.register(user, req.body.password, (error) => {
                if (error) {
                    throw error;
                }
            })
        }
        console.log(req.body);
    } catch (error) {
        res.status(400).send("Something went wrong, please try again")
    }

})


router.get("/login", (req, res) => {
    res.render("login", { title: "login Page" });
});


router.post(
    "/login",
    passport.authenticate("local", { failureRedirect: "/login" }),
    (req, res) => {
        req.session.user = req.user;

        if (req.user.role === "manager") {
            return res.redirect("/dashboard");
        } else if (req.user.role === "Attendent") {
            res.redirect("/addsale")
        } else (res.render("nonUser"))
    });
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