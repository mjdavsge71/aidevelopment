const express = require('express');
const passport = require('passport');
const router = express.Router();

// Google authentication route
router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

// Google authentication callback route
router.get('/google/callback', passport.authenticate('google', { failureRedirect: '/' }), (req, res) => {
  res.redirect('/');
});

// Email/password authentication route
router.post('/login', passport.authenticate('local', { failureRedirect: '/' }), (req, res) => {
  res.redirect('/');
});

// Register new account route
router.post('/register', (req, res) => {
  // Registration logic here
});

module.exports = router;
