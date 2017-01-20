const User = require('../models/user')
const passport = require('../config/ppConfig')

let userController = {
  getSignUp: function (req, res) {
    res.render('./auth/signup')
  },

  postSignUp: function (req, res) {
    User.create({
      email: req.body.email,
      name: req.body.name,
      password: req.body.password
    }, function (err, createdUser) {
      if (err) {
        // err.errors is an array of all the errors, we could loop through them to display the schema validation error messages
        // req.flash('error', '' + err)
        req.flash('error', err.toString())
        res.redirect('/auth/signup')
      } else {
        passport.authenticate('local', {
          successRedirect: '/',
          successFlash: 'Account created for ' + req.body.name + ' and logged in'
        })(req, res)
      }
    })
  },

  getLogIn: (req, res) => {
    res.render('./auth/login')
  },

  postLogIn: passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/auth/login',
    failureFlash: 'Invalid username and/or password',
    successFlash: 'You have logged in'
  }),

  getLogOut: (req, res) => {
    req.logout()
    req.flash('success', 'You have logged out')
    res.redirect('/')
  }
}

module.exports = userController
