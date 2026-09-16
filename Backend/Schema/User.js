const mongoose = require('mongoose');

// =====================================================
// SCHEMA UTILISATEUR - JARDISCAN
// =====================================================

const utilisateurSchema = new mongoose.Schema(
  {
    // =====================================================
    // KEY UNIQUE
    // =====================================================

    key: {
      type: String,
      unique: true
    },

    // =====================================================
    // 🔐 RESET PASSWORD
    // =====================================================

    resetPasswordKey: {
      type: String,
      default: null
    },

    resetPasswordExpire: {
      type: Date,
      default: null
    },

    // =====================================================
    // PSEUDO
    // =====================================================

    pseudo: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      minlength: 2,
      maxlength: 30
    },

    // =====================================================
    // NOM
    // =====================================================

    nom: {
      type: String,
      required: true,
      trim: true,
      maxlength: 50
    },

    // =====================================================
    // PRÉNOM
    // =====================================================

    prenom: {
      type: String,
      required: true,
      trim: true,
      maxlength: 50
    },

    // =====================================================
    // EMAIL
    // =====================================================

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true
    },

    // =====================================================
    // MOT DE PASSE
    // =====================================================

    motDePasse: {
      type: String,
      required: true,
      minlength: 6,
      select: false
    },

    // =====================================================
    // JARDIDEX
    // Collection de plantes découvertes
    // =====================================================

    jardiDex: {
      type: [
        {
          plante: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Plante',
            required: true
          },

          dateDecouverte: {
            type: Date,
            default: Date.now
          },

          favorite: {
            type: Boolean,
            default: false
          }
        }
      ],

      default: []
    },

    // =====================================================
    // AVATAR
    // =====================================================

    avatar: {
      type: String,
      default: ''
    },

    // =====================================================
    // ROLE
    // =====================================================

    role: {
      type: String,
      enum: [
        'VISITEUR',
      ],
      default: 'VISITEUR',
      required: true
    },

    // =====================================================
    // STATUT DU COMPTE
    // =====================================================

    estActif: {
      type: Boolean,
      default: true
    }
  },

  {
    timestamps: true
  }
);

// =====================================================
// EXPORT
// =====================================================

module.exports = mongoose.model(
  'Utilisateur',
  utilisateurSchema
);