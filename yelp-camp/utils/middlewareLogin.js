module.exports.isLoggedIn = (req,res,next) => {
    console.log(req.user);
    if(!req.isAuthenticated()){
        req.flash('error','You Have to login first!');
        return res.redirect('/login');
    }
    next();
}