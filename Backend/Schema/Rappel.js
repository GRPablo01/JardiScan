const mongoose = require('mongoose');

const RappelSchema = new mongoose.Schema(

  {

    // ============================================================
    // 👤 UTILISATEUR
    // ============================================================

    utilisateur: {

      type: mongoose.Schema.Types.ObjectId,

      ref: 'Utilisateur',

      required: true,

      index: true

    },

    // ============================================================
    // 👤 INFORMATIONS UTILISATEUR
    // ============================================================

    prenom: {

      type: String,

      trim: true,

      maxlength: 50,

      default: ''

    },

    nom: {

      type: String,

      trim: true,

      maxlength: 50,

      default: ''

    },

    // ============================================================
    // 🌱 PLANTE
    // ============================================================

    plante: {

      type: mongoose.Schema.Types.ObjectId,

      ref: 'Plante',

      default: null

    },

    // ============================================================
    // 📝 RAPPEL
    // ============================================================

    titre: {

      type: String,

      required: true,

      trim: true,

      maxlength: 100

    },

    description: {

      type: String,

      trim: true,

      maxlength: 500,

      default: ''

    },

    // ============================================================
    // 🏷️ TYPE
    // ============================================================

    type: {

      type: String,

      enum: [

        'arrosage',

        'exposition',

        'engrais',

        'rempotage',

        'taille',

        'traitement',

        'observation',

        'autre'

      ],

      default: 'autre'

    },

    // ============================================================
    // 📅 DATE
    // ============================================================

    date: {

      type: Date,

      required: true

    },

    // ============================================================
    // 🔁 FRÉQUENCE
    // ============================================================

    frequence: {

      type: String,

      enum: [

        'unique',

        'quotidien',

        'hebdomadaire',

        'mensuel'

      ],

      default: 'unique'

    },

    // ============================================================
    // ✅ STATUT
    // ============================================================

    termine: {

      type: Boolean,

      default: false

    },

    actif: {

      type: Boolean,

      default: true

    }

  },

  {

    timestamps: true

  }

);

// ============================================================
// 📊 INDEX
// ============================================================

RappelSchema.index({

  utilisateur: 1,

  date: 1

});

// ============================================================
// 📤 EXPORT
// ============================================================

module.exports = mongoose.model(

  'Rappel',

  RappelSchema

);
