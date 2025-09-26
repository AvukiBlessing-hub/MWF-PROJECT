// 1. Dependencies
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
const classRoutes = require("./routes/classRoutes");
const authRoutes = require("./routes/authRoutes");
const stockRoutes = require("./routes/stockRoutes");
const userModel = require("./models/userModel");
const salesRoutes = require("./routes/salesRoutes");
const deliveryRoutes = require("./routes/deliveryRoutes");


// 2. Instantiations
const app = express();
const port = 5000; // you can change the port here always


// 3. Configurations
app.locals.moment = moment;
console.log("MONGODB_URI from env:", process.env.MONGODB_URI);
mongoose.connect(process.env.MONGODB_URI, {
  // useNewUrlParser: true,
  // useUnifiedTopology: true
});
mongoose.connection    
  .on('open', () => {
    console.log('Mongoose connection open');
  })
  .on('error', (err) => {
    console.log(`Connection error: ${err.message}`);
  });

// setting veiw engine to pug
app.set("view engine", "pug");
app.set("views", path.join(__dirname, "views"));


// 4. Middleware
app.use(express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({ extended: true }));

// express session config
app.use(expressSession({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  store: MongoStore.create({mongoUrl: process.env.MONGODB_URI}),
  cookie: {maxAge:24*60*60*1000} //one day
}))
// passport config
app.use(passport.initialize());
app.use(passport.session())

// authenticate with passport local strategy
passport.use(userModel.createStrategy());
passport.serializeUser(userModel.serializeUser());
passport.deserializeUser(userModel.deserializeUser());

app.use((req, res, next) => {
  console.log('A new request received at ' + Date.now());
  next();
});


// 5. Routes
app.use('/', authRoutes);
app.use('/', stockRoutes);
app.use('/', salesRoutes);

//  add delivery routes here
app.use('/', deliveryRoutes);


// non existing route
app.use((req,res)=>{
    res.status(404).send('Oops! Route not found')
});


// 6. Bootstrapping Server
app.listen(port, () => console.log(`listening on port ${port}`));
