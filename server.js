require("dotenv").config();
const express = require("express");
const path = require("path");
const mongoose = require("mongoose");
const passport = require("passport");
const expressSession = require("express-session");
const MongoStore = require("connect-mongo");
const methodOverride = require("method-override");
const moment = require("moment");

// import routes
const authRoutes = require("./routes/authRoutes");
const stockRoutes = require("./routes/stockRoutes");
const salesRoutes = require("./routes/salesRoutes");
const deliveryRoutes = require("./routes/deliveryRoutes");
const userModel = require("./models/userModel");

const app = express();
const port = 5000;

// Mongoose config
app.locals.moment = moment;
mongoose.connect(process.env.MONGODB_URI);
mongoose.connection
  .on("open", () => console.log("Mongoose connection open"))
  .on("error", (err) => console.log(`Connection error: ${err.message}`));

// View engine
app.set("view engine", "pug");
app.set("views", path.join(__dirname, "views"));

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

// Passport
app.use(passport.initialize());
app.use(passport.session());
passport.use(userModel.createStrategy());
passport.serializeUser(userModel.serializeUser());
passport.deserializeUser(userModel.deserializeUser());

app.use((req, res, next) => {
  console.log("A new request received at " + Date.now());
  next();
});

// Routes
app.use("/", authRoutes);
app.use("/", stockRoutes);     
app.use("/", salesRoutes);
app.use("/", deliveryRoutes);
// 404
app.use((req, res) => {
  res.status(404).send("Oops! Route not found");
});

// Start server
app.listen(port, () => console.log(`listening on port ${port}`));
