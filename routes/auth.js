const express = require('express');
const router = express.Router();
const User = require('../models/User');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const bcrypt = require('bcrypt');

// Fonction utilitaire pour vérifier la présence des variables .env
function checkEnvVars() {
  if (!process.env.JWT_SECRET) throw new Error('JWT_SECRET non défini dans .env');
  if (!process.env.MAIL_USER) throw new Error('MAIL_USER non défini dans .env');
  if (!process.env.MAIL_PASS) throw new Error('MAIL_PASS non défini dans .env');
  console.log('[DEBUG] Variables d\'environnement vérifiées.');
}

// Inscription
router.post('/signup', async (req, res) => {
  console.log('[DEBUG] Requête POST /signup reçue.');
  console.log('[DEBUG] Corps reçu:', req.body);

  const { username, email, password } = req.body;
  try {
    checkEnvVars();

    // Vérification des champs
    if (!username || !email || !password) {
      console.log('[DEBUG] Champs manquants:', { username, email, password });
      return res.status(400).json({ error: 'Tous les champs sont requis.' });
    }
    console.log('[DEBUG] Champs présents.');

    // Vérification de l'unicité du pseudo
    const userByUsername = await User.findOne({ username });
    console.log('[DEBUG] Résultat recherche username:', userByUsername);
    if (userByUsername) {
      console.log('[DEBUG] Pseudo déjà pris.');
      return res.status(400).json({ error: 'Ce pseudo est déjà pris.' });
    }

    // Vérification de l'unicité de l'email
    const userByEmail = await User.findOne({ email });
    console.log('[DEBUG] Résultat recherche email:', userByEmail);
    if (userByEmail) {
      console.log('[DEBUG] Email déjà utilisé.');
      return res.status(400).json({ error: 'Cet email est déjà utilisé.' });
    }

    // Validation email simple
    const emailRegex = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;
    if (!emailRegex.test(email)) {
      console.log('[DEBUG] Format email invalide:', email);
      return res.status(400).json({ error: "Format d'email invalide." });
    }
    console.log('[DEBUG] Format email OK.');

    // Hash du mot de passe
    if (password.length < 6) {
      console.log('[DEBUG] Mot de passe trop court:', password.length);
      return res.status(400).json({ error: "Le mot de passe doit faire au moins 6 caractères." });
    }
    console.log('[DEBUG] Mot de passe OK, hashage...');
    const hashedPassword = await bcrypt.hash(password, 10);

    // Création de l'utilisateur (non actif)
    const user = new User({ username, email, password: hashedPassword, isActive: false });
    await user.save();
    console.log('[DEBUG] Utilisateur créé en base:', user);

    // Création du token d’activation JWT
    const activationToken = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET,
      { expiresIn: '1d' }
    );
    console.log('[DEBUG] Token d\'activation généré:', activationToken);

    // Envoi de l’email
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASS
      }
    });

    const activationLink = `http://localhost:3000/auth/activate?token=${activationToken}`;
    console.log('[DEBUG] Lien d\'activation:', activationLink);

    await transporter.sendMail({
      from: `"Mon App" <${process.env.MAIL_USER}>`,
      to: email,
      subject: "Activez votre compte",
      html: `
        <h3>Bienvenue ${username} !</h3>
        <p>Pour activer votre compte, cliquez ici : <a href="${activationLink}">${activationLink}</a></p>
        <p>Ou copiez ce lien dans votre navigateur.</p>
        <p>Si vous n’avez pas demandé la création de ce compte, ignorez ce message.</p>
      `
    });
    console.log('[DEBUG] Email d\'activation envoyé à:', email);

    res.status(201).json({ message: 'Compte créé, vérifiez votre email pour l’activer.' });
    console.log('[DEBUG] Réponse envoyée au client.');
  } catch (err) {
    console.error('[DEBUG] Erreur inscription :', err);
    res.status(400).json({ error: err.message || 'Erreur lors de la création du compte.' });
  }
});

// Activation du compte
router.get('/activate', async (req, res) => {
  console.log('[DEBUG] Requête GET /activate reçue.');
  try {
    checkEnvVars();

    const { token } = req.query;
    console.log('[DEBUG] Token reçu:', token);

    if (!token) {
      console.log('[DEBUG] Token manquant.');
      return res.status(400).send("Token manquant !");
    }
    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
      console.log('[DEBUG] Token décodé:', decoded);
    } catch (e) {
      console.log('[DEBUG] Token invalide ou expiré:', e.message);
      return res.status(400).send("Token invalide ou expiré !");
    }
    const user = await User.findById(decoded.userId);
    console.log('[DEBUG] Utilisateur trouvé:', user);
    if (!user) {
      console.log('[DEBUG] Utilisateur non trouvé.');
      return res.status(400).send("Utilisateur non trouvé !");
    }
    if (user.isActive) {
      console.log('[DEBUG] Compte déjà activé.');
      return res.send("Compte déjà activé.");
    }
    user.isActive = true;
    await user.save();
    console.log('[DEBUG] Compte activé pour:', user.username);
    res.send("Compte activé ! Vous pouvez maintenant vous connecter.");
  } catch (err) {
    console.error('[DEBUG] Erreur d\'activation :', err);
    res.status(400).send("Erreur d'activation : " + err.message);
  }
});

module.exports = router;