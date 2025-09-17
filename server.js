1.//Dependencies
require("dotenv").config();
const express = require('express');
const path = require("path");
const mongoose = require('mongoose');
const passport =require("passport");
const expressSession =require("express-session");
const MongoStore = require("connect-mongo");
const moment = require("moment");


//import routes
require
const classRoutes = require("./routes/classRoutes");
const authRoutes = require("./routes/authRoutes");
const stockRoute = require("./routes/stockRoute");
const userModels = require("./models/userModels");
2.//Instantiations
const app = express();

const port =4500; // you can change the port here always

3.//Configurations   // setting up mongo connection
console.log("MONGODB_URL from env:", process.env.MONGODB_URL);
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

// // routing
// app.get('/', (req,res) => {
//     res.send('Homepage! Hello world.')
//     })

// 4 Middleware
// app.use(express.static('public'));
app.use(express.static(path.join(__dirname, "public")));
app.use("/public/puloads", express.static(__dirname + "/public/puloads"))
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
passport.use(userModels.createStrategy());
passport.serializeUser(userModels.serializeUser());
passport.deserializeUser(userModels.deserializeUser());





// // Simple request time logger
// app.use((req, res, next) => {
//    console.log("A new request received at " + Date.now());

//    // This function call tells that more processing is
//    // required for the current request and is in the next middleware
// //    function/route handler.
//    next();  
// });


// app.use((req, res, next) => {
//   console.log('A new request received at ' + Date.now());
//   next();
// });
app.use((req, res, next) => {
  console.log('A new request received at ' + Date.now());
  next();
});

5.//Routes
//using imported routes
// app.use('/',classRoutes)
app.use('/',authRoutes);
app.use('/',stockRoute)









//non existing route
app.use((req,res)=>{
    res.status(404).send('Oops! Route not found')
});





//5 Bootstrapping Server
// this should always be the last line in this file.
app.listen(port, () => console.log(`listening on port ${port}`));

