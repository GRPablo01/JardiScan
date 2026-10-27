// ============================================================
// 🌱 ARBORIA — ASSISTANT ROUTES
// Express • CommonJS
// Disponibilité • Conversations • Streaming
// ============================================================

const express = require('express');
const router = express.Router();

const AssistantController = require('../Controller/Assistant.Controller');

// ============================================================
// DISPONIBILITÉ
// GET /api/assistant/disponibilite
// ============================================================

router.get(
  '/disponibilite',
  AssistantController.verifierDisponibilite
);

// ============================================================
// HISTORIQUE DES CONVERSATIONS
// GET /api/assistant/conversations
// ============================================================

router.get(
  '/conversations',
  AssistantController.obtenirConversations
);

// ============================================================
// RÉCUPÉRER UNE CONVERSATION
// GET /api/assistant/conversations/:id
// ============================================================

router.get(
  '/conversations/:id',
  AssistantController.obtenirConversation
);

// ============================================================
// ENVOYER UN MESSAGE EN STREAMING
// POST /api/assistant/message/stream
// ============================================================

router.post(
  '/message/stream',
  AssistantController.envoyerMessageStreaming
);

// ============================================================
// EXPORT
// ============================================================

module.exports = router;