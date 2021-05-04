const User = require('../models/user');

module.exports.renderRegister = (req, res) => {
   // res.render('../views/users/register');
   res.render('users/register');
}

module.exports.register = async (req, res) => {
   try {
      const { email, username, password } = req.body;
      const user = new User({ email, username });
      const registeredUser = await User.register(user, password);
      req.login(registeredUser, err => {
         if (err) return next(err);
         req.flash('success', 'Welcome to Yelp Camp!');
         res.redirect('/campgrounds');
      });
   } catch (e) {
      req.flash('error', e.message);
      res.redirect('register')
   }
}

module.exports.renderLogin = (req, res) => {
   res.render('users/login')
}

module.exports.login = (req, res) => {
   req.flash('success', 'welcome back!');
   // returnTo is defined and given a value inside "middleware.js"
   // if no value is given to retunTo (user logs in first thing before visiting a route that requires a login first then we give it a default value of "/campgrounds")
   const redirectUrl = req.session.returnTo || '/campgrounds';
   // below line clears session after we've been redirected
   delete req.session.returnTo;
   res.redirect(redirectUrl);
}

module.exports.logout = (req, res) => {
   req.logout();
   req.flash('success', 'Successfully logged out')
   res.redirect('/campgrounds');
}