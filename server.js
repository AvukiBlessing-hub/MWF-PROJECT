require("dotenv").config();
const express = require("express");
const path = require("path");
const mongoose = require("mongoose");
const passport = require("passport");
const expressSession = require("express-session");
const MongoStore = require("connect-mongo");
const methodOverride = require("method-override");
const moment = require("moment");
const flash = require("connect-flash");

const authRoutes = require("./routes/authRoutes");
const stockRoutes = require("./routes/stockRoutes");
const salesRoutes = require("./routes/salesRoutes");
const deliveryRoutes = require("./routes/deliveryRoutes");
const dashboardRoutes = require("./routes/dashboardRoutes");
const userModel = require("./models/userModel");

const app = express();
const port = 5000;

// Make moment available in all templates
app.locals.moment = moment;

// Mongoose config
mongoose.connect(process.env.MONGODB_URI);
mongoose.connection
  .on("open", () => console.log("Mongoose connection open"))
  .on("error", (err) => console.log(`Connection error: ${err.message}`));

// View engine
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "pug");

// Middleware
app.use(express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));

// Session
app.use(
  expressSession({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({ mongoUrl: process.env.MONGODB_URI }),
    cookie: { maxAge: 24 * 60 * 60 * 1000 },
  })
);

// Flash messages
app.use(flash());

// Passport
app.use(passport.initialize());
app.use(passport.session());
passport.use(userModel.createStrategy());
passport.serializeUser(userModel.serializeUser());
passport.deserializeUser(userModel.deserializeUser());

// Make flash messages available in all templates
app.use((req, res, next) => {
  res.locals.error = req.flash("error");
  res.locals.success = req.flash("success");
  next();
});

// Debug middleware
app.use((req, res, next) => {
  console.log("Request URL:", req.url, "at", new Date().toISOString());
  next();
});

// ================= Mount Routes =================
app.use("/", authRoutes);      // /signup, /signin, etc.
app.use("/", stockRoutes);     // /stock, /stocklist, etc.
app.use("/", salesRoutes);     // /sales, /saleslist, /salesreceipt/:id, etc.
app.use("/", deliveryRoutes);  // /delivery, /deliverylist, etc.
app.use("/", dashboardRoutes); // /dashboard

// 404 handler (keep it last)
app.use((req, res) => {
  res.status(404).send("Oops! Route not found");
});

// Start server
app.listen(port, () => console.log(`Server running on http://localhost:${port}`));
