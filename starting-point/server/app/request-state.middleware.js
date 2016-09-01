'use strict'; 

var router = require('express').Router();
var session = require('express-session');
var passport = require('passport');
var secretName = require('../new/secret.json')

var User = require('../api/users/user.model');

router.use(function (req, res, next) {
  var bodyString = '';
  req.on('data', function (chunk) {
    bodyString += chunk;
  });
  req.on('end', function () {
    bodyString = bodyString || '{}';
    req.body = eval('(' + bodyString + ')');
    next();
  });
});

var expiryDate = new Date( Date.now() + 60 * 5 * 1000 ); // 1 hour
router.use(session({
  secret: secretName,
  resave: false,
  saveUninitialized: false,
  cookie: { secure: true,
            httpOnly: true,
            domain: 'example.com',
            path: 'foo/bar',
            expires: expiryDate
          }
}));

passport.serializeUser(function (user, done) {
  done(null, user.id);
});

passport.deserializeUser(function (id, done) {
  User.findById(id)
  .then(function (user) {
    done(null, user);
  })
  .catch(done);
});

router.use(passport.initialize());

router.use(passport.session());

module.exports = router;
