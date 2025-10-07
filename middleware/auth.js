// middleware/auth.js

// Ensure the user is logged in (any role)
function isAuthenticated(req, res, next) {
  if (req.isAuthenticated()) return next();
  return res.redirect("/signin");
}

// Ensure user is a Manager
function isManager(req, res, next) {
  if (!req.isAuthenticated()) return res.redirect("/signin");

  if (req.user.role === "Manager") return next();

  return res.status(403).render("nonUser");
}

// Ensure user is an Attendant
function isAttendant(req, res, next) {
  if (!req.isAuthenticated()) return res.redirect("/signin");

  if (req.user.role === "Attendant") return next();

  return res.status(403).render("nonUser");
}

module.exports = {
  isAuthenticated,
  isManager,
  isAttendant
};
