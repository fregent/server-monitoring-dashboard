// routes/metrics.js
const express   = require('express');
const router    = express.Router();
const collector = require('../services/collector');

router.get('/', async (req, res) => {
  try {
    const metrics = await collector.getMetrics();
    res.json(metrics);
  } catch (error) {
    console.error('Erreur collecte métriques :', error);
    res.status(500).json({ error: 'Impossible de récupérer les métriques' });
  }
});

module.exports = router;