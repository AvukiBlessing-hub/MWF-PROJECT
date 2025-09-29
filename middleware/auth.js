// middleware/auth.js

// Ensure user is logged in
exports.ensureAuthenticated = (req, res, next) => {
  if (req.isAuthenticated()) return next();
  return res.redirect("/signin"); // redirect to login if not authenticated
};

// Ensure user is an Attendant (sales agent)
exports.ensureAttendant = (req, res, next) => {
  console.log("ensureAttendant:", req.isAuthenticated(), req.user && req.user.role);

  if (!req.isAuthenticated()) {
    return res.redirect("/signin"); // not logged in
  }

  if (req.user.role === "Attendant") {
    return next(); // correct role
  }

  // User logged in but not Attendant
  return res.status(403).render("nonUser");
};

// Ensure user is a Manager
exports.ensureManager = (req, res, next) => {
  if (!req.isAuthenticated()) {
    return res.redirect("/signin"); // not logged in
  }

  if (req.user.role === "Manager") {
    return next(); // correct role
  }

  // User logged in but not Manager
  return res.status(403).render("nonUser");
};
