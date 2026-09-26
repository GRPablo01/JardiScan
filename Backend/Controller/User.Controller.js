const bcrypt = require('bcrypt');
const crypto = require('crypto');

const Utilisateur = require('../Schema/User');


// =====================================================
// ⚙️ CONFIGURATION
// =====================================================

const RESET_PASSWORD_EXPIRATION_MINUTES = 15;


// =====================================================
// 🔑 GÉNÉRATION ALÉATOIRE DE SUFFIXE
// =====================================================

function randomSuffix(length = 5) {

  const chars =
    'ABCDEFGHIJKLMNOPQRSTUVWXYZ';

  let result = '';

  for (let i = 0; i < length; i++) {

    result += chars.charAt(
      Math.floor(
        Math.random() * chars.length
      )
    );
  }

  return result;
}


// =====================================================
// 🔑 GÉNÉRER UNE KEY UTILISATEUR
//
// Format : 12345ABCDE
// =====================================================

function generateKey() {

  const numberPart =
    Math.floor(
      Math.random() * 100000
    );

  const suffix =
    randomSuffix(5);

  return `${numberPart}${suffix}`;
}


// =====================================================
// 🔐 GÉNÉRER UNE CLÉ RESET PASSWORD
// =====================================================

function generateResetPasswordKey() {

  return crypto
    .randomBytes(32)
    .toString('hex');
}


// =====================================================
// 🧹 DONNÉES UTILISATEUR SÉCURISÉES
//
// Ne jamais renvoyer :
// - motDePasse
// - resetPasswordKey
// - resetPasswordExpire
//
// Le JardiDex est volontairement inclus.
// =====================================================

function construireUtilisateurResponse(utilisateur) {

  return {

    _id: utilisateur._id,

    key: utilisateur.key,

    pseudo: utilisateur.pseudo,

    nom: utilisateur.nom,

    prenom: utilisateur.prenom,

    email: utilisateur.email,

    avatar: utilisateur.avatar,

    role: utilisateur.role,

    estActif: utilisateur.estActif,

    jardiDex: Array.isArray(
      utilisateur.jardiDex
    )
      ? utilisateur.jardiDex
      : [],

    createdAt: utilisateur.createdAt,

    updatedAt: utilisateur.updatedAt

  };
}


// =====================================================
// 🌿 RÉCUPÉRER L'ID UTILISATEUR
//
// Accepte plusieurs formats afin de rester compatible
// avec ton frontend actuel.
//
// Priorité :
//
// 1. req.params.userId
// 2. req.params.id
// 3. req.headers['x-user']
// 4. req.body.userId
// 5. req.body.utilisateurId
// 6. req.body.utilisateur
//
// =====================================================

function recupererIdUtilisateur(req) {

  const paramUserId =
    req.params?.userId;

  if (paramUserId) {

    return String(
      paramUserId
    );
  }


  const paramId =
    req.params?.id;

  if (paramId) {

    return String(
      paramId
    );
  }


  const headerUser =
    req.headers?.['x-user'];

  if (headerUser) {

    return String(
      headerUser
    );
  }


  const bodyUserId =
    req.body?.userId;

  if (bodyUserId) {

    return String(
      bodyUserId
    );
  }


  const bodyUtilisateurId =
    req.body?.utilisateurId;

  if (bodyUtilisateurId) {

    return String(
      bodyUtilisateurId
    );
  }


  const bodyUtilisateur =
    req.body?.utilisateur;

  if (bodyUtilisateur) {

    if (
      typeof bodyUtilisateur === 'object'
    ) {

      return String(
        bodyUtilisateur._id ??
        bodyUtilisateur.id ??
        ''
      );
    }

    return String(
      bodyUtilisateur
    );
  }


  return '';
}


// =====================================================
// 🌿 NORMALISER UNE ENTRÉE JARDIDEX
//
// Permet de supporter les éventuels anciens formats.
//
// Ancien :
//
// "665abc..."
//
// Objet :
//
// {
//   plante: "665abc..."
// }
//
// Nouveau :
//
// {
//   plante: "665abc...",
//   numero: 12,
//   quantite: 2
// }
//
// =====================================================

function recupererIdPlanteJardiDex(entree) {

  if (
    typeof entree === 'string'
  ) {

    return String(
      entree
    );
  }


  if (
    entree &&
    typeof entree === 'object'
  ) {

    return String(

      entree.plante?._id ??
      entree.plante ??
      entree._id ??
      entree.id ??
      entree.key ??
      ''

    );
  }


  return '';
}


// =====================================================
// 📝 CRÉER UN UTILISATEUR
//
// POST /api/users/register
// =====================================================

const inscrire = async (req, res) => {

  try {

    const {

      pseudo,

      nom,

      prenom,

      email,

      motDePasse,

      role

    } = req.body || {};


    // =====================================================
    // 🖼️ AVATAR
    // =====================================================

    const avatarPath = req.file

      ? `/uploads/users/${req.file.filename}`

      : '';


    // =====================================================
    // LOGS
    // =====================================================

    console.log('');

    console.log(
      '========================================'
    );

    console.log(
      '👤 INSCRIPTION'
    );

    console.log(
      '========================================'
    );

    console.log(
      '📧 Email :',
      email
    );

    console.log(
      '👤 Pseudo :',
      pseudo
    );

    console.log(
      '🖼️ Avatar :',
      req.file
        ? req.file.filename
        : 'Aucun'
    );

    console.log(
      '========================================'
    );


    // =====================================================
    // VÉRIFICATION CHAMPS
    // =====================================================

    if (
      !pseudo ||
      !nom ||
      !prenom ||
      !email ||
      !motDePasse
    ) {

      return res.status(400).json({

        message:
          'Tous les champs obligatoires doivent être remplis.'

      });
    }


    // =====================================================
    // MOT DE PASSE MINIMUM
    // =====================================================

    if (
      motDePasse.length < 6
    ) {

      return res.status(400).json({

        message:
          'Le mot de passe doit contenir au moins 6 caractères.'

      });
    }


    // =====================================================
    // NORMALISATION
    // =====================================================

    const pseudoNormalise =
      pseudo.trim();

    const emailNormalise =
      email
        .trim()
        .toLowerCase();


    // =====================================================
    // EMAIL EXISTANT
    // =====================================================

    const utilisateurExistant =
      await Utilisateur.findOne({

        email:
          emailNormalise

      });


    if (
      utilisateurExistant
    ) {

      return res.status(409).json({

        message:
          'Cette adresse email est déjà utilisée.'

      });
    }


    // =====================================================
    // PSEUDO EXISTANT
    // =====================================================

    const pseudoExistant =
      await Utilisateur.findOne({

        pseudo:
          pseudoNormalise

      });


    if (
      pseudoExistant
    ) {

      return res.status(409).json({

        message:
          'Ce pseudo est déjà utilisé.'

      });
    }


    // =====================================================
    // RÔLE
    // =====================================================

    const rolesAutorises = [

      'VISITEUR',

      'PROFESSIONNEL',

      'MODERATEUR',

      'ADMIN'

    ];


    const roleSelectionne =
      role || 'VISITEUR';


    if (
      !rolesAutorises.includes(
        roleSelectionne
      )
    ) {

      return res.status(400).json({

        message:
          'Le rôle sélectionné est invalide.'

      });
    }


    // =====================================================
    // 🔐 HACHAGE MOT DE PASSE
    // =====================================================

    const motDePasseHash =
      await bcrypt.hash(

        motDePasse,

        10

      );


    // =====================================================
    // 🔑 GÉNÉRATION KEY UNIQUE
    // =====================================================

    let keyUnique;

    let keyExiste = true;


    while (keyExiste) {

      keyUnique =
        generateKey();


      const utilisateurAvecCetteKey =
        await Utilisateur.findOne({

          key:
            keyUnique

        });


      keyExiste =
        !!utilisateurAvecCetteKey;
    }


    // =====================================================
    // 🔐 RESET PASSWORD
    // =====================================================

    const resetPasswordKey =
      null;

    const resetPasswordExpire =
      null;


    // =====================================================
    // 👤 CRÉATION UTILISATEUR
    //
    // Le JardiDex commence vide.
    // =====================================================

    const utilisateur =
      await Utilisateur.create({

        key:
          keyUnique,

        pseudo:
          pseudoNormalise,

        nom:
          nom.trim(),

        prenom:
          prenom.trim(),

        email:
          emailNormalise,

        motDePasse:
          motDePasseHash,

        resetPasswordKey,

        resetPasswordExpire,

        avatar:
          avatarPath,

        role:
          roleSelectionne,

        estActif:
          true,

        jardiDex:
          []

      });


    // =====================================================
    // 📤 RÉPONSE
    // =====================================================

    const utilisateurResponse =
      construireUtilisateurResponse(
        utilisateur
      );


    return res.status(201).json({

      message:
        'Utilisateur créé avec succès.',

      utilisateur:
        utilisateurResponse

    });

  } catch (error) {

    console.error(
      'Erreur création utilisateur :',
      error
    );


    // =====================================================
    // DUPLICATION MONGODB
    // =====================================================

    if (
      error.code === 11000
    ) {

      return res.status(409).json({

        message:
          'Un utilisateur avec cet email, ce pseudo ou cette key existe déjà.'

      });
    }


    // =====================================================
    // ERREUR SERVEUR
    // =====================================================

    return res.status(500).json({

      message:
        'Erreur serveur lors de la création de l’utilisateur.'

    });
  }
};


// =====================================================
// 🔐 CONNECTER UN UTILISATEUR
//
// POST /api/users/login
// =====================================================

const connecter = async (req, res) => {

  try {

    const {

      email,

      motDePasse

    } = req.body || {};


    // =====================================================
    // VÉRIFICATION
    // =====================================================

    if (
      !email ||
      !motDePasse
    ) {

      return res.status(400).json({

        message:
          'L’adresse email et le mot de passe sont obligatoires.'

      });
    }


    // =====================================================
    // NORMALISATION EMAIL
    // =====================================================

    const emailNormalise =
      email
        .trim()
        .toLowerCase();


    // =====================================================
    // 🔎 RECHERCHE UTILISATEUR
    // =====================================================

    const utilisateur =
      await Utilisateur

        .findOne({

          email:
            emailNormalise

        })

        .select('+motDePasse');


    // =====================================================
    // UTILISATEUR INTROUVABLE
    // =====================================================

    if (
      !utilisateur
    ) {

      return res.status(401).json({

        message:
          'Adresse email ou mot de passe incorrect.'

      });
    }


    // =====================================================
    // HASH ABSENT
    // =====================================================

    if (
      !utilisateur.motDePasse
    ) {

      console.error(
        'Hash du mot de passe absent pour :',
        utilisateur.email
      );


      return res.status(500).json({

        message:
          'Le compte utilisateur ne possède pas de mot de passe valide.'

      });
    }


    // =====================================================
    // COMPTE DÉSACTIVÉ
    // =====================================================

    if (
      utilisateur.estActif === false
    ) {

      return res.status(403).json({

        message:
          'Votre compte est désactivé.'

      });
    }


    // =====================================================
    // 🔐 COMPARAISON PASSWORD
    // =====================================================

    const motDePasseValide =
      await bcrypt.compare(

        motDePasse,

        utilisateur.motDePasse

      );


    if (
      !motDePasseValide
    ) {

      return res.status(401).json({

        message:
          'Adresse email ou mot de passe incorrect.'

      });
    }


    // =====================================================
    // 📤 RÉPONSE
    //
    // Le JardiDex est maintenant renvoyé au frontend.
    // =====================================================

    const utilisateurResponse =
      construireUtilisateurResponse(
        utilisateur
      );


    return res.status(200).json({

      message:
        'Connexion réussie.',

      utilisateur:
        utilisateurResponse

    });

  } catch (error) {

    console.error(
      'Erreur connexion utilisateur :',
      error
    );


    return res.status(500).json({

      message:
        'Erreur serveur lors de la connexion.'

    });
  }
};


// =====================================================
// 👥 RÉCUPÉRER TOUS LES UTILISATEURS
// =====================================================

const obtenirUtilisateurs = async (
  req,
  res
) => {

  try {

    const utilisateurs =
      await Utilisateur

        .find()

        .select(
          '-motDePasse -resetPasswordKey -resetPasswordExpire'
        )

        .sort({

          createdAt:
            -1

        });


    return res.status(200).json({

      nombre:
        utilisateurs.length,

      utilisateurs

    });

  } catch (error) {

    console.error(
      'Erreur récupération utilisateurs :',
      error
    );


    return res.status(500).json({

      message:
        'Erreur serveur lors de la récupération des utilisateurs.'

    });
  }
};


// =====================================================
// 👤 RÉCUPÉRER UN UTILISATEUR PAR ID
// =====================================================

const obtenirUtilisateurParId = async (
  req,
  res
) => {

  try {

    const utilisateur =
      await Utilisateur

        .findById(
          req.params.id
        )

        .select(
          '-motDePasse -resetPasswordKey -resetPasswordExpire'
        );


    if (
      !utilisateur
    ) {

      return res.status(404).json({

        message:
          'Utilisateur introuvable.'

      });
    }


    return res.status(200).json({

      utilisateur

    });

  } catch (error) {

    console.error(
      'Erreur récupération utilisateur :',
      error
    );


    // =====================================================
    // ID MONGODB INVALIDE
    // =====================================================

    if (
      error.name === 'CastError'
    ) {

      return res.status(400).json({

        message:
          'Identifiant utilisateur invalide.'

      });
    }


    return res.status(500).json({

      message:
        'Erreur serveur lors de la récupération de l’utilisateur.'

    });
  }
};


// =====================================================
// 🌿 RÉCUPÉRER LE JARDIDEX D'UN UTILISATEUR
//
// GET /api/users/:id/jardidex
//
// =====================================================

const obtenirJardiDex = async (
  req,
  res
) => {

  try {

    const utilisateurId =
      recupererIdUtilisateur(req);


    if (!utilisateurId) {

      return res.status(400).json({

        success: false,

        message:
          'Identifiant utilisateur obligatoire.'

      });
    }


    const utilisateur =
      await Utilisateur

        .findById(
          utilisateurId
        )

        .populate(
          'jardiDex.plante'
        )

        .select(
          '_id pseudo jardiDex'
        );


    if (
      !utilisateur
    ) {

      return res.status(404).json({

        success: false,

        message:
          'Utilisateur introuvable.'

      });
    }


    return res.status(200).json({

      success: true,

      nombre:
        Array.isArray(
          utilisateur.jardiDex
        )
          ? utilisateur.jardiDex.length
          : 0,

      jardiDex:
        utilisateur.jardiDex || []

    });

  } catch (error) {

    console.error(
      'Erreur récupération JardiDex :',
      error
    );


    if (
      error.name === 'CastError'
    ) {

      return res.status(400).json({

        success: false,

        message:
          'Identifiant utilisateur invalide.'

      });
    }


    return res.status(500).json({

      success: false,

      message:
        'Erreur serveur lors de la récupération du JardiDex.'

    });
  }
};


// =====================================================
// 🌱 AJOUTER UNE PLANTE AU JARDIDEX
//
// POST /api/users/:id/jardidex
//
// Body :
//
// {
//   "plante": "ID_MONGO_PLANTE",
//   "numero": 12
// }
//
// Si la plante existe déjà :
//
// quantite + 1
//
// Sinon :
//
// création avec quantite = 1
//
// =====================================================

const ajouterPlanteJardiDex = async (
  req,
  res
) => {

  try {

    const utilisateurId =
      recupererIdUtilisateur(req);


    if (!utilisateurId) {

      return res.status(400).json({

        success: false,

        message:
          'Identifiant utilisateur obligatoire.'

      });
    }


    // =====================================================
    // 🌱 ID PLANTE
    // =====================================================

    const planteId =
      req.body?.plante ??
      req.body?.planteId;


    if (!planteId) {

      return res.status(400).json({

        success: false,

        message:
          'Identifiant de la plante obligatoire.'

      });
    }


    // =====================================================
    // 🔢 NUMÉRO PLANTE
    // =====================================================

    let numero =
      null;


    if (
      req.body?.numero !== undefined &&
      req.body?.numero !== null &&
      !Number.isNaN(
        Number(req.body.numero)
      )
    ) {

      numero =
        Number(req.body.numero);
    }


    // =====================================================
    // 👤 UTILISATEUR
    // =====================================================

    const utilisateur =
      await Utilisateur.findById(
        utilisateurId
      );


    if (
      !utilisateur
    ) {

      return res.status(404).json({

        success: false,

        message:
          'Utilisateur introuvable.'

      });
    }


    // =====================================================
    // 🌿 INITIALISER JARDIDEX
    // =====================================================

    if (
      !Array.isArray(
        utilisateur.jardiDex
      )
    ) {

      utilisateur.jardiDex = [];
    }


    // =====================================================
    // 🔎 CHERCHER LA PLANTE
    // =====================================================

    const index =
      utilisateur.jardiDex.findIndex(

        entree => {

          const id =
            recupererIdPlanteJardiDex(
              entree
            );

          return (
            id === String(planteId)
          );
        }
      );


    // =====================================================
    // 🌱 PLANTE DÉJÀ PRÉSENTE
    // =====================================================

    if (
      index !== -1
    ) {

      const entree =
        utilisateur.jardiDex[index];


      // ---------------------------------------------------
      // Quantité actuelle
      // ---------------------------------------------------

      const quantiteActuelle =
        Number(
          entree.quantite
        ) || 1;


      // ---------------------------------------------------
      // +1
      // ---------------------------------------------------

      entree.quantite =
        quantiteActuelle + 1;


      // ---------------------------------------------------
      // Si le numéro n'était pas présent,
      // on le complète.
      // ---------------------------------------------------

      if (
        (
          entree.numero === undefined ||
          entree.numero === null
        ) &&
        numero !== null
      ) {

        entree.numero =
          numero;
      }


      await utilisateur.save();


      return res.status(200).json({

        success: true,

        message:
          'Plante ajoutée au JardiDex.',

        action:
          'increment',

        jardiDexEntry:
          entree,

        utilisateur:
          construireUtilisateurResponse(
            utilisateur
          )

      });
    }


    // =====================================================
    // 🌱 NOUVELLE PLANTE
    // =====================================================

    const nouvelleEntree = {

      plante:
        planteId,

      numero:
        numero,

      quantite:
        1,

      dateDecouverte:
        new Date(),

      favorite:
        false

    };


    utilisateur.jardiDex.push(
      nouvelleEntree
    );


    await utilisateur.save();


    // =====================================================
    // 📤 RÉPONSE
    // =====================================================

    const entreeAjoutee =
      utilisateur.jardiDex[
        utilisateur.jardiDex.length - 1
      ];


    return res.status(201).json({

      success: true,

      message:
        'Plante ajoutée au JardiDex.',

      action:
        'create',

      jardiDexEntry:
        entreeAjoutee,

      utilisateur:
        construireUtilisateurResponse(
          utilisateur
        )

    });

  } catch (error) {

    console.error(
      'Erreur ajout plante JardiDex :',
      error
    );


    if (
      error.name === 'CastError'
    ) {

      return res.status(400).json({

        success: false,

        message:
          'Identifiant utilisateur ou plante invalide.'

      });
    }


    return res.status(500).json({

      success: false,

      message:
        'Erreur serveur lors de l’ajout de la plante au JardiDex.'

    });
  }
};


// =====================================================
// 🌱 RETIRER UNE PLANTE DU JARDIDEX
//
// DELETE /api/users/:id/jardidex/:planteId
//
// Comportement :
//
// quantite 3 → 2
// quantite 2 → 1
// quantite 1 → suppression de l'entrée
//
// =====================================================

const retirerPlanteJardiDex = async (
  req,
  res
) => {

  try {

    const utilisateurId =
      recupererIdUtilisateur(req);


    const planteId =
      req.params?.planteId ??
      req.body?.plante ??
      req.body?.planteId;


    if (!utilisateurId) {

      return res.status(400).json({

        success: false,

        message:
          'Identifiant utilisateur obligatoire.'

      });
    }


    if (!planteId) {

      return res.status(400).json({

        success: false,

        message:
          'Identifiant de la plante obligatoire.'

      });
    }


    // =====================================================
    // 👤 UTILISATEUR
    // =====================================================

    const utilisateur =
      await Utilisateur.findById(
        utilisateurId
      );


    if (
      !utilisateur
    ) {

      return res.status(404).json({

        success: false,

        message:
          'Utilisateur introuvable.'

      });
    }


    // =====================================================
    // 🔎 TROUVER LA PLANTE
    // =====================================================

    const index =
      utilisateur.jardiDex.findIndex(

        entree => {

          return (
            recupererIdPlanteJardiDex(
              entree
            ) === String(planteId)
          );
        }
      );


    // =====================================================
    // PLANTE ABSENTE
    // =====================================================

    if (
      index === -1
    ) {

      return res.status(404).json({

        success: false,

        message:
          'Cette plante n’est pas présente dans le JardiDex.'

      });
    }


    const entree =
      utilisateur.jardiDex[index];


    // =====================================================
    // 🔢 QUANTITÉ
    // =====================================================

    const quantiteActuelle =
      Number(
        entree.quantite
      ) || 1;


    // =====================================================
    // PLUS D'UNE PLANTE
    // =====================================================

    if (
      quantiteActuelle > 1
    ) {

      entree.quantite =
        quantiteActuelle - 1;


      await utilisateur.save();


      return res.status(200).json({

        success: true,

        message:
          'Quantité de la plante diminuée.',

        action:
          'decrement',

        jardiDexEntry:
          entree,

        utilisateur:
          construireUtilisateurResponse(
            utilisateur
          )

      });
    }


    // =====================================================
    // QUANTITÉ = 1
    //
    // On supprime complètement l'entrée.
    // =====================================================

    utilisateur.jardiDex.splice(
      index,
      1
    );


    await utilisateur.save();


    return res.status(200).json({

      success: true,

      message:
        'Plante retirée du JardiDex.',

      action:
        'delete',

      jardiDexEntry:
        null,

      utilisateur:
        construireUtilisateurResponse(
          utilisateur
        )

    });

  } catch (error) {

    console.error(
      'Erreur retrait plante JardiDex :',
      error
    );


    if (
      error.name === 'CastError'
    ) {

      return res.status(400).json({

        success: false,

        message:
          'Identifiant utilisateur ou plante invalide.'

      });
    }


    return res.status(500).json({

      success: false,

      message:
        'Erreur serveur lors du retrait de la plante du JardiDex.'

    });
  }
};


// =====================================================
// ⭐ MODIFIER FAVORI JARDIDEX
//
// PATCH /api/users/:id/jardidex/:planteId/favorite
//
// Body :
//
// {
//   "favorite": true
// }
//
// =====================================================

const modifierFavoriteJardiDex = async (
  req,
  res
) => {

  try {

    const utilisateurId =
      recupererIdUtilisateur(req);


    const planteId =
      req.params?.planteId;


    if (!utilisateurId) {

      return res.status(400).json({

        success: false,

        message:
          'Identifiant utilisateur obligatoire.'

      });
    }


    if (!planteId) {

      return res.status(400).json({

        success: false,

        message:
          'Identifiant de la plante obligatoire.'

      });
    }


    const utilisateur =
      await Utilisateur.findById(
        utilisateurId
      );


    if (
      !utilisateur
    ) {

      return res.status(404).json({

        success: false,

        message:
          'Utilisateur introuvable.'

      });
    }


    const entree =
      utilisateur.jardiDex.find(

        item => {

          return (
            recupererIdPlanteJardiDex(
              item
            ) === String(planteId)
          );
        }
      );


    if (!entree) {

      return res.status(404).json({

        success: false,

        message:
          'Cette plante n’est pas présente dans le JardiDex.'

      });
    }


    entree.favorite =
      Boolean(
        req.body?.favorite
      );


    await utilisateur.save();


    return res.status(200).json({

      success: true,

      message:
        'Favori du JardiDex mis à jour.',

      jardiDexEntry:
        entree,

      utilisateur:
        construireUtilisateurResponse(
          utilisateur
        )

    });

  } catch (error) {

    console.error(
      'Erreur modification favori JardiDex :',
      error
    );


    return res.status(500).json({

      success: false,

      message:
        'Erreur serveur lors de la modification du favori.'

    });
  }
};


// =====================================================
// 🔐 GÉNÉRER UNE CLÉ RESET PASSWORD
//
// POST /api/users/reset-password
// =====================================================

const genererResetPasswordKey = async (
  req,
  res
) => {

  try {

    const {
      email
    } = req.body || {};


    // =====================================================
    // VÉRIFICATION EMAIL
    // =====================================================

    if (!email) {

      return res.status(400).json({

        message:
          'L’adresse email est obligatoire.'

      });
    }


    // =====================================================
    // NORMALISATION
    // =====================================================

    const emailNormalise =
      email
        .trim()
        .toLowerCase();


    // =====================================================
    // RECHERCHE UTILISATEUR
    // =====================================================

    const utilisateur =
      await Utilisateur.findOne({

        email:
          emailNormalise

      });


    if (!utilisateur) {

      return res.status(404).json({

        message:
          'Aucun utilisateur ne possède cette adresse email.'

      });
    }


    // =====================================================
    // COMPTE DÉSACTIVÉ
    // =====================================================

    if (
      utilisateur.estActif === false
    ) {

      return res.status(403).json({

        message:
          'Votre compte est désactivé.'

      });
    }


    // =====================================================
    // 🔐 GÉNÉRER CLÉ
    // =====================================================

    const resetPasswordKey =
      generateResetPasswordKey();


    // =====================================================
    // ⏱️ EXPIRATION
    // =====================================================

    const resetPasswordExpire =
      new Date(

        Date.now() +

        RESET_PASSWORD_EXPIRATION_MINUTES *
        60 *
        1000

      );


    // =====================================================
    // 💾 SAUVEGARDE
    // =====================================================

    utilisateur.resetPasswordKey =
      resetPasswordKey;

    utilisateur.resetPasswordExpire =
      resetPasswordExpire;


    await utilisateur.save();


    // =====================================================
    // LOGS
    // =====================================================

    console.log('');

    console.log(
      '========================================'
    );

    console.log(
      '🔐 RESET PASSWORD'
    );

    console.log(
      '========================================'
    );

    console.log(
      '📧 Email :',
      utilisateur.email
    );

    console.log(
      '⏰ Expiration :',
      resetPasswordExpire
    );

    console.log(
      '========================================'
    );


    // =====================================================
    // RÉPONSE
    // =====================================================

    return res.status(200).json({

      message:
        'Clé de réinitialisation générée avec succès.',

      resetPasswordKey,

      resetPasswordExpire

    });

  } catch (error) {

    console.error(
      'Erreur génération reset password :',
      error
    );


    return res.status(500).json({

      message:
        'Erreur serveur lors de la génération de la clé de réinitialisation.'

    });
  }
};


// =====================================================
// 📧 RÉCUPÉRER UTILISATEUR PAR EMAIL
//
// GET /api/users/email/:email
// =====================================================

const obtenirUtilisateurParEmail = async (
  req,
  res
) => {

  try {

    if (
      !req.params.email
    ) {

      return res.status(400).json({

        success: false,

        message:
          'L’adresse email est obligatoire.'

      });
    }


    const email =
      decodeURIComponent(
        req.params.email
      )
        .trim()
        .toLowerCase();


    console.log('');

    console.log(
      '========================================'
    );

    console.log(
      '📧 RECHERCHE UTILISATEUR PAR EMAIL'
    );

    console.log(
      '========================================'
    );

    console.log(
      '📧 Email recherché :',
      email
    );


    const utilisateur =
      await Utilisateur

        .findOne({

          email

        })

        .select(
          '-motDePasse -resetPasswordKey -resetPasswordExpire'
        );


    if (
      !utilisateur
    ) {

      return res.status(404).json({

        success: false,

        message:
          'Aucun utilisateur trouvé avec cette adresse email'

      });
    }


    return res.status(200).json({

      success: true,

      utilisateur

    });

  } catch (error) {

    console.error(
      '❌ Erreur recherche utilisateur par email :',
      error
    );


    return res.status(500).json({

      success: false,

      message:
        'Erreur serveur lors de la recherche de l’utilisateur'

    });
  }
};


// =====================================================
// 🔑 VÉRIFIER LA CLÉ DE RÉINITIALISATION
//
// POST /api/users/verify-reset-key
// =====================================================

const verifierResetPasswordKey = async (
  req,
  res
) => {

  try {

    const {

      email,

      resetPasswordKey

    } = req.body || {};


    // =====================================================
    // VÉRIFICATION DONNÉES
    // =====================================================

    if (
      !email ||
      !resetPasswordKey
    ) {

      return res.status(400).json({

        success: false,

        message:
          'Email et clé de réinitialisation requis'

      });
    }


    // =====================================================
    // NORMALISATION
    // =====================================================

    const emailNormalise =
      email
        .trim()
        .toLowerCase();


    const cleNormalisee =
      resetPasswordKey.trim();


    // =====================================================
    // 🔎 RECHERCHE
    // =====================================================

    const utilisateur =
      await Utilisateur.findOne({

        email:
          emailNormalise

      });


    if (
      !utilisateur
    ) {

      return res.status(404).json({

        success: false,

        message:
          'Utilisateur introuvable'

      });
    }


    // =====================================================
    // 🔑 CLÉ ABSENTE
    // =====================================================

    if (
      !utilisateur.resetPasswordKey
    ) {

      return res.status(400).json({

        success: false,

        message:
          'Aucune demande de réinitialisation en cours'

      });
    }


    // =====================================================
    // ⏱️ EXPIRATION ABSENTE
    // =====================================================

    if (
      !utilisateur.resetPasswordExpire
    ) {

      return res.status(400).json({

        success: false,

        message:
          'La clé de réinitialisation est invalide'

      });
    }


    // =====================================================
    // ⏱️ EXPIRATION
    // =====================================================

    if (
      new Date(
        utilisateur.resetPasswordExpire
      ).getTime() < Date.now()
    ) {

      utilisateur.resetPasswordKey =
        null;

      utilisateur.resetPasswordExpire =
        null;


      await utilisateur.save();


      return res.status(400).json({

        success: false,

        message:
          'La clé de réinitialisation a expiré'

      });
    }


    // =====================================================
    // 🔐 COMPARAISON
    // =====================================================

    if (
      utilisateur.resetPasswordKey !==
      cleNormalisee
    ) {

      return res.status(400).json({

        success: false,

        message:
          'Clé de réinitialisation incorrecte'

      });
    }


    // =====================================================
    // ✅ VALIDE
    // =====================================================

    return res.status(200).json({

      success: true,

      message:
        'Clé de réinitialisation valide'

    });

  } catch (error) {

    console.error(
      '❌ Erreur verifierResetPasswordKey :',
      error
    );


    return res.status(500).json({

      success: false,

      message:
        'Erreur serveur lors de la vérification de la clé'

    });
  }
};


// =====================================================
// 🔐 RESET PASSWORD AVEC CLÉ
//
// POST /api/users/reset-password
// =====================================================

const resetPassword = async (
  req,
  res
) => {

  try {

    const {

      email,

      resetPasswordKey,

      password

    } = req.body || {};


    // =====================================================
    // VÉRIFICATION DONNÉES
    // =====================================================

    if (
      !email ||
      !resetPasswordKey ||
      !password
    ) {

      return res.status(400).json({

        success: false,

        message:
          'Email, clé ou mot de passe manquant'

      });
    }


    // =====================================================
    // MOT DE PASSE MINIMUM
    // =====================================================

    if (
      password.length < 6
    ) {

      return res.status(400).json({

        success: false,

        message:
          'Le mot de passe doit contenir au moins 6 caractères.'

      });
    }


    // =====================================================
    // NORMALISATION
    // =====================================================

    const emailNormalise =
      email
        .trim()
        .toLowerCase();


    const cleNormalisee =
      resetPasswordKey.trim();


    // =====================================================
    // 🔎 RECHERCHE
    // =====================================================

    const utilisateur =
      await Utilisateur.findOne({

        email:
          emailNormalise

      });


    if (
      !utilisateur
    ) {

      return res.status(404).json({

        success: false,

        message:
          'Utilisateur introuvable'

      });
    }


    // =====================================================
    // 🔑 CLÉ ABSENTE
    // =====================================================

    if (
      !utilisateur.resetPasswordKey
    ) {

      return res.status(400).json({

        success: false,

        message:
          'Aucune demande de réinitialisation en cours'

      });
    }


    // =====================================================
    // ⏱️ EXPIRATION
    // =====================================================

    if (
      !utilisateur.resetPasswordExpire
    ) {

      return res.status(400).json({

        success: false,

        message:
          'La clé de réinitialisation est invalide'

      });
    }


    if (
      new Date(
        utilisateur.resetPasswordExpire
      ).getTime() < Date.now()
    ) {

      utilisateur.resetPasswordKey =
        null;

      utilisateur.resetPasswordExpire =
        null;


      await utilisateur.save();


      return res.status(400).json({

        success: false,

        message:
          'La clé de réinitialisation a expiré'

      });
    }


    // =====================================================
    // 🔐 COMPARER LA CLÉ
    // =====================================================

    if (
      utilisateur.resetPasswordKey !==
      cleNormalisee
    ) {

      return res.status(400).json({

        success: false,

        message:
          'Clé incorrecte'

      });
    }


    // =====================================================
    // 🔐 HASHER LE NOUVEAU MOT DE PASSE
    // =====================================================

    const nouveauMotDePasseHash =
      await bcrypt.hash(

        password,

        10

      );


    utilisateur.motDePasse =
      nouveauMotDePasseHash;


    // =====================================================
    // 🧹 SUPPRESSION CLÉ RESET
    // =====================================================

    utilisateur.resetPasswordKey =
      null;

    utilisateur.resetPasswordExpire =
      null;


    // =====================================================
    // 💾 SAUVEGARDE
    // =====================================================

    await utilisateur.save();


    // =====================================================
    // RÉPONSE
    // =====================================================

    return res.status(200).json({

      success: true,

      message:
        'Mot de passe modifié avec succès'

    });

  } catch (error) {

    console.error(
      '❌ ERREUR RESET PASSWORD :',
      error
    );


    return res.status(500).json({

      success: false,

      message:
        'Erreur serveur lors de la réinitialisation du mot de passe'

    });
  }
};

// =====================================================
// ✏️ MODIFIER UN UTILISATEUR
//
// PUT /api/users/:id
//
// Compatible avec :
// - _id MongoDB
// - key utilisateur
//
// Permet notamment de modifier le JardiDex,
// mais aussi les informations classiques du compte.
// =====================================================

const modifierUtilisateur = async (req, res) => {
  try {
    const identifiant = String(req.params.id || '').trim();

    if (!identifiant) {
      return res.status(400).json({
        success: false,
        message: 'Identifiant utilisateur obligatoire.'
      });
    }

    let utilisateur = null;

    // =====================================================
    // 🔎 RECHERCHE PAR ID MONGODB
    // =====================================================

    if (/^[0-9a-fA-F]{24}$/.test(identifiant)) {
      utilisateur = await Utilisateur.findById(identifiant);
    }

    // =====================================================
    // 🔎 RECHERCHE PAR KEY
    // =====================================================

    if (!utilisateur) {
      utilisateur = await Utilisateur.findOne({
        key: identifiant
      });
    }

    if (!utilisateur) {
      return res.status(404).json({
        success: false,
        message: 'Utilisateur introuvable.'
      });
    }

    const donnees = req.body || {};

    // =====================================================
    // 🌿 JARDIDEX
    // =====================================================

    if (donnees.jardiDex !== undefined) {
      if (!Array.isArray(donnees.jardiDex)) {
        return res.status(400).json({
          success: false,
          message: 'Le JardiDex doit être un tableau.'
        });
      }

      utilisateur.jardiDex = donnees.jardiDex;
    }

    // =====================================================
    // 👤 INFORMATIONS UTILISATEUR
    // =====================================================

    const champsAutorises = [
      'pseudo',
      'nom',
      'prenom',
      'email',
      'avatar',
      'role',
      'estActif'
    ];

    for (const champ of champsAutorises) {
      if (donnees[champ] !== undefined) {
        utilisateur[champ] = donnees[champ];
      }
    }

    // =====================================================
    // 📧 NORMALISATION EMAIL
    // =====================================================

    if (donnees.email !== undefined) {
      utilisateur.email = String(
        donnees.email
      )
        .trim()
        .toLowerCase();
    }

    // =====================================================
    // 👤 NORMALISATION PSEUDO
    // =====================================================

    if (donnees.pseudo !== undefined) {
      utilisateur.pseudo = String(
        donnees.pseudo
      ).trim();
    }

    // =====================================================
    // NOM / PRÉNOM
    // =====================================================

    if (donnees.nom !== undefined) {
      utilisateur.nom = String(
        donnees.nom
      ).trim();
    }

    if (donnees.prenom !== undefined) {
      utilisateur.prenom = String(
        donnees.prenom
      ).trim();
    }

    // =====================================================
    // 💾 SAUVEGARDE
    // =====================================================

    await utilisateur.save();

    // =====================================================
    // 📤 RÉPONSE
    // =====================================================

    return res.status(200).json({
      success: true,
      message: 'Utilisateur mis à jour avec succès.',
      utilisateur:
        construireUtilisateurResponse(utilisateur)
    });

  } catch (error) {
    // Erreur de duplication MongoDB
    if (error.code === 11000) {
      return res.status(409).json({
        success: false,
        message:
          'Un utilisateur avec cet email, ce pseudo ou cette key existe déjà.'
      });
    }

    if (error.name === 'ValidationError') {
      return res.status(400).json({
        success: false,
        message:
          'Les données utilisateur sont invalides.',
        erreurs: Object.values(error.errors).map(
          erreur => erreur.message
        )
      });
    }

    if (error.name === 'CastError') {
      return res.status(400).json({
        success: false,
        message: 'Identifiant utilisateur invalide.'
      });
    }

    return res.status(500).json({
      success: false,
      message:
        'Erreur serveur lors de la modification de l’utilisateur.'
    });
  }
};


// =====================================================
// 🗑️ SUPPRIMER UN UTILISATEUR
//
// DELETE /api/users/:id
// =====================================================

const supprimerUtilisateur = async (req, res) => {
  try {
    const identifiant = String(
      req.params.id || ''
    ).trim();

    if (!identifiant) {
      return res.status(400).json({
        success: false,
        message: 'Identifiant utilisateur obligatoire.'
      });
    }

    let utilisateur = null;

    // =====================================================
    // 🔎 PAR ID
    // =====================================================

    if (/^[0-9a-fA-F]{24}$/.test(identifiant)) {
      utilisateur =
        await Utilisateur.findById(identifiant);
    }

    // =====================================================
    // 🔎 PAR KEY
    // =====================================================

    if (!utilisateur) {
      utilisateur =
        await Utilisateur.findOne({
          key: identifiant
        });
    }

    if (!utilisateur) {
      return res.status(404).json({
        success: false,
        message: 'Utilisateur introuvable.'
      });
    }

    await Utilisateur.deleteOne({
      _id: utilisateur._id
    });

    return res.status(200).json({
      success: true,
      message: 'Utilisateur supprimé avec succès.'
    });

  } catch (error) {
    if (error.name === 'CastError') {
      return res.status(400).json({
        success: false,
        message: 'Identifiant utilisateur invalide.'
      });
    }

    return res.status(500).json({
      success: false,
      message:
        'Erreur serveur lors de la suppression de l’utilisateur.'
    });
  }
};


// =====================================================
// 🛡️ MODIFIER LE RÔLE
//
// PUT /api/users/:key/role
// =====================================================

const modifierRoleUtilisateur = async (
  req,
  res
) => {
  try {
    const key = String(
      req.params.key || ''
    ).trim();

    const role = String(
      req.body?.role || ''
    ).trim().toUpperCase();

    if (!key) {
      return res.status(400).json({
        success: false,
        message: 'La key utilisateur est obligatoire.'
      });
    }

    if (!role) {
      return res.status(400).json({
        success: false,
        message: 'Le rôle est obligatoire.'
      });
    }

    const rolesAutorises = [
      'VISITEUR',
      'PROFESSIONNEL',
      'MODERATEUR',
      'ADMIN'
    ];

    if (!rolesAutorises.includes(role)) {
      return res.status(400).json({
        success: false,
        message: 'Le rôle sélectionné est invalide.'
      });
    }

    const utilisateur =
      await Utilisateur.findOne({
        key
      });

    if (!utilisateur) {
      return res.status(404).json({
        success: false,
        message: 'Utilisateur introuvable.'
      });
    }

    utilisateur.role = role;

    await utilisateur.save();

    return res.status(200).json({
      success: true,
      message: 'Rôle utilisateur modifié avec succès.',
      utilisateur:
        construireUtilisateurResponse(utilisateur)
    });

  } catch (error) {
    if (error.name === 'ValidationError') {
      return res.status(400).json({
        success: false,
        message:
          'Le rôle sélectionné est invalide.'
      });
    }

    return res.status(500).json({
      success: false,
      message:
        'Erreur serveur lors de la modification du rôle.'
    });
  }
};


// =====================================================
// 📦 EXPORTS
// =====================================================

module.exports = {

  // =====================================================
  // 👤 UTILISATEURS
  // =====================================================

  inscrire,
  connecter,
  obtenirUtilisateurs,
  obtenirUtilisateurParId,
  obtenirUtilisateurParEmail,

  modifierUtilisateur,
  supprimerUtilisateur,
  modifierRoleUtilisateur,

  // =====================================================
  // 🌿 JARDIDEX
  // =====================================================

  obtenirJardiDex,
  ajouterPlanteJardiDex,
  retirerPlanteJardiDex,
  modifierFavoriteJardiDex,

  // =====================================================
  // 🔐 RESET PASSWORD
  // =====================================================

  genererResetPasswordKey,
  verifierResetPasswordKey,
  resetPassword,

  // =====================================================
  // 🔄 COMPATIBILITÉ ANCIEN NOM
  // =====================================================

  verifyResetKey:
    verifierResetPasswordKey
};