// ensure user is authenticated
exports.ensureauthenticated= (req,res,next)=>{
    if(req.session.user){
        return next()
    }
    res.redirect('/login')
};

// ensure user is a sales agent
exports.ensureAgent= (req,res,next)=>{
    if(req.session.user && req.session.user.role==="Attendant"){
        return next()
    }
    res.redirect('/')
};

// ensure the user is a manager

exports.ensuremanager= (req,res,next)=>{
    if(req.session.user && req.session.user.role==="manager"){
        return next()
    }
    res.redirect('/')
};