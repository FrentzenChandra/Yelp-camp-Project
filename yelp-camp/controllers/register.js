const { User } = require("../models/user.js");
 
module.exports.index = (req, res) => {
  res.render("register.ejs");
};

module.exports.login = (req, res) => {
  res.render("login.ejs");
};

module.exports.logout = (req, res, next) => {
  req.logOut(function (err) {
    if (err) {
      return next(err);
    }
    req.flash("error", "You Have logged Out");
    res.redirect("/login");
  });
};

module.exports.newUser= async (req, res, next) => {
  try {
    const { username, email, password } = req.body;
    const user = new User({ email, username });
    const registeredUser = await User.register(user, password);

    req.login(registeredUser, (err) => {
      if (err) {
        return next(err);
      }
      req.flash("success", "Welcome to Yelp-Camp");
      res.redirect("/campground");
    });
  } catch (e) {
    req.flash("error", e.message);
    res.redirect("/register");
  }
};

module.exports.redirect = (req, res) => {
  const redirectUrl = res.locals.returnTo || "/campground";
  req.flash("success", "Welcome Back!!!");
  res.redirect(redirectUrl);
}

