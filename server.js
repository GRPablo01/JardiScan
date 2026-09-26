
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
const fs = require('fs');

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
// 📁 Dossiers uploads
// ==========================================

const uploadsPath = path.join(
  __dirname,
  'uploads'
);

const plantsUploadPath = path.join(
  uploadsPath,
  'plants'
);

const usersUploadPath = path.join(
  uploadsPath,
  'users'
);

// ==========================================
// 📁 Création automatique des dossiers
// ==========================================

if (!fs.existsSync(plantsUploadPath)) {
  fs.mkdirSync(plantsUploadPath, {
    recursive: true
  });

  console.log(
    '📁 Dossier créé :',
    plantsUploadPath
  );
}

if (!fs.existsSync(usersUploadPath)) {
  fs.mkdirSync(usersUploadPath, {
    recursive: true
  });

  console.log(
    '📁 Dossier créé :',
    usersUploadPath
  );
}

// ==========================================
// 📸 Fichiers statiques — Uploads plantes
// ==========================================

app.use(
  '/uploads/plants',
  express.static(plantsUploadPath)
);

// ==========================================
// 👤 Fichiers statiques — Uploads utilisateurs
// ==========================================

app.use(
  '/uploads/users',
  express.static(usersUploadPath)
);

// ==========================================
// 🔎 Diagnostic uploads plantes
// ==========================================

app.get(
  '/api/plant/debug/uploads',
  (req, res) => {

    try {

      const fichiers = fs.readdirSync(
        plantsUploadPath
      );

      res.json({
        success: true,
        dossier: plantsUploadPath,
        fichiers
      });

    } catch (error) {

      console.error(
        '❌ Erreur lecture uploads/plants :',
        error
      );

      res.status(500).json({
        success: false,
        message: error.message
      });

    }

  }
);

// ==========================================
// Connexion MongoDB
// ==========================================

const MONGODB_URI =
  process.env.MONGODB_URI ||
  'mongodb://127.0.0.1:27017/jardiscan';

mongoose
  .connect(MONGODB_URI)

  .then(() => {

    console.log(
      '✅ Connexion à MongoDB réussie'
    );

    console.log(
      `📦 Base de données : ${mongoose.connection.name}`
    );

  })

  .catch((error) => {

    console.error(
      '❌ Erreur de connexion à MongoDB :'
    );

    console.error(
      error.message
    );

  });

// ==========================================
// Route de test
// ==========================================

app.get(
  '/',
  (req, res) => {

    res.json({

      success: true,

      message:
        '🌱 Serveur JardiScan opérationnel',

      mongodb:
        mongoose.connection.readyState === 1
          ? 'connecté'
          : 'non connecté'

    });

  }
);

// ==========================================
// Route pour vérifier MongoDB
// ==========================================

app.get(
  '/api/health',
  (req, res) => {

    const mongoStatus =
      mongoose.connection.readyState;

    res.json({

      server: 'OK',

      mongodb:
        mongoStatus === 1
          ? 'OK'
          : 'OFFLINE'

    });

  }
);

// ==========================================
// 🌱 Plants / JardiScan
// ==========================================

const plantRoutes =
  require('./Backend/Routes/Plant.Routes');

// ==========================================
// 👤 Users
// ==========================================

const userRoutes =
  require('./Backend/Routes/User.Routes');

const resetPasswordRoutes =
  require('./Backend/Routes/resetPassword.routes');

// ==========================================
// 🔔 Rappels
// ==========================================

const rappelRoutes =
  require('./Backend/Routes/rappel.routes');

// ==========================================
// 👤 API utilisateurs
// ==========================================

app.use(
  '/api/users',
  userRoutes
);

app.use(
  '/api/reset-password',
  resetPasswordRoutes
);

app.post(
  '/api/users/verify-reset-key',
  (req, res) => {

    res.status(200).json({

      success: true,

      message:
        'Route verify-reset-key fonctionnelle'

    });

  }
);

// ==========================================
// 🔔 API rappels
// ==========================================

app.use(
  '/api/rappels',
  rappelRoutes
);

// ==========================================
// 🌱 API plantes
// ==========================================

// API historique JardiScan
app.use(
  '/api/plant',
  plantRoutes
);

// API utilisée par le nouveau scan
app.use(
  '/api/plants',
  plantRoutes
);
// ==========================================
// Démarrage du serveur
// ==========================================

app.listen(
  PORT,
  () => {

    console.log('');

    console.log(
      '======================================'
    );

    console.log(
      '🌱 JARDISCAN SERVER'
    );

    console.log(
      `🚀 Serveur démarré sur http://localhost:${PORT}`
    );

    console.log(
      '📸 Uploads plantes disponibles sur /uploads/plants'
    );

    console.log(
      '👤 Uploads utilisateurs disponibles sur /uploads/users'
    );

    console.log(
      `📁 Dossier plantes : ${plantsUploadPath}`
    );

    console.log(
      '======================================'
    );

  }
);
