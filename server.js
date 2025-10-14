require("dotenv").config();
const express = require("express");
const path = require("path");
const mongoose = require("mongoose");
const passport = require("passport");
const session = require("express-session");
const MongoStore = require("connect-mongo");
const methodOverride = require("method-override");
const moment = require("moment");
const flash = require("connect-flash");

const authRoutes = require("./routes/authRoutes");
const stockRoutes = require("./routes/stockRoutes");
const salesRoutes = require("./routes/salesRoutes");  // ✅ make sure file is named salesRoutes.js
const deliveryRoutes = require("./routes/deliveryRoutes");
const dashboardRoutes = require("./routes/dashboardRoutes");
const userModel = require("./models/userModel");

const app = express();
const PORT = process.env.PORT || 5000;

/* ------------------------------
    DATABASE CONNECTION
--------------------------------*/
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => console.log(" MongoDB connected"))
  .catch((err) => console.error(" MongoDB connection error:", err));

/* ------------------------------
    APP CONFIGURATION
--------------------------------*/
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "pug");

// Make moment globally available to templates
app.locals.moment = moment;

/* ------------------------------
    MIDDLEWARE
--------------------------------*/
app.use(express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(methodOverride("_method"));

// Session configuration
app.use(
  session({
    secret: process.env.SESSION_SECRET || "defaultsecret",
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({ mongoUrl: process.env.MONGODB_URI }),
    cookie: { maxAge: 24 * 60 * 60 * 1000 }, // 1 day
  })
);

// Flash messages
app.use(flash());

/* ------------------------------
    PASSPORT AUTHENTICATION
--------------------------------*/
app.use(passport.initialize());
app.use(passport.session());

passport.use(userModel.createStrategy());
passport.serializeUser(userModel.serializeUser());
passport.deserializeUser(userModel.deserializeUser());

/* ------------------------------
    GLOBAL VARIABLES (FLASH + USER)
--------------------------------*/
app.use((req, res, next) => {
  res.locals.currentUser = req.user || null;
  res.locals.error = req.flash("error");
  res.locals.success = req.flash("success");
  next();
});

/* ------------------------------
    DEBUG LOGGER
--------------------------------*/
app.use((req, res, next) => {
  console.log(`[${new Date().toLocaleTimeString()}] ${req.method} ${req.url}`);
  next();
});

/* ------------------------------
    ROUTES
--------------------------------*/
app.use("/", authRoutes);       // /login, /signup, /logout, etc.
app.use("/", stockRoutes);      // /stock, /stocklist, etc.
app.use("/", salesRoutes);      // /sales, /saleslist, /editsales/:id, /receipt/:id
app.use("/", deliveryRoutes);   // /delivery, /deliverylist, etc.
app.use("/", dashboardRoutes);  // /dashboard

/* ------------------------------
    404 HANDLER (KEEP LAST)
--------------------------------*/
app.use((req, res) => {
  res.status(404).send("Oops! Route not found");
});

/* ------------------------------
    START SERVER
--------------------------------*/
app.listen(PORT, () => {
  console.log(` Server running at http://localhost:${PORT}`);
});
