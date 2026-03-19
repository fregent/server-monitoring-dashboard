// server.js
const express = require('express');
const path    = require('path');
const session = require('express-session');
require('dotenv').config();

const metricsRouter  = require('./routes/metrics');
const authRouter     = require('./routes/auth');
const servicesRouter = require('./routes/services');

const app  = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: { secure: false }  // passer à true en HTTPS
}));

// Middleware de protection des routes
function requireAuth(req, res, next) {
  if (req.session && req.session.authenticated) return next();
  res.status(401).json({ error: 'Non authentifié' });
}

// Routes publiques
app.use('/api/auth', authRouter);

// Page de login — servie en premier pour éviter la redirection infinie
app.get('/login', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'login.html'));
});

// Routes protégées
app.use('/api/metrics',  requireAuth, metricsRouter);
app.use('/api/services', requireAuth, servicesRouter);

// Frontend — protégé
app.use(express.static(path.join(__dirname, 'public')));
app.get('/', requireAuth, (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`✅ Serveur démarré sur http://localhost:${PORT}`);
});