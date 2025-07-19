require('dotenv').config();
console.log('[DEBUG] JWT_SECRET:', process.env.JWT_SECRET);
console.log('[DEBUG] MONGO_URI:', process.env.MONGO_URI);

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const app = express();

// Middleware
console.log('[DEBUG] Initialisation des middlewares...');
app.use(cors());
app.use(express.json());

// Connexion MongoDB
console.log('[DEBUG] Tentative de connexion à MongoDB...');
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('✅ Connecté à MongoDB Atlas'))
  .catch((err) => console.error('[DEBUG] Erreur MongoDB:', err));

// Routes
console.log('[DEBUG] Initialisation des routes...');
app.use('/auth', require('./routes/auth'));

app.get('/', (req, res) => {
  console.log('[DEBUG] Requête GET / reçue');
  res.send('API utilisateur opérationnelle !');
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Serveur lancé sur le port ${PORT}`);
});