
'use strict';

const mongoose = require('mongoose');

// ============================================================
// ARBORIA — ASSISTANT SCHEMA
// CommonJS • MongoDB / Mongoose
//
// - Association obligatoire avec l'utilisateur
// - Messages user / assistant
// - Dates automatiques avec timestamps
// - Historique des conversations
// - Index optimisé par utilisateur et date de modification
// ============================================================

// ============================================================
// INTERFACE MESSAGE ASSISTANT
// ============================================================

const MessageAssistantSchema = new mongoose.Schema(
  {
    role: {
      type: String,
      enum: ['user', 'assistant'],
      required: true,
    },

    contenu: {
      type: String,
      required: true,
      trim: true,
    },

    date: {
      type: Date,
      default: Date.now,
    },
  },
  {
    _id: true,
  }
);

// ============================================================
// SCHÉMA PRINCIPAL — CONVERSATION ASSISTANT
// ============================================================

const AssistantSchema = new mongoose.Schema(
  {
    utilisateur: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Utilisateur',
      required: true,
      index: true,
    },

    titre: {
      type: String,
      required: true,
      trim: true,
      maxlength: 200,
      default: 'Nouvelle conversation',
    },

    messages: {
      type: [MessageAssistantSchema],
      default: [],
    },

    style: {
      type: String,
      default: 'Style de réponse',
      trim: true,
    },

    reponsesDetaillees: {
      type: Boolean,
      default: true,
    },

    modele: {
      type: String,
      default: null,
    },
  },
  {
    timestamps: {
      createdAt: 'dateCreation',
      updatedAt: 'dateModification',
    },
    versionKey: false,
  }
);

// ============================================================
// INDEX — CONVERSATIONS D'UN UTILISATEUR
// ============================================================

AssistantSchema.index({
  utilisateur: 1,
  dateModification: -1,
});

// ============================================================
// EXPORT COMMONJS
// ============================================================

module.exports =
  mongoose.models.Assistant ||
  mongoose.model('Assistant', AssistantSchema);
