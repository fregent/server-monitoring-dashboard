// server.js
const express = require('express');
const path    = require('path');
require('dotenv').config();

const metricsRouter = require('./routes/metrics');

const app  = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Routes
app.use('/api/metrics', metricsRouter);

// Démarrage
app.listen(PORT, () => {
  console.log(`Serveur démarré sur http://localhost:${PORT}`);
});