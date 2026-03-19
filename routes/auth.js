// routes/auth.js
const express = require('express');
const bcrypt  = require('bcryptjs');
const router  = express.Router();

// Login
router.post('/login', async (req, res) => {
  const { username, password } = req.body;

  const validUser = username === process.env.ADMIN_USERNAME;
  const validPass = await bcrypt.compare(password, process.env.ADMIN_PASSWORD_HASH);

  if (!validUser || !validPass) {
    return res.status(401).json({ error: 'Identifiants incorrects' });
  }

  req.session.authenticated = true;
  req.session.username = username;
  res.json({ success: true });
});

// Logout
router.post('/logout', (req, res) => {
  req.session.destroy(() => {
    res.json({ success: true });
  });
});

// Vérifier la session courante
router.get('/me', (req, res) => {
  if (req.session && req.session.authenticated) {
    return res.json({ authenticated: true, username: req.session.username });
  }
  res.status(401).json({ authenticated: false });
});

module.exports = router;