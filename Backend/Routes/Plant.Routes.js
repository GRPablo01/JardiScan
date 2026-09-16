// ============================================================
// 🌱 PLANT ROUTES — JARDISCAN
// ============================================================

// ============================================================
// 📦 IMPORTS
// ============================================================

const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const {
  createPlant,
  getPlants,
  getPlantById,
  identifyPlant
} = require('../Controller/Plant.Controller');

// ============================================================
// 🚏 ROUTER
// ============================================================

const router = express.Router();

// ============================================================
// 🌱 INITIALISATION
// ============================================================

console.log('');
console.log('==========================================');
console.log('🌱 Plant.Routes.js chargé');
console.log('==========================================');

// ============================================================
// 📁 DOSSIER UPLOAD
// ============================================================
//
// Structure :
//
// projet/
// ├── uploads/
// │   └── plants/
// ├── Controller/
// ├── Routes/
// └── server.js
//
// process.cwd() permet d'utiliser la racine depuis laquelle
// le serveur Node.js est lancé.
//

const uploadDirectory = path.join(
  process.cwd(),
  'uploads',
  'plants'
);

console.log(
  '📁 Dossier upload :',
  uploadDirectory
);

// ============================================================
// 📁 CRÉATION DU DOSSIER
// ============================================================

try {

  if (!fs.existsSync(uploadDirectory)) {

    fs.mkdirSync(
      uploadDirectory,
      {
        recursive: true
      }
    );

    console.log(
      '📂 Dossier uploads/plants créé'
    );

  } else {

    console.log(
      '📂 Dossier uploads/plants déjà présent'
    );

  }

} catch (error) {

  console.error(
    '❌ Impossible de créer le dossier uploads/plants'
  );

  console.error(
    error
  );

}

// ============================================================
// 📸 CONFIGURATION MULTER
// ============================================================

const storage = multer.diskStorage({

  // ----------------------------------------------------------
  // DESTINATION
  // ----------------------------------------------------------

  destination: (req, file, cb) => {

    console.log(
      '📂 Destination upload :',
      uploadDirectory
    );

    cb(
      null,
      uploadDirectory
    );

  },

  // ----------------------------------------------------------
  // NOM DU FICHIER
  // ----------------------------------------------------------

  filename: (req, file, cb) => {

    const extension =
      path.extname(
        file.originalname
      ).toLowerCase();

    const uniqueName =
      `plant-${Date.now()}-${Math.round(
        Math.random() * 1e9
      )}${extension}`;

    console.log(
      '📝 Nom fichier généré :',
      uniqueName
    );

    cb(
      null,
      uniqueName
    );

  }

});

// ============================================================
// 🛡️ CONFIGURATION UPLOAD
// ============================================================

const upload = multer({

  storage,

  limits: {

    // Maximum 10 Mo par image
    fileSize:
      10 * 1024 * 1024,

    // Maximum 10 images
    files:
      10

  },

  fileFilter: (req, file, cb) => {

    console.log('');
    console.log('==========================================');
    console.log('📸 FICHIER IMAGE REÇU');
    console.log('==========================================');

    console.log(
      'Nom :',
      file.originalname
    );

    console.log(
      'Type :',
      file.mimetype
    );

    console.log(
      'Champ :',
      file.fieldname
    );

    // --------------------------------------------------------
    // Vérification MIME
    // --------------------------------------------------------

    if (
      !file.mimetype ||
      !file.mimetype.startsWith('image/')
    ) {

      console.error(
        '❌ Type MIME non autorisé :',
        file.mimetype
      );

      return cb(
        new Error(
          'Seules les images sont autorisées.'
        )
      );

    }

    // --------------------------------------------------------
    // Extensions autorisées
    // --------------------------------------------------------

    const allowedExtensions = [
      '.jpg',
      '.jpeg',
      '.png',
      '.webp',
      '.gif'
    ];

    const extension =
      path.extname(
        file.originalname
      ).toLowerCase();

    if (
      !allowedExtensions.includes(
        extension
      )
    ) {

      console.error(
        '❌ Extension non autorisée :',
        extension
      );

      return cb(
        new Error(
          'Format d’image non autorisé.'
        )
      );

    }

    console.log(
      '✅ Image acceptée'
    );

    cb(
      null,
      true
    );

  }

});

// ============================================================
// 🔎 LOG REQUEST
// ============================================================

router.use(
  (req, res, next) => {

    console.log('');
    console.log('==========================================');
    console.log('🌱 PLANT ROUTE');
    console.log('==========================================');

    console.log(
      '➡️ Méthode :',
      req.method
    );

    console.log(
      '➡️ URL :',
      req.originalUrl
    );

    console.log(
      '➡️ URL routeur :',
      req.url
    );

    console.log(
      '➡️ IP :',
      req.ip
    );

    console.log(
      '➡️ Heure :',
      new Date().toISOString()
    );

    console.log('==========================================');

    next();

  }
);

// ============================================================
// 🔎 POST /api/plants/identify
// ============================================================
//
// Identifier une plante à partir d'une image.
//
// Angular doit envoyer :
//
// FormData
// └── image
//
// Exemple côté Angular :
//
// formData.append(
//   'image',
//   blob,
//   'plant.jpg'
// );
//
// IMPORTANT :
// Cette route est placée AVANT /:id.
//
// ============================================================

router.post(
  '/identify',
  upload.single('image'),
  async (req, res, next) => {

    console.log('');
    console.log('==========================================');
    console.log('🔎 IDENTIFICATION PLANTE');
    console.log('==========================================');

    console.log(
      '📡 Route : POST /api/plants/identify'
    );

    // --------------------------------------------------------
    // Vérification de l'image
    // --------------------------------------------------------

    if (!req.file) {

      console.error(
        '❌ Aucune image reçue'
      );

      return res.status(400).json({

        success: false,

        message:
          'Aucune image n’a été envoyée.'

      });

    }

    // --------------------------------------------------------
    // Informations fichier
    // --------------------------------------------------------

    console.log(
      '📸 Image reçue :',
      req.file.originalname
    );

    console.log(
      '📝 Nom serveur :',
      req.file.filename
    );

    console.log(
      '📦 MIME :',
      req.file.mimetype
    );

    console.log(
      '📏 Taille :',
      req.file.size
    );

    console.log(
      '📁 Path :',
      req.file.path
    );

    console.log(
      '🌐 URL :',
      `/uploads/plants/${req.file.filename}`
    );

    // --------------------------------------------------------
    // Controller
    // --------------------------------------------------------

    try {

      await identifyPlant(
        req,
        res,
        next
      );

    } catch (error) {

      console.error(
        '❌ Erreur identification plante :',
        error
      );

      next(error);

    }

  }
);

// ============================================================
// 🌱 GET /api/plant
// ============================================================
//
// Récupérer toutes les plantes.
//
// IMPORTANT :
// Cette route est conservée telle quelle pour ne pas casser
// ton fonctionnement actuel.
//
// Si ton server.js contient :
//
// app.use('/api/plant', plantRoutes);
//
// alors cette route devient :
//
// GET /api/plant
//
// ============================================================

router.get(
  '/',
  async (req, res, next) => {

    console.log('');
    console.log('==========================================');
    console.log('🌿 GET ALL PLANTS');
    console.log('==========================================');

    console.log(
      '📡 Route : GET /api/plant'
    );

    try {

      await getPlants(
        req,
        res,
        next
      );

    } catch (error) {

      console.error(
        '❌ Erreur GET /api/plant :',
        error
      );

      next(error);

    }

  }
);

// ============================================================
// 🧪 GET /api/plant/debug/uploads
// ============================================================
//
// Vérifier les images présentes sur le serveur.
//
// IMPORTANT :
// Cette route doit être placée AVANT /:id.
//
// ============================================================

router.get(
  '/debug/uploads',
  (req, res) => {

    console.log('');
    console.log('==========================================');
    console.log('🧪 DEBUG UPLOADS');
    console.log('==========================================');

    try {

      const exists =
        fs.existsSync(
          uploadDirectory
        );

      const files =
        exists
          ? fs.readdirSync(
              uploadDirectory
            )
          : [];

      console.log(
        '📁 Directory :',
        uploadDirectory
      );

      console.log(
        '📂 Exists :',
        exists
      );

      console.log(
        '📸 Nombre fichiers :',
        files.length
      );

      res.status(200).json({

        success: true,

        directory:
          uploadDirectory,

        exists,

        count:
          files.length,

        files

      });

    } catch (error) {

      console.error(
        '❌ Erreur debug uploads :',
        error
      );

      res.status(500).json({

        success: false,

        message:
          'Impossible de lire le dossier uploads.',

        error:
          error.message

      });

    }

  }
);

// ============================================================
// 🌱 GET /api/plant/:id
// ============================================================
//
// Récupérer une plante par son ID.
//
// IMPORTANT :
// Cette route est placée après /debug/uploads.
//
// ============================================================

router.get(
  '/:id',
  async (req, res, next) => {

    console.log('');
    console.log('==========================================');
    console.log('🌿 GET PLANT BY ID');
    console.log('==========================================');

    console.log(
      '🆔 ID :',
      req.params.id
    );

    console.log(
      `📡 Route : GET /api/plant/${req.params.id}`
    );

    try {

      await getPlantById(
        req,
        res,
        next
      );

    } catch (error) {

      console.error(
        '❌ Erreur GET plante :',
        error
      );

      next(error);

    }

  }
);

// ============================================================
// 🌱 POST /api/plant
// ============================================================
//
// Créer une plante avec images.
//
// Angular doit envoyer :
//
// FormData
//
// ├── nomCommun
// ├── nomScientifique
// ├── famille
// ├── genre
// ├── espece
// ├── categorie
// └── images[]
//
// ============================================================

router.post(
  '/',
  upload.array(
    'images',
    10
  ),
  async (req, res, next) => {

    console.log('');
    console.log('==========================================');
    console.log('🌱 POST /api/plant');
    console.log('==========================================');

    // --------------------------------------------------------
    // BODY
    // --------------------------------------------------------

    console.log(
      '📦 Body :',
      req.body
    );

    // --------------------------------------------------------
    // FICHIERS
    // --------------------------------------------------------

    console.log(
      '📸 Nombre images :',
      req.files
        ? req.files.length
        : 0
    );

    // --------------------------------------------------------
    // DÉTAILS DES FICHIERS
    // --------------------------------------------------------

    if (
      req.files &&
      req.files.length > 0
    ) {

      req.files.forEach(
        (file, index) => {

          console.log('');
          console.log(
            `📸 IMAGE ${index + 1}`
          );

          console.log(
            '   Nom original :',
            file.originalname
          );

          console.log(
            '   Nom serveur :',
            file.filename
          );

          console.log(
            '   MIME :',
            file.mimetype
          );

          console.log(
            '   Taille :',
            file.size
          );

          console.log(
            '   Path :',
            file.path
          );

          console.log(
            '   URL :',
            `/uploads/plants/${file.filename}`
          );

        }
      );

    } else {

      console.log(
        'ℹ️ Aucune image reçue'
      );

    }

    // --------------------------------------------------------
    // CONTROLLER
    // --------------------------------------------------------

    try {

      await createPlant(
        req,
        res,
        next
      );

    } catch (error) {

      console.error(
        '❌ Erreur création plante :',
        error
      );

      next(error);

    }

  }
);

// ============================================================
// ❌ GESTION DES ERREURS MULTER
// ============================================================

router.use(
  (err, req, res, next) => {

    console.error('');
    console.error('==========================================');
    console.error('❌ ERREUR PLANT ROUTES');
    console.error('==========================================');

    console.error(
      'Message :',
      err.message
    );

    console.error(
      'Code :',
      err.code || 'N/A'
    );

    // ========================================================
    // 🛡️ MULTER ERROR
    // ========================================================

    if (
      err instanceof multer.MulterError
    ) {

      console.error(
        '❌ Erreur Multer :',
        err.code
      );

      let message =
        'Erreur lors de l’upload.';

      switch (err.code) {

        case 'LIMIT_FILE_SIZE':

          message =
            'Une image dépasse la taille maximale de 10 Mo.';

          break;

        case 'LIMIT_FILE_COUNT':

          message =
            'Le nombre maximum de fichiers est de 10.';

          break;

        case 'LIMIT_UNEXPECTED_FILE':

          message =
            'Champ fichier inattendu. Utilisez "image" pour l’identification ou "images" pour la création.';

          break;

        case 'LIMIT_PART_COUNT':

          message =
            'Trop de parties dans la requête.';

          break;

        case 'LIMIT_FIELD_COUNT':

          message =
            'Trop de champs dans la requête.';

          break;

        case 'LIMIT_FIELD_KEY':

          message =
            'Nom de champ trop long.';

          break;

        case 'LIMIT_FIELD_VALUE':

          message =
            'Valeur de champ trop longue.';

          break;

        default:

          message =
            err.message ||
            message;

      }

      return res.status(400).json({

        success: false,

        message,

        error:
          err.code

      });

    }

    // ========================================================
    // ❌ ERREUR PERSONNALISÉE
    // ========================================================

    if (err) {

      return res.status(
        err.status || 500
      ).json({

        success: false,

        message:
          err.message ||
          'Une erreur serveur est survenue.'

      });

    }

    next();

  }
);

// ============================================================
// 📤 EXPORT
// ============================================================

console.log('');
console.log('==========================================');
console.log('✅ ROUTES PLANTES PRÊTES');
console.log('==========================================');

console.log(
  '🔎 POST /api/plants/identify'
);

console.log(
  '🌱 GET  /api/plant'
);

console.log(
  '🌱 GET  /api/plant/:id'
);

console.log(
  '🌱 POST /api/plant'
);

console.log(
  '🧪 GET  /api/plant/debug/uploads'
);

console.log(
  '📸 Upload : /uploads/plants'
);

console.log('==========================================');
console.log('');

module.exports = router;
