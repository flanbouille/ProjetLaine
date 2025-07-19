const express = require('express');
const router = express.Router();
const User = require('../models/User');
const jwt = require('jsonwebtoken');

// Route d'activation du compte
router.get('/activation', async (req, res) => {
  const { token } = req.query;
  console.log('[DEBUG][activation] Reçu token:', token);

  try {
    // Vérifie que la variable d'env JWT_SECRET existe
    if (!process.env.JWT_SECRET) {
      console.log('[DEBUG][activation] JWT_SECRET absent.');
      return res.status(500).send('Erreur serveur : JWT_SECRET absent.');
    }

    if (!token) {
      console.log('[DEBUG][activation] Token manquant.');
      return res.status(400).send('Token manquant.');
    }

    // Vérifie et décode le token
    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
      console.log('[DEBUG][activation] Token décodé:', decoded);
    } catch (err) {
      console.log('[DEBUG][activation] Token invalide ou expiré:', err.message);
      return res.status(400).send('Lien invalide ou expiré.');
    }

    // Recherche de l'utilisateur
    const user = await User.findById(decoded.userId);
    console.log('[DEBUG][activation] Utilisateur trouvé:', user ? user.username : null);
    if (!user) {
      console.log('[DEBUG][activation] Utilisateur introuvable.');
      return res.status(404).send('Utilisateur introuvable');
    }

    // Si déjà activé
    if (user.isActive) {
      console.log('[DEBUG][activation] Compte déjà activé.');
      return res.redirect(`/compte?activated=true`);
    }

    // Activation du compte
    user.isActive = true;
    await user.save();
    console.log('[DEBUG][activation] Compte activé pour:', user.username);
    res.redirect(`/compte?activated=true`);
    // Ou : res.send('Votre compte est activé !');
  } catch (err) {
    console.error('[DEBUG][activation] Erreur activation :', err);
    res.status(500).send('Erreur serveur.');
  }
});

module.exports = router;