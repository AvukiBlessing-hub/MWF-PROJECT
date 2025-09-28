// middleware/auth.js

// Ensure user is logged in
exports.ensureAuthenticated = (req, res, next) => {
  if (req.isAuthenticated()) return next();
  res.redirect("/signin");
};

// Ensure user is an Attendant (sales agent)
exports.ensureAttendant = (req, res, next) => {
  if (req.isAuthenticated() && req.user.role === "Attendant") return next();
  res.render("nonUser"); // show page if not authorized
};

// Ensure user is a Manager
exports.ensureManager = (req, res, next) => {
  if (req.isAuthenticated() && req.user.role === "Manager") return next();
  res.render("nonUser"); // show page if not authorized
};
