require("dotenv").config();
const express = require("express");
const path = require("path");
const mongoose = require("mongoose");
const passport = require("passport");
const expressSession = require("express-session");
const MongoStore = require("connect-mongo");
const methodOverride = require("method-override");
const moment = require("moment");

// Import routes
const authRoutes = require("./routes/authRoutes");
const stockRoutes = require("./routes/stockRoutes");
const salesRoutes = require("./routes/salesRoutes");
const deliveryRoutes = require("./routes/deliveryRoutes");
const dashboardRoutes = require("./routes/dashboardRoutes"); // ✅ NEW
const userModel = require("./models/userModel");

const app = express();
const port = 5000;

// Mongoose config
app.locals.moment = moment;

mongoose.connect(process.env.MONGODB_URI); // ✅ Removed deprecated options
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

// Passport
app.use(passport.initialize());
app.use(passport.session());
passport.use(userModel.createStrategy());
passport.serializeUser(userModel.serializeUser());
passport.deserializeUser(userModel.deserializeUser());

// Debug middleware
app.use((req, res, next) => {
  console.log("Request URL:", req.url, "at", new Date().toISOString());
  next();
});


// --- Individual page routes
// app.get('/dashboard', (req, res) => res.render('dashboard', { page: 'dashboard' }));
// app.get('/stock', (req, res) => res.render('stock', { page: 'stock' }));
// app.get('/stocklist', (req, res) => res.render('stocklist', { page: 'stocklist' }));
// app.get('/sales', (req, res) => res.render('sales', { page: 'sales' }));
// app.get('/saleslist', (req, res) => res.render('saleslist', { page: 'saleslist' }));
// app.get('/delivery', (req, res) => res.render('delivery', { page: 'delivery' }));
// app.get('/deliverylist', (req, res) => res.render('deliverylist', { page: 'deliverylist' }));
// app.get('/signup', (req, res) => res.render('signup', { page: 'signup' }));
// app.get('/userlist', (req, res) => res.render('userlist', { page: 'userlist' }));


// Mount routes
app.use("/", authRoutes);       // /signup, /signin, etc.
app.use("/", stockRoutes);      // /stock, /stocklist, etc.
app.use("/", salesRoutes);      // /sales, /saleslist, etc.
app.use("/", deliveryRoutes);   // /delivery, /deliverylist, etc.
app.use("/", dashboardRoutes);  //  NEW /dashboard route

// 404 handler (keep it last)
app.use((req, res) => {
  res.status(404).send("Oops! Route not found");
});

// Start server
app.listen(port, () => console.log(`Server running on http://localhost:${port}`));
