const express = require("express");
const router = express.Router();
const path = require("path");

// Logger Middleware (put it first!)
router.use((req, res, next) => {
  console.log("Request received at " + new Date().toLocaleString());
  next();
});

// Basic routes
router.get('/home', (req, res) => {
  res.send('This is my best page! Nice.');
});

router.get('/about', (req, res) => {
  res.send('This about page! Nice.');
});

router.post('/about', (req, res) => {
  res.send('About page POST! Nice.');
});

router.put('/user', (req, res) => {
  res.send('Got a PUT request at /user');
});

router.delete('/user', (req, res) => {
  res.send('Got a DELETE request at /user');
});

// Path parameters
router.get('/pathparams/:username', (req, res) => {
  res.send('This is the username: ' + req.params.username);
});

// Query string
router.get('/students', (req, res) => {
  res.send('This is ' + req.query.name + ' from cohort ' + req.query.cohort + ' class of ' + req.query.class);
});

// Serving HTML files
router.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../html/index.html'));
});

router.get('/registerUser', (req, res) => {
  res.sendFile(path.join(__dirname, '../html/form.html'));
});

router.post('/registerUser', (req, res) => {
  console.log(req.body);
  res.send("User registered successfully.");
});

router.post("/index", (req, res) => {
  console.log(req.body);
  res.send("Manager registered successfully!");
});

router.get("/manager", (req, res) => {
  res.sendFile(path.join(__dirname, '/../html/manager.html'));
});

router.post("/manager", (req, res) => {
  console.log(req.body);
  res.send("Manager data received.");
});

module.exports = router;
