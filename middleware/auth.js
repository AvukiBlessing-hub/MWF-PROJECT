// Ensure user is logged in
exports.ensureAuthenticated = (req, res, next) => {
  if (req.isAuthenticated()) return next();
  res.redirect("/signin");
};

// Ensure user is an Attendant (sales agent)
exports.ensureAgent = (req, res, next) => {
  if (req.isAuthenticated() && req.user.role === "Attendant") return next();
  res.redirect("/"); // redirect if not an attendant
};

// Ensure user is a Manager
exports.ensureManager = (req, res, next) => {
  if (req.isAuthenticated() && req.user.role === "Manager") return next();
  res.redirect("/"); // redirect if not a manager
};
