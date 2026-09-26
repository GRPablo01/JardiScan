const express = require('express');

const multer = require('multer');

const router = express.Router();

const {
  inscrire,
  connecter,
  obtenirUtilisateurs,
  obtenirUtilisateurParId,
  modifierUtilisateur,
  supprimerUtilisateur,
  modifierRoleUtilisateur,
  genererResetPasswordKey,
  obtenirUtilisateurParEmail,
  verifyResetKey
} = require('../Controller/User.Controller');


// =====================================================
// 📁 CONFIGURATION UPLOAD AVATAR
// =====================================================

const storage = multer.diskStorage({

  destination: (req, file, cb) => {
    cb(null, 'uploads/users');
  },

  filename: (req, file, cb) => {

    const extension = file.originalname
      .split('.')
      .pop()
      .toLowerCase();

    const nomFichier =
      `${Date.now()}-${Math.round(Math.random() * 1E9)}.${extension}`;

    cb(null, nomFichier);
  }

});


const upload = multer({

  storage,

  limits: {
    fileSize: 5 * 1024 * 1024
  },

  fileFilter: (req, file, cb) => {

    const typesAutorises = [
      'image/jpeg',
      'image/png',
      'image/webp'
    ];

    if (!typesAutorises.includes(file.mimetype)) {

      return cb(
        new Error(
          'Format d’image non autorisé. Utilisez JPG, PNG ou WEBP.'
        )
      );
    }

    cb(null, true);
  }

});


// =====================================================
// 👤 INSCRIPTION
// =====================================================

router.post(
  '/register',
  upload.single('avatar'),
  inscrire
);


// =====================================================
// 🔐 CONNEXION
// =====================================================

router.post(
  '/login',
  connecter
);


// =====================================================
// 👥 UTILISATEURS
// =====================================================

router.get(
  '/',
  obtenirUtilisateurs
);


router.get(
  '/email/:email',
  obtenirUtilisateurParEmail
);


router.get(
  '/:id',
  obtenirUtilisateurParId
);


// =====================================================
// ✏️ MODIFICATION UTILISATEUR
// =====================================================

router.put(
  '/:id',
  modifierUtilisateur
);


// =====================================================
// 🗑️ SUPPRESSION UTILISATEUR
// =====================================================

router.delete(
  '/:id',
  supprimerUtilisateur
);


// =====================================================
// 🔐 MODIFICATION ROLE
// =====================================================

router.put(
  '/:key/role',
  modifierRoleUtilisateur
);


// =====================================================
// 🔐 RESET PASSWORD
// =====================================================

router.post(
  '/reset-password',
  genererResetPasswordKey
);


router.post(
  '/verify-reset-key',
  verifyResetKey
);


module.exports = router;