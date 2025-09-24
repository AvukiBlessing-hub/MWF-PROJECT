// ensure user is authenticated
// ensure user is logged in
exports.ensureauthenticated = (req, res, next) => {
    if (req.isAuthenticated()) {
        return next();
    }
    res.redirect('/signin');
};

// ensure user is an Attendant
exports.ensureAgent = (req, res, next) => {
    if (req.isAuthenticated() && req.user.role === "Attendant") {
        return next();
    }
    res.redirect('/');
};

// ensure user is a Manager
exports.ensuremanager = (req, res, next) => {
    if (req.isAuthenticated() && req.user.role === "manager") {
        return next();
    }
    res.redirect('/');
};
