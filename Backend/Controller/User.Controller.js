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
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';

  let result = '';

  for (let i = 0; i < length; i++) {
    result += chars.charAt(
      Math.floor(Math.random() * chars.length)
    );
  }

  return result;
}

// =====================================================
// 🔑 GÉNÉRER UNE KEY UTILISATEUR
// Format : 12345ABCDE
// =====================================================

function generateKey() {
  const numberPart = Math.floor(
    Math.random() * 100000
  );

  const suffix = randomSuffix(5);

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
// Ne jamais renvoyer le mot de passe ou
// les informations de reset
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
    createdAt: utilisateur.createdAt,
    updatedAt: utilisateur.updatedAt
  };
}

// =====================================================
// 📝 CRÉER UN UTILISATEUR
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
    console.log('========================================');
    console.log('👤 INSCRIPTION');
    console.log('========================================');
    console.log('📧 Email :', email);
    console.log('👤 Pseudo :', pseudo);
    console.log(
      '🖼️ Avatar :',
      req.file
        ? req.file.filename
        : 'Aucun'
    );
    console.log('========================================');

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

    if (motDePasse.length < 6) {
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
      email.trim().toLowerCase();

    // =====================================================
    // EMAIL EXISTANT
    // =====================================================

    const utilisateurExistant =
      await Utilisateur.findOne({
        email: emailNormalise
      });

    if (utilisateurExistant) {
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
        pseudo: pseudoNormalise
      });

    if (pseudoExistant) {
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
      keyUnique = generateKey();

      const utilisateurAvecCetteKey =
        await Utilisateur.findOne({
          key: keyUnique
        });

      keyExiste =
        !!utilisateurAvecCetteKey;
    }

    // =====================================================
    // 🔐 RESET PASSWORD
    // =====================================================

    const resetPasswordKey = null;
    const resetPasswordExpire = null;

    // =====================================================
    // 👤 CRÉATION UTILISATEUR
    // =====================================================

    const utilisateur =
      await Utilisateur.create({
        key: keyUnique,

        pseudo: pseudoNormalise,

        nom: nom.trim(),

        prenom: prenom.trim(),

        email: emailNormalise,

        motDePasse: motDePasseHash,

        resetPasswordKey,

        resetPasswordExpire,

        avatar: avatarPath,

        role: roleSelectionne,

        estActif: true
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

    if (error.code === 11000) {
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
    // motDePasse est probablement select:false
    // =====================================================

    const utilisateur =
      await Utilisateur
        .findOne({
          email: emailNormalise
        })
        .select('+motDePasse');

    // =====================================================
    // UTILISATEUR INTROUVABLE
    // =====================================================

    if (!utilisateur) {
      return res.status(401).json({
        message:
          'Adresse email ou mot de passe incorrect.'
      });
    }

    // =====================================================
    // HASH ABSENT
    // =====================================================

    if (!utilisateur.motDePasse) {
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

    if (!motDePasseValide) {
      return res.status(401).json({
        message:
          'Adresse email ou mot de passe incorrect.'
      });
    }

    // =====================================================
    // 📤 RÉPONSE
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
          createdAt: -1
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
        .findById(req.params.id)
        .select(
          '-motDePasse -resetPasswordKey -resetPasswordExpire'
        );

    if (!utilisateur) {
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
// 🔐 GÉNÉRER UNE CLÉ RESET PASSWORD
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
        email: emailNormalise
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
    // ⏱️ EXPIRATION 15 MINUTES
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
    console.log('========================================');
    console.log('🔐 RESET PASSWORD');
    console.log('========================================');
    console.log(
      '📧 Email :',
      utilisateur.email
    );
    console.log(
      '🔑 Clé générée :',
      resetPasswordKey
    );
    console.log(
      '⏰ Expiration :',
      resetPasswordExpire
    );
    console.log('========================================');

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
// GET /api/users/email/:email
// =====================================================

const obtenirUtilisateurParEmail = async (
  req,
  res
) => {
  try {

    if (!req.params.email) {
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
    console.log('========================================');
    console.log(
      '📧 RECHERCHE UTILISATEUR PAR EMAIL'
    );
    console.log('========================================');
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

    if (!utilisateur) {

      console.log(
        '❌ Utilisateur introuvable :',
        email
      );

      return res.status(404).json({
        success: false,
        message:
          'Aucun utilisateur trouvé avec cette adresse email'
      });
    }

    console.log(
      '✅ Utilisateur trouvé :',
      utilisateur._id
    );

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

    console.log('');
    console.log('========================================');
    console.log('🔑 VÉRIFICATION CLÉ RESET');
    console.log('========================================');
    console.log(
      '📧 Email :',
      email
    );
    console.log(
      '🔑 Clé reçue :',
      resetPasswordKey
    );
    console.log('========================================');

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
      resetPasswordKey
        .trim();

    // =====================================================
    // 🔎 RECHERCHE UTILISATEUR
    // =====================================================

    const utilisateur =
      await Utilisateur.findOne({
        email: emailNormalise
      });

    if (!utilisateur) {

      console.log(
        '❌ Utilisateur introuvable'
      );

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

      console.log(
        '⌛ Clé de réinitialisation expirée'
      );

      // Nettoyage de la clé expirée
      utilisateur.resetPasswordKey = null;
      utilisateur.resetPasswordExpire = null;

      await utilisateur.save();

      return res.status(400).json({
        success: false,
        message:
          'La clé de réinitialisation a expiré'
      });
    }

    // =====================================================
    // 🔐 COMPARAISON CLÉ
    // =====================================================

    if (
      utilisateur.resetPasswordKey !==
      cleNormalisee
    ) {

      console.log(
        '❌ Clé de réinitialisation incorrecte'
      );

      return res.status(400).json({
        success: false,
        message:
          'Clé de réinitialisation incorrecte'
      });
    }

    // =====================================================
    // ✅ CLÉ VALIDE
    // =====================================================

    console.log(
      '✅ Clé de réinitialisation valide'
    );

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
// POST /api/users/reset-password
// =====================================================

const resetPassword = async (
  req,
  res
) => {
  try {

    console.log('');
    console.log('========================================');
    console.log('🔐 RESET PASSWORD DEMANDÉ');
    console.log('========================================');

    const {
      email,
      resetPasswordKey,
      password
    } = req.body || {};

    console.log(
      '📧 Email :',
      email
    );

    console.log(
      '🔑 Clé reçue :',
      resetPasswordKey
    );

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
      resetPasswordKey
        .trim();

    // =====================================================
    // 🔎 RECHERCHE UTILISATEUR
    // =====================================================

    const utilisateur =
      await Utilisateur.findOne({
        email: emailNormalise
      });

    if (!utilisateur) {

      console.log(
        '❌ Utilisateur introuvable :',
        emailNormalise
      );

      return res.status(404).json({
        success: false,
        message:
          'Utilisateur introuvable'
      });
    }

    console.log(
      '👤 Utilisateur trouvé :',
      utilisateur.email
    );

    // =====================================================
    // 🔑 VÉRIFIER CLÉ
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
    // ⏱️ VÉRIFIER EXPIRATION
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

      console.log(
        '⌛ Clé expirée'
      );

      utilisateur.resetPasswordKey = null;
      utilisateur.resetPasswordExpire = null;

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

      console.log(
        '❌ Clé incorrecte'
      );

      return res.status(400).json({
        success: false,
        message:
          'Clé incorrecte'
      });
    }

    // =====================================================
    // 🔐 HASHER LE NOUVEAU MOT DE PASSE
    //
    // IMPORTANT :
    // On utilise ici le champ `motDePasse`
    // de ton Schema User.
    //
    // On ne met PAS `user.password`.
    // =====================================================

    console.log(
      '🔒 Hashage du nouveau mot de passe...'
    );

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

    console.log(
      '✅ Mot de passe changé avec succès pour :',
      utilisateur.email
    );

    console.log(
      '🧹 Clé reset supprimée'
    );

    console.log('========================================');

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
// 📦 EXPORTS
// =====================================================

module.exports = {

  // 👤 Utilisateurs
  inscrire,
  connecter,
  obtenirUtilisateurs,
  obtenirUtilisateurParId,
  obtenirUtilisateurParEmail,

  // 🔐 Reset password
  genererResetPasswordKey,
  verifierResetPasswordKey,
  resetPassword,

  // Compatibilité avec ton ancien nom
  verifyResetKey: verifierResetPasswordKey
};
