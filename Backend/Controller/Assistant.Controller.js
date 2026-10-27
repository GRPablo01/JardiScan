'use strict';

// ============================================================
// 🌱 ARBORIA — ASSISTANT CONTROLLER
// CommonJS • Express • MongoDB / Mongoose • Ollama
//
// Disponibilité • Historique • Conversations • Streaming SSE
// Sauvegarde MongoDB avant confirmation finale
// Compatible avec Assistant.Schema.js
// ============================================================

const mongoose = require('mongoose');

const AssistantService = require('../Services/Assistant.service.js');
const Assistant = require('../Schema/Assistant.Schema.js');

// ============================================================
// CONFIGURATION
// ============================================================

const MAX_MESSAGE_LENGTH = 20000;
const MAX_TITRE_LENGTH = 200;
const MAX_HISTORIQUE = 40;

const OBJECT_ID_REGEX = /^[a-fA-F0-9]{24}$/;

// ============================================================
// OUTILS
// ============================================================

function normaliserObjectId(candidat) {
  if (!candidat) return null;

  let valeur = candidat;

  if (typeof candidat === 'object') {
    valeur =
      candidat._id ??
      candidat.id ??
      candidat.utilisateurId ??
      candidat.userId ??
      null;
  }

  if (valeur === null || valeur === undefined) return null;

  const id = String(valeur).trim();

  if (!OBJECT_ID_REGEX.test(id)) return null;
  if (!mongoose.Types.ObjectId.isValid(id)) return null;

  return new mongoose.Types.ObjectId(id);
}

function getUtilisateurId(req) {
  const candidats = [
    req.user,
    req.utilisateur,
    req.auth,
    req.body?.utilisateurId,
    req.params?.utilisateurId,
    req.query?.utilisateurId,
  ];

  for (const candidat of candidats) {
    const id = normaliserObjectId(candidat);

    if (id) return id.toString();
  }

  return null;
}

function getFiltreUtilisateur(utilisateurId) {
  return {
    utilisateur: utilisateurId
      ? new mongoose.Types.ObjectId(utilisateurId)
      : null,
  };
}

function baseDeDonneesDisponible() {
  return mongoose.connection.readyState === 1;
}

function identifiantConversationValide(id) {
  return typeof id === 'string' && OBJECT_ID_REGEX.test(id);
}

function normaliserHistorique(historique) {
  if (!Array.isArray(historique)) return [];

  return historique
    .filter(
      (item) =>
        item &&
        ['user', 'assistant'].includes(item.role) &&
        typeof (item.contenu ?? item.content) === 'string'
    )
    .slice(-MAX_HISTORIQUE)
    .map((item) => ({
      role: item.role,
      contenu: String(item.contenu ?? item.content)
        .trim()
        .slice(0, MAX_MESSAGE_LENGTH),
    }))
    .filter((item) => item.contenu.length > 0);
}

function journaliserErreur(contexte, error) {
  console.error(`❌ [Arboria Assistant] ${contexte}`);

  console.error({
    nom: error?.name || 'Erreur inconnue',
    message: error?.message || String(error),
    code: error?.code,
    codeMongoDB: error?.codeName,
    stack:
      process.env.NODE_ENV === 'development'
        ? error?.stack
        : undefined,
  });
}

function envoyerEvenement(res, type, donnees) {
  if (res.destroyed || res.writableEnded) return false;

  res.write(`event: ${type}\n`);
  res.write(`data: ${JSON.stringify(donnees)}\n\n`);

  return true;
}

function erreurHttp(res, status, message, code = undefined) {
  return res.status(status).json({
    succes: false,
    message,
    ...(code ? { code } : {}),
  });
}

// ============================================================
// VALIDER LES DONNÉES DU MESSAGE
// ============================================================

function validerMessage(body = {}) {
  const {
    conversationId = null,
    message,
    style = 'Style de réponse',
    reponsesDetaillees = true,
  } = body;

  if (typeof message !== 'string' || !message.trim()) {
    return {
      erreur: 'Le message est obligatoire.',
      status: 400,
    };
  }

  if (message.trim().length > MAX_MESSAGE_LENGTH) {
    return {
      erreur: 'Le message ne doit pas dépasser 20 000 caractères.',
      status: 413,
    };
  }

  if (
    typeof style !== 'string' ||
    !style.trim() ||
    style.trim().length > 100
  ) {
    return {
      erreur: 'Le style de réponse est invalide.',
      status: 400,
    };
  }

  if (typeof reponsesDetaillees !== 'boolean') {
    return {
      erreur: 'Le paramètre reponsesDetaillees doit être un booléen.',
      status: 400,
    };
  }

  if (
    conversationId !== null &&
    conversationId !== undefined &&
    conversationId !== '' &&
    !identifiantConversationValide(conversationId)
  ) {
    return {
      erreur: 'Identifiant de conversation invalide.',
      status: 400,
    };
  }

  return {
    donnees: {
      conversationId: conversationId || null,
      message: message.trim(),
      style: style.trim(),
      reponsesDetaillees,
      historique: normaliserHistorique(body.historique),
    },
  };
}

// ============================================================
// CHARGER OU CRÉER UNE CONVERSATION
// ============================================================

async function chargerConversation(conversationId, utilisateurId) {
  if (!conversationId) return null;

  return Assistant.findOne({
    _id: conversationId,
    ...getFiltreUtilisateur(utilisateurId),
  });
}

function creerConversation(utilisateurId, donnees, modele) {
  const maintenant = new Date();

  return new Assistant({
    utilisateur: utilisateurId,
    titre:
      donnees.message.slice(0, MAX_TITRE_LENGTH) ||
      'Nouvelle conversation',
    messages: [],
    style: donnees.style,
    reponsesDetaillees: donnees.reponsesDetaillees,
    modele: modele || null,
    dateCreation: maintenant,
    dateModification: maintenant,
  });
}

function enregistrerMessages(
  conversation,
  donnees,
  contenuAssistant,
  modele
) {
  const maintenant = new Date();

  conversation.messages.push(
    {
      role: 'user',
      contenu: donnees.message,
      date: maintenant,
    },
    {
      role: 'assistant',
      contenu: contenuAssistant,
      date: new Date(),
    }
  );

  conversation.style = donnees.style;
  conversation.reponsesDetaillees = donnees.reponsesDetaillees;
  conversation.modele = modele || conversation.modele || null;
  conversation.dateModification = new Date();
}

// ============================================================
// ENVOYER UN MESSAGE CLASSIQUE
// POST /api/assistant/message
// ============================================================

exports.envoyerMessage = async (req, res) => {
  try {
    const validation = validerMessage(req.body);

    if (validation.erreur) {
      return erreurHttp(
        res,
        validation.status,
        validation.erreur
      );
    }

    const donnees = validation.donnees;

    if (!baseDeDonneesDisponible()) {
      return erreurHttp(
        res,
        503,
        'La base de données MongoDB est indisponible.'
      );
    }

    const utilisateurId = getUtilisateurId(req);

    if (!utilisateurId) {
      return erreurHttp(
        res,
        401,
        'Utilisateur non identifié.',
        'UTILISATEUR_NON_IDENTIFIE'
      );
    }

    let conversation = await chargerConversation(
      donnees.conversationId,
      utilisateurId
    );

    if (donnees.conversationId && !conversation) {
      return erreurHttp(res, 404, 'Conversation introuvable.');
    }

    const resultat = await AssistantService.envoyerMessage({
      conversationId: conversation?._id?.toString() || null,
      message: donnees.message,
      style: donnees.style,
      reponsesDetaillees: donnees.reponsesDetaillees,
      historique: donnees.historique,
    });

    const contenuAssistant = resultat?.message?.trim();

    if (!contenuAssistant) {
      return erreurHttp(
        res,
        502,
        'L’assistant n’a pas fourni de réponse valide.'
      );
    }

    if (!conversation) {
      conversation = creerConversation(
        utilisateurId,
        donnees,
        resultat.modele
      );
    }

    enregistrerMessages(
      conversation,
      donnees,
      contenuAssistant,
      resultat.modele
    );

    await conversation.save();

    return res.status(200).json({
      succes: true,
      conversationId: conversation._id.toString(),
      utilisateurId: conversation.utilisateur.toString(),
      conversation,
      reponse: contenuAssistant,
      message: contenuAssistant,
      date: new Date().toISOString(),
      modele: resultat.modele || null,
    });
  } catch (error) {
    journaliserErreur('Envoi du message', error);

    const status =
      Number.isInteger(error?.status) &&
      error.status >= 400 &&
      error.status <= 599
        ? error.status
        : 500;

    if (res.headersSent) {
      return res.end();
    }

    return res.status(status).json({
      succes: false,
      message:
        status >= 500
          ? 'Impossible de traiter ou d’enregistrer la conversation.'
          : error.message,
      ...(process.env.NODE_ENV === 'development'
        ? { erreur: error.message }
        : {}),
    });
  }
};

// ============================================================
// ENVOYER UN MESSAGE EN STREAMING
// POST /api/assistant/message/stream
//
// Événements SSE :
// fragment : { contenu: "..." }
// termine  : { succes, conversationId, utilisateurId, reponse, modele, date }
// erreur   : { message }
// ============================================================

exports.envoyerMessageStreaming = async (req, res) => {
  let fluxOuvert = false;
  let clientDeconnecte = false;
  let contenuAssistant = '';

  const marquerDeconnexion = () => {
    clientDeconnecte = true;
  };

  try {
    const validation = validerMessage(req.body);

    if (validation.erreur) {
      return erreurHttp(
        res,
        validation.status,
        validation.erreur
      );
    }

    const donnees = validation.donnees;

    if (!baseDeDonneesDisponible()) {
      return erreurHttp(
        res,
        503,
        'La base de données MongoDB est indisponible.'
      );
    }

    const utilisateurId = getUtilisateurId(req);

    if (!utilisateurId) {
      return erreurHttp(
        res,
        401,
        'Utilisateur non identifié.',
        'UTILISATEUR_NON_IDENTIFIE'
      );
    }

    let conversation = await chargerConversation(
      donnees.conversationId,
      utilisateurId
    );

    if (donnees.conversationId && !conversation) {
      return erreurHttp(res, 404, 'Conversation introuvable.');
    }

    // Headers SSE : la réponse doit être ouverte avant Ollama.
    res.status(200);
    res.setHeader(
      'Content-Type',
      'text/event-stream; charset=utf-8'
    );
    res.setHeader('Cache-Control', 'no-cache, no-transform');
    res.setHeader('Connection', 'keep-alive');
    res.setHeader('X-Accel-Buffering', 'no');

    if (typeof res.flushHeaders === 'function') {
      res.flushHeaders();
    }

    fluxOuvert = true;
    req.on('close', marquerDeconnexion);

    // Événement initial pour confirmer l'ouverture du flux.
    envoyerEvenement(res, 'pret', {
      succes: true,
      message: 'Génération de la réponse démarrée.',
    });

    // L'implémentation du service doit appeler onFragment
    // pour chaque fragment reçu depuis Ollama.
    const resultat = await AssistantService.envoyerMessageStreaming({
      conversationId: conversation?._id?.toString() || null,
      message: donnees.message,
      style: donnees.style,
      reponsesDetaillees: donnees.reponsesDetaillees,
      historique: donnees.historique,

      onFragment: (fragment) => {
        if (clientDeconnecte || res.destroyed || res.writableEnded) {
          return;
        }

        if (typeof fragment !== 'string' || !fragment) return;

        contenuAssistant += fragment;

        envoyerEvenement(res, 'fragment', {
          contenu: fragment,
        });
      },
    });

    if (clientDeconnecte || res.destroyed || res.writableEnded) {
      return;
    }

    // Tolérance si le service retourne un texte complet sans fragments.
    if (!contenuAssistant.trim() && typeof resultat?.message === 'string') {
      contenuAssistant = resultat.message;
      envoyerEvenement(res, 'fragment', {
        contenu: contenuAssistant,
      });
    }

    contenuAssistant = contenuAssistant.trim();

    if (!contenuAssistant) {
      envoyerEvenement(res, 'erreur', {
        message: 'L’assistant n’a pas fourni de réponse.',
      });

      return res.end();
    }

    if (!conversation) {
      conversation = creerConversation(
        utilisateurId,
        donnees,
        resultat?.modele
      );
    }

    enregistrerMessages(
      conversation,
      donnees,
      contenuAssistant,
      resultat?.modele
    );

    // Le client reçoit "termine" seulement après la sauvegarde MongoDB.
    await conversation.save();

    if (clientDeconnecte || res.destroyed || res.writableEnded) {
      return;
    }

    envoyerEvenement(res, 'termine', {
      succes: true,
      conversationId: conversation._id.toString(),
      utilisateurId: conversation.utilisateur.toString(),
      reponse: contenuAssistant,
      conversation: conversation.toObject(),
      modele: resultat?.modele || null,
      date: new Date().toISOString(),
    });

    return res.end();
  } catch (error) {
    journaliserErreur('Streaming du message', error);

    if (!fluxOuvert && !res.headersSent) {
      const status =
        Number.isInteger(error?.status) &&
        error.status >= 400 &&
        error.status <= 599
          ? error.status
          : 500;

      return res.status(status).json({
        succes: false,
        message: 'Impossible de générer ou sauvegarder la réponse.',
        ...(process.env.NODE_ENV === 'development'
          ? { erreur: error.message }
          : {}),
      });
    }

    if (!res.destroyed && !res.writableEnded) {
      envoyerEvenement(res, 'erreur', {
        message:
          'Une erreur est survenue pendant la génération de la réponse.',
        ...(process.env.NODE_ENV === 'development'
          ? { detail: error.message }
          : {}),
      });

      return res.end();
    }
  }
};

// ============================================================
// RÉCUPÉRER LES CONVERSATIONS
// GET /api/assistant/conversations
// ============================================================

exports.obtenirConversations = async (req, res) => {
  try {
    if (!baseDeDonneesDisponible()) {
      return erreurHttp(
        res,
        503,
        'La base de données MongoDB est indisponible.'
      );
    }

    const utilisateurId = getUtilisateurId(req);

    if (!utilisateurId) {
      return erreurHttp(
        res,
        401,
        'Utilisateur non identifié.',
        'UTILISATEUR_NON_IDENTIFIE'
      );
    }

    const conversations = await Assistant.find(
      getFiltreUtilisateur(utilisateurId)
    )
      .select('-messages')
      .sort({ dateModification: -1 })
      .lean();

    return res.status(200).json({
      succes: true,
      conversations,
    });
  } catch (error) {
    journaliserErreur('Récupération des conversations', error);

    return res.status(500).json({
      succes: false,
      message: 'Impossible de récupérer les conversations.',
      ...(process.env.NODE_ENV === 'development'
        ? { erreur: error.message }
        : {}),
    });
  }
};

// ============================================================
// RÉCUPÉRER UNE CONVERSATION
// GET /api/assistant/conversations/:id
// ============================================================

exports.obtenirConversation = async (req, res) => {
  try {
    const { id } = req.params;

    if (!identifiantConversationValide(id)) {
      return erreurHttp(
        res,
        400,
        'Identifiant de conversation invalide.'
      );
    }

    if (!baseDeDonneesDisponible()) {
      return erreurHttp(
        res,
        503,
        'La base de données MongoDB est indisponible.'
      );
    }

    const utilisateurId = getUtilisateurId(req);

    if (!utilisateurId) {
      return erreurHttp(
        res,
        401,
        'Utilisateur non identifié.',
        'UTILISATEUR_NON_IDENTIFIE'
      );
    }

    const conversation = await Assistant.findOne({
      _id: id,
      ...getFiltreUtilisateur(utilisateurId),
    }).lean();

    if (!conversation) {
      return erreurHttp(res, 404, 'Conversation introuvable.');
    }

    return res.status(200).json({
      succes: true,
      conversation,
    });
  } catch (error) {
    journaliserErreur('Récupération d’une conversation', error);

    return res.status(500).json({
      succes: false,
      message: 'Impossible de récupérer cette conversation.',
      ...(process.env.NODE_ENV === 'development'
        ? { erreur: error.message }
        : {}),
    });
  }
};

// ============================================================
// SUPPRIMER UNE CONVERSATION
// DELETE /api/assistant/conversations/:id
// ============================================================

exports.supprimerConversation = async (req, res) => {
  try {
    const { id } = req.params;

    if (!identifiantConversationValide(id)) {
      return erreurHttp(
        res,
        400,
        'Identifiant de conversation invalide.'
      );
    }

    if (!baseDeDonneesDisponible()) {
      return erreurHttp(
        res,
        503,
        'La base de données MongoDB est indisponible.'
      );
    }

    const utilisateurId = getUtilisateurId(req);

    if (!utilisateurId) {
      return erreurHttp(
        res,
        401,
        'Utilisateur non identifié.',
        'UTILISATEUR_NON_IDENTIFIE'
      );
    }

    const conversation = await Assistant.findOneAndDelete({
      _id: id,
      ...getFiltreUtilisateur(utilisateurId),
    });

    if (!conversation) {
      return erreurHttp(res, 404, 'Conversation introuvable.');
    }

    return res.status(200).json({
      succes: true,
      message: 'Conversation supprimée.',
      conversationId: id,
    });
  } catch (error) {
    journaliserErreur('Suppression d’une conversation', error);

    return res.status(500).json({
      succes: false,
      message: 'Impossible de supprimer cette conversation.',
      ...(process.env.NODE_ENV === 'development'
        ? { erreur: error.message }
        : {}),
    });
  }
};

// ============================================================
// VÉRIFIER LA DISPONIBILITÉ DE L'ASSISTANT
// GET /api/assistant/disponibilite
// ============================================================

exports.verifierDisponibilite = async (req, res) => {
  const baseDeDonnees = baseDeDonneesDisponible();

  try {
    const disponible = Boolean(
      await AssistantService.verifierDisponibilite()
    );

    return res.status(200).json({
      succes: true,
      service: 'Arboria Assistant',
      disponible,
      baseDeDonnees,
      date: new Date().toISOString(),
    });
  } catch (error) {
    journaliserErreur('Vérification de disponibilité', error);

    return res.status(200).json({
      succes: true,
      service: 'Arboria Assistant',
      disponible: false,
      baseDeDonnees,
      ...(process.env.NODE_ENV === 'development'
        ? { erreur: error.message }
        : {}),
      date: new Date().toISOString(),
    });
  }
};