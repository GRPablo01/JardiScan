const Plant = require('../Schema/Plant');
const fs = require('fs');


// ============================================================
// ⚙️ CONFIGURATION
// ============================================================

const MAX_PLANT_IMAGES = 5;

const DEFAULT_VIEWS = [
  'front',
  'side',
  'top',
  'close-up',
  'far'
];

const ALLOWED_VIEWS = [
  'front',
  'side',
  'top',
  'close-up',
  'far'
];


// ============================================================
// 🛠️ UTILITAIRES
// ============================================================


/**
 * Transforme une valeur en tableau.
 *
 * Accepte :
 *
 * ["a", "b"]
 *
 * ou
 *
 * '["a", "b"]'
 */
function parseArray(value) {

  if (
    value === undefined ||
    value === null ||
    value === ''
  ) {
    return [];
  }

  if (Array.isArray(value)) {
    return value;
  }

  try {

    const parsed = JSON.parse(value);

    return Array.isArray(parsed)
      ? parsed
      : [];

  } catch (error) {

    return [];

  }
}


/**
 * Transforme une valeur en nombre.
 */
function parseNumber(value) {

  if (
    value === undefined ||
    value === null ||
    value === ''
  ) {
    return undefined;
  }

  const number = Number(value);

  return Number.isNaN(number)
    ? undefined
    : number;
}


/**
 * Supprime les fichiers uploadés
 * lorsqu'une opération échoue.
 */
function deleteUploadedFiles(files) {

  if (!Array.isArray(files)) {
    return;
  }

  files.forEach((file) => {

    try {

      if (
        file?.path &&
        fs.existsSync(file.path)
      ) {

        fs.unlinkSync(file.path);

      }

    } catch (error) {

      console.error(
        '⚠️ Impossible de supprimer le fichier :',
        file?.path,
        error.message
      );

    }

  });
}


/**
 * Récupère les vues envoyées par Angular.
 *
 * Formats acceptés :
 *
 * vue[]
 *
 * ou
 *
 * vue = ["front", "side", ...]
 */
function parseViews(value) {

  const views = parseArray(value);

  if (views.length > 0) {
    return views;
  }

  return [];
}


/**
 * Transforme une valeur en booléen.
 */
function parseBoolean(value) {

  if (
    value === true ||
    value === 'true' ||
    value === '1' ||
    value === 1
  ) {
    return true;
  }

  return false;
}


/**
 * Nettoie une chaîne.
 */
function parseString(value) {

  if (
    value === undefined ||
    value === null
  ) {
    return undefined;
  }

  return String(value).trim();
}


// ============================================================
// 🌱 CRÉER UNE PLANTE
// ============================================================

const createPlant = async (req, res) => {

  let files = [];

  try {

    // ========================================================
    // 📸 RÉCUPÉRATION DES IMAGES
    // ========================================================

    files = Array.isArray(req.files)
      ? req.files
      : [];


    // ========================================================
    // 🚨 EXACTEMENT 5 IMAGES
    // ========================================================

    if (files.length !== MAX_PLANT_IMAGES) {

      deleteUploadedFiles(files);

      return res.status(400).json({

        success: false,

        message:
          `Une plante doit posséder exactement ${MAX_PLANT_IMAGES} photos.`,

        count: files.length,

        required: MAX_PLANT_IMAGES

      });

    }


    // ========================================================
    // 👁️ RÉCUPÉRATION DES VUES
    // ========================================================

    let views = parseViews(req.body.vue);


    /**
     * Si aucune vue n'est envoyée,
     * on utilise automatiquement les 5 vues.
     */

    if (views.length === 0) {

      views = [
        ...DEFAULT_VIEWS
      ];

    }


    // ========================================================
    // 🚨 EXACTEMENT 5 VUES
    // ========================================================

    if (
      views.length !== MAX_PLANT_IMAGES
    ) {

      deleteUploadedFiles(files);

      return res.status(400).json({

        success: false,

        message:
          `Il faut définir exactement ${MAX_PLANT_IMAGES} vues pour les photos.`,

        count: views.length,

        required: MAX_PLANT_IMAGES

      });

    }


    // ========================================================
    // 🚨 VÉRIFICATION DES VUES
    // ========================================================

    const invalidViews = views.filter(
      (view) => !ALLOWED_VIEWS.includes(view)
    );


    if (invalidViews.length > 0) {

      deleteUploadedFiles(files);

      return res.status(400).json({

        success: false,

        message:
          'Une ou plusieurs vues sont invalides.',

        invalidViews,

        allowedViews:
          ALLOWED_VIEWS

      });

    }


    // ========================================================
    // 🚨 UNE SEULE PHOTO PAR VUE
    // ========================================================

    const uniqueViews = new Set(views);


    if (
      uniqueViews.size !== MAX_PLANT_IMAGES
    ) {

      deleteUploadedFiles(files);

      return res.status(400).json({

        success: false,

        message:
          'Chaque photo doit correspondre à une vue différente.'

      });

    }


    // ========================================================
    // 🖼️ CONSTRUCTION DES IMAGES
    // ========================================================

    const images = files.map(
      (file, index) => {

        return {

          url:
            `/uploads/plants/${file.filename}`,

          vue:
            views[index]

        };

      }
    );


    // ========================================================
    // 🎨 COULEURS PRINCIPALES
    // ========================================================

    const couleursPrincipal =
      parseArray(
        req.body.couleursPrincipal
      );


    // ========================================================
    // 💬 RETOURS
    // ========================================================

    /**
     * Les retours peuvent être envoyés
     * lors de la création.
     *
     * Exemple :
     *
     * retour:
     * [
     *   {
     *     nom: "Paul",
     *     note: 5,
     *     commentaire: "Très belle plante."
     *   }
     * ]
     *
     * Mais normalement il est préférable
     * de les ajouter via addPlantRetour().
     */

    const retour =
      parseArray(
        req.body.retour
      );


    // ========================================================
    // 🌱 CRÉATION DE LA PLANTE
    // ========================================================

    const plant = await Plant.create({

      // ------------------------------------------------------
      // 🌿 IDENTITÉ
      // ------------------------------------------------------

      nomCommun:
        parseString(
          req.body.nomCommun
        ),

      nomScientifique:
        parseString(
          req.body.nomScientifique
        ),

      famille:
        parseString(
          req.body.famille
        ),


      // ------------------------------------------------------
      // 📝 DESCRIPTION
      // ------------------------------------------------------

      description:
        parseString(
          req.body.description
        ),


      // ------------------------------------------------------
      // 🌍 ORIGINE
      // ------------------------------------------------------

      origine:
        parseString(
          req.body.origine
        ),


      // ------------------------------------------------------
      // 🖼️ 5 IMAGES
      // ------------------------------------------------------

      images,


      // ------------------------------------------------------
      // 🎨 COULEURS PRINCIPALES
      // ------------------------------------------------------

      couleursPrincipal,


      // ------------------------------------------------------
      // 🌸 FLORAISON
      // ------------------------------------------------------

      periodeFloraison:
        parseString(
          req.body.periodeFloraison
        ),


      // ------------------------------------------------------
      // 🍎 RÉCOLTE
      // ------------------------------------------------------

      periodeRecolte:
        parseString(
          req.body.periodeRecolte
        ),


      // ------------------------------------------------------
      // 🔄 CYCLE
      // ------------------------------------------------------

      cycle:
        parseString(
          req.body.cycle
        ),


      // ------------------------------------------------------
      // ☀️ EXPOSITION
      // ------------------------------------------------------

      exposition:
        parseString(
          req.body.exposition
        ),


      // ------------------------------------------------------
      // 💧 ARROSAGE
      // ------------------------------------------------------

      arrosage:
        parseString(
          req.body.arrosage
        ),


      // ------------------------------------------------------
      // 🌱 SOL
      // ------------------------------------------------------

      sol:
        parseString(
          req.body.sol
        ),


      // ------------------------------------------------------
      // 🌡️ TEMPÉRATURE
      // ------------------------------------------------------

      temperatureMin:
        parseNumber(
          req.body.temperatureMin
        ),

      temperatureMax:
        parseNumber(
          req.body.temperatureMax
        ),


      // ------------------------------------------------------
      // 💦 HUMIDITÉ
      // ------------------------------------------------------

      humidite:
        parseString(
          req.body.humidite
        ),


      // ------------------------------------------------------
      // ☠️ PARTIES DANGEREUSES
      // ------------------------------------------------------

      partiesDangereuses:
        parseString(
          req.body.partiesDangereuses
        ),


      // ------------------------------------------------------
      // 🍳 USAGE CULINAIRE
      // ------------------------------------------------------

      usageCulinaire:
        parseString(
          req.body.usageCulinaire
        ),


      // ------------------------------------------------------
      // 💬 RETOURS
      // ------------------------------------------------------

      retour

    });


    // ========================================================
    // ✅ RÉPONSE
    // ========================================================

    return res.status(201).json({

      success: true,

      message:
        'Plante créée avec succès avec ses 5 photos de référence.',

      plant

    });


  } catch (error) {

    console.error(
      '❌ Erreur création plante :',
      error
    );


    // ========================================================
    // 🧹 NETTOYAGE DES IMAGES
    // ========================================================

    deleteUploadedFiles(files);


    // ========================================================
    // 🚨 ERREUR MONGOOSE
    // ========================================================

    if (
      error.name === 'ValidationError'
    ) {

      return res.status(400).json({

        success: false,

        message:
          'Les données de la plante sont invalides.',

        errors:
          Object.values(
            error.errors
          ).map(
            (err) => err.message
          )

      });

    }


    // ========================================================
    // 🚨 ID MONGOOSE INVALIDE
    // ========================================================

    if (
      error.name === 'CastError'
    ) {

      return res.status(400).json({

        success: false,

        message:
          'Identifiant de plante invalide.'

      });

    }


    // ========================================================
    // 🚨 ERREUR GÉNÉRALE
    // ========================================================

    return res.status(500).json({

      success: false,

      message:
        'Impossible de créer la plante.',

      error:
        error.message

    });

  }

};


// ============================================================
// 🌿 RÉCUPÉRER TOUTES LES PLANTES
// ============================================================

const getPlants = async (req, res) => {

  try {

    const plants =
      await Plant
        .find()
        .sort({
          createdAt: -1
        });


    return res.status(200).json({

      success: true,

      count:
        plants.length,

      plants

    });


  } catch (error) {

    console.error(
      '❌ Erreur récupération plantes :',
      error
    );


    return res.status(500).json({

      success: false,

      message:
        'Impossible de récupérer les plantes.',

      error:
        error.message

    });

  }

};


// ============================================================
// 🌱 RÉCUPÉRER UNE PLANTE PAR ID
// ============================================================

const getPlantById = async (req, res) => {

  try {

    const plant =
      await Plant.findById(
        req.params.id
      );


    // ========================================================
    // 🚨 PLANTE INTROUVABLE
    // ========================================================

    if (!plant) {

      return res.status(404).json({

        success: false,

        message:
          'Plante introuvable.'

      });

    }


    // ========================================================
    // ✅ RÉPONSE
    // ========================================================

    return res.status(200).json({

      success: true,

      plant

    });


  } catch (error) {

    console.error(
      '❌ Erreur récupération plante :',
      error
    );


    // ========================================================
    // 🚨 ID INVALIDE
    // ========================================================

    if (
      error.name === 'CastError'
    ) {

      return res.status(400).json({

        success: false,

        message:
          'Identifiant de plante invalide.'

      });

    }


    return res.status(500).json({

      success: false,

      message:
        'Impossible de récupérer la plante.',

      error:
        error.message

    });

  }

};


// ============================================================
// 💬 AJOUTER UN RETOUR SUR UNE PLANTE
// ============================================================

const addPlantRetour = async (req, res) => {

  try {

    // ========================================================
    // 🔎 RÉCUPÉRATION DE LA PLANTE
    // ========================================================

    const plant =
      await Plant.findById(
        req.params.id
      );


    if (!plant) {

      return res.status(404).json({

        success: false,

        message:
          'Plante introuvable.'

      });

    }


    // ========================================================
    // 👤 NOM
    // ========================================================

    const nom =
      parseString(
        req.body.nom
      ) || 'Utilisateur';


    // ========================================================
    // ⭐ NOTE
    // ========================================================

    const note =
      parseNumber(
        req.body.note
      );


    if (
      note === undefined ||
      note < 1 ||
      note > 5
    ) {

      return res.status(400).json({

        success: false,

        message:
          'La note doit être comprise entre 1 et 5.'

      });

    }


    // ========================================================
    // 💬 COMMENTAIRE
    // ========================================================

    const commentaire =
      parseString(
        req.body.commentaire
      );


    if (!commentaire) {

      return res.status(400).json({

        success: false,

        message:
          'Le commentaire est obligatoire.'

      });

    }


    // ========================================================
    // ➕ AJOUT DU RETOUR
    // ========================================================

    plant.retour.push({

      nom,

      note,

      commentaire,

      date:
        new Date()

    });


    // ========================================================
    // 💾 SAUVEGARDE
    // ========================================================

    await plant.save();


    // ========================================================
    // ✅ RÉPONSE
    // ========================================================

    return res.status(201).json({

      success: true,

      message:
        'Votre retour a été ajouté avec succès.',

      retour:
        plant.retour[
          plant.retour.length - 1
        ],

      plant

    });


  } catch (error) {

    console.error(
      '❌ Erreur ajout retour :',
      error
    );


    if (
      error.name === 'ValidationError'
    ) {

      return res.status(400).json({

        success: false,

        message:
          'Le retour est invalide.',

        errors:
          Object.values(
            error.errors
          ).map(
            (err) => err.message
          )

      });

    }


    if (
      error.name === 'CastError'
    ) {

      return res.status(400).json({

        success: false,

        message:
          'Identifiant de plante invalide.'

      });

    }


    return res.status(500).json({

      success: false,

      message:
        'Impossible d’ajouter le retour.',

      error:
        error.message

    });

  }

};


// ============================================================
// 🔎 IDENTIFIER UNE PLANTE
// ============================================================
//
// IMPORTANT
// ------------------------------------------------------------
// Il n'y a volontairement PAS de PlantNet API.
//
// L'identification de JardiScan est effectuée localement
// dans Angular.
//
// Le serveur conserve cet endpoint afin de ne pas casser
// les routes existantes.
//
// ============================================================

const identifyPlant = async (req, res) => {

  let file = null;

  try {

    // ========================================================
    // 📸 RÉCUPÉRATION DE L'IMAGE
    // ========================================================

    file = req.file;


    if (!file) {

      return res.status(400).json({

        success: false,

        message:
          'Aucune image reçue pour identification.'

      });

    }


    console.log(
      '🔎 Image reçue pour identification locale :',
      file.path
    );


    // ========================================================
    // 🌱 RÉCUPÉRATION DES PLANTES
    // ========================================================
    //
    // On récupère uniquement les données nécessaires
    // à la comparaison locale dans Angular.
    //
    // ========================================================

    const plants =
      await Plant
        .find()
        .select(
          [
            'nomCommun',
            'nomScientifique',
            'famille',
            'description',
            'origine',
            'images',
            'couleursPrincipal',
            'periodeFloraison',
            'periodeRecolte',
            'cycle',
            'exposition',
            'arrosage',
            'sol',
            'temperatureMin',
            'temperatureMax',
            'humidite',
            'partiesDangereuses',
            'usageCulinaire',
            'retour'
          ].join(' ')
        )
        .sort({
          createdAt: -1
        });


    // ========================================================
    // ℹ️ IDENTIFICATION LOCALE
    // ========================================================
    //
    // Le serveur ne fait aucune reconnaissance IA.
    //
    // Angular récupère les plantes et leurs 5 images
    // puis effectue la comparaison directement
    // dans le navigateur.
    //
    // Aucun service externe.
    // Aucun abonnement.
    // Aucune clé API.
    //
    // ========================================================


    return res.status(200).json({

      success: true,

      local: true,

      message:
        'Image reçue. L’identification est effectuée localement dans JardiScan.',

      imageUrl:
        `/uploads/plants/${file.filename}`,

      count:
        plants.length,

      plants

    });


  } catch (error) {

    console.error(
      '❌ Erreur identification locale :',
      error
    );


    // ========================================================
    // 🧹 SUPPRESSION DE L'IMAGE TEMPORAIRE
    // ========================================================

    try {

      if (
        file?.path &&
        fs.existsSync(file.path)
      ) {

        fs.unlinkSync(file.path);

      }

    } catch (deleteError) {

      console.error(
        '⚠️ Impossible de supprimer l’image temporaire :',
        deleteError.message
      );

    }


    return res.status(500).json({

      success: false,

      message:
        'Impossible de préparer l’identification locale.',

      error:
        error.message

    });

  }

};


// ============================================================
// 📊 RÉCUPÉRER LES RETOURS D'UNE PLANTE
// ============================================================

const getPlantRetours = async (req, res) => {

  try {

    const plant =
      await Plant
        .findById(
          req.params.id
        )
        .select(
          'nomCommun retour'
        );


    if (!plant) {

      return res.status(404).json({

        success: false,

        message:
          'Plante introuvable.'

      });

    }


    return res.status(200).json({

      success: true,

      count:
        plant.retour.length,

      retours:
        plant.retour

    });


  } catch (error) {

    console.error(
      '❌ Erreur récupération retours :',
      error
    );


    if (
      error.name === 'CastError'
    ) {

      return res.status(400).json({

        success: false,

        message:
          'Identifiant de plante invalide.'

      });

    }


    return res.status(500).json({

      success: false,

      message:
        'Impossible de récupérer les retours.',

      error:
        error.message

    });

  }

};


// ============================================================
// 📤 EXPORTS
// ============================================================

module.exports = {

  createPlant,

  getPlants,

  getPlantById,

  identifyPlant,

  addPlantRetour,

  getPlantRetours

};
