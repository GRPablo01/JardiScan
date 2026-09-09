const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

// ==========================================
// Configuration
// ==========================================

const app = express();
const PORT = process.env.PORT || 3000;

// ==========================================
// Middlewares
// ==========================================

app.use(cors());
app.use(express.json());

// ==========================================
// Connexion MongoDB
// ==========================================

const MONGODB_URI =
  process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/jardiscan';

mongoose
  .connect(MONGODB_URI)
  .then(() => {
    console.log('✅ Connexion à MongoDB réussie');
    console.log(`📦 Base de données : ${mongoose.connection.name}`);
  })
  .catch((error) => {
    console.error('❌ Erreur de connexion à MongoDB :');
    console.error(error.message);
  });

// ==========================================
// Route de test
// ==========================================

app.get('/', (req, res) => {
  res.json({
    success: true,
    message: '🌱 Serveur JardiScan opérationnel',
    mongodb: mongoose.connection.readyState === 1
      ? 'connecté'
      : 'non connecté'
  });
});

// ==========================================
// Route pour vérifier MongoDB
// ==========================================

app.get('/api/health', (req, res) => {
  const mongoStatus = mongoose.connection.readyState;

  res.json({
    server: 'OK',
    mongodb: mongoStatus === 1 ? 'OK' : 'OFFLINE'
  });
});

// ==========================================
// Démarrage du serveur
// ==========================================

app.listen(PORT, () => {
  console.log('');
  console.log('======================================');
  console.log('🌱 JARDISCAN SERVER');
});
