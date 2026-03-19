// routes/services.js
const express = require('express');
const { exec } = require('child_process');
const router  = express.Router();

// Whitelist de sécurité — seuls ces services peuvent être redémarrés
const ALLOWED_SERVICES = ['nginx', 'apache2', 'mysql'];

router.post('/:name/restart', (req, res) => {
  const { name } = req.params;

  // Sécurité : refuser tout service non whitelisté
  if (!ALLOWED_SERVICES.includes(name)) {
    return res.status(403).json({ error: `Service "${name}" non autorisé` });
  }

  exec(`sudo systemctl restart ${name}`, (error, stdout, stderr) => {
    if (error) {
      console.error(`Erreur restart ${name} :`, stderr);
      return res.status(500).json({ error: `Échec du redémarrage de ${name}` });
    }
    res.json({ success: true, message: `${name} redémarré avec succès` });
  });
});

module.exports = router;