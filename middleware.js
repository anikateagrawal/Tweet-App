module.exports.locals=(req,res,next)=>{
    res.locals.user=req.user;
    res.locals.msg=req.flash('msg');
    res.locals.err=req.flash('err');
    next();
}

module.exports.isLoggedIn=(req,res,next)=>{
    if(req.isAuthenticated())
        next();
    else
        res.redirect('/login');
}