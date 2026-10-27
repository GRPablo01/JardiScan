// ============================================================
// 🌱 ARBORIA — ASSISTANT SERVICE
// Node.js • CommonJS • Axios • Ollama • Qwen3:8b
//
// Disponibilité • Génération progressive • Historique
// Styles de réponse • Streaming HTTP Ollama
// Compatible avec Assistant.Controller.js et Assistant.Schema.js
// ============================================================

'use strict';

const axios = require('axios');
const { Readable } = require('stream');

// ============================================================
// ERREUR PERSONNALISÉE
// ============================================================

class ErreurAssistant extends Error {
  constructor(message, status = 500) {
    super(message);

    this.name = 'ErreurAssistant';
    this.status = status;

    Error.captureStackTrace?.(this, ErreurAssistant);
  }
}

// ============================================================
// SERVICE ASSISTANT
// ============================================================

class AssistantService {
  constructor() {
    this.baseUrl = (
      process.env.OLLAMA_BASE_URL ||
      'http://127.0.0.1:11434'
    ).replace(/\/+$/, '');

    this.apiUrl = this.baseUrl.endsWith('/api/chat')
      ? this.baseUrl
      : `${this.baseUrl}/api/chat`;

    this.ollamaRoot = this.baseUrl.replace(/\/api\/chat$/, '');

    this.model = process.env.OLLAMA_MODEL || 'qwen3:8b';

    this.timeout = Math.max(
      1000,
      Number(process.env.OLLAMA_TIMEOUT) || 180000
    );

    this.maxMessageLength = 20000;
    this.maxHistorique = 20;
    this.maxHistoriqueCharacters = 60000;

    this.http = axios.create({
      timeout: this.timeout,
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
    });
  }

  // ==========================================================
  // VÉRIFIER LA DISPONIBILITÉ D'OLLAMA
  // ==========================================================

  async verifierDisponibilite() {
    try {
      const response = await this.http.get(
        `${this.ollamaRoot}/api/tags`,
        { timeout: 5000 }
      );

      const modeles = Array.isArray(response.data?.models)
        ? response.data.models
        : [];

      return modeles.some((modele) => {
        const nomModele = String(
          modele?.name || modele?.model || ''
        );

        return (
          nomModele === this.model ||
          nomModele.startsWith(`${this.model}:`)
        );
      });
    } catch (error) {
      console.error(
        '[Arboria Assistant] Ollama indisponible :',
        this.extraireMessageErreur(error)
      );

      return false;
    }
  }

  // ==========================================================
  // RÉCUPÉRER LES MODÈLES INSTALLÉS
  // ==========================================================

  async obtenirModeles() {
    try {
      const response = await this.http.get(
        `${this.ollamaRoot}/api/tags`,
        { timeout: 5000 }
      );

      return Array.isArray(response.data?.models)
        ? response.data.models
        : [];
    } catch (error) {
      throw this.normaliserErreurOllama(error);
    }
  }

  // ==========================================================
  // ENVOYER UN MESSAGE CLASSIQUE
  //
  // Compatible avec le contrôleur existant.
  // La réponse est retournée une fois entièrement générée.
  // ==========================================================

  async envoyerMessage({
    conversationId = null,
    message,
    style = 'Style de réponse',
    reponsesDetaillees = true,
    fichier = null,
    historique = [],
  } = {}) {
    this.validerParametres({
      message,
      style,
      reponsesDetaillees,
    });

    const contenuUtilisateur = message.trim();

    const messages = this.construireMessages({
      message: contenuUtilisateur,
      style: style.trim(),
      reponsesDetaillees,
      historique,
    });

    if (fichier) {
      console.warn(
        '[Arboria Assistant] Aucun traitement automatique du fichier n’est configuré.'
      );
    }

    try {
      const response = await this.http.post(
        this.apiUrl,
        {
          model: this.model,
          messages,
          stream: false,
          options: {
            temperature: 0.7,
          },
        },
        {
          timeout: this.timeout,
        }
      );

      const contenuReponse = response.data?.message?.content;

      if (
        typeof contenuReponse !== 'string' ||
        !contenuReponse.trim()
      ) {
        throw new ErreurAssistant(
          'Ollama a retourné une réponse vide.',
          502
        );
      }

      return {
        conversationId,
        message: contenuReponse.trim(),
        date: new Date().toISOString(),
        modele: response.data?.model || this.model,
      };
    } catch (error) {
      throw this.normaliserErreurOllama(error);
    }
  }

  // ==========================================================
  // ENVOYER UN MESSAGE EN STREAMING
  //
  // Utilisé par AssistantController.envoyerMessageStreaming().
  //
  // onFragment(fragment) reçoit chaque morceau de texte
  // au fur et à mesure de sa génération par Ollama.
  //
  // Retourne la réponse complète à la fin du flux.
  // ==========================================================

  async envoyerMessageStreaming({
    conversationId = null,
    message,
    style = 'Style de réponse',
    reponsesDetaillees = true,
    fichier = null,
    historique = [],
    onFragment,
    signal,
  } = {}) {
    this.validerParametres({
      message,
      style,
      reponsesDetaillees,
    });

    if (typeof onFragment !== 'function') {
      throw new ErreurAssistant(
        'Le callback onFragment est obligatoire pour le streaming.',
        400
      );
    }

    if (signal && typeof signal.aborted === 'boolean' && signal.aborted) {
      throw new ErreurAssistant(
        'La génération a été annulée.',
        499
      );
    }

    const contenuUtilisateur = message.trim();

    const messages = this.construireMessages({
      message: contenuUtilisateur,
      style: style.trim(),
      reponsesDetaillees,
      historique,
    });

    if (fichier) {
      console.warn(
        '[Arboria Assistant] Aucun traitement automatique du fichier n’est configuré.'
      );
    }

    let contenuComplet = '';
    let modeleUtilise = this.model;
    let fluxTermine = false;

    try {
      const response = await this.http.post(
        this.apiUrl,
        {
          model: this.model,
          messages,
          stream: true,
          options: {
            temperature: 0.7,
          },
        },
        {
          responseType: 'stream',
          timeout: this.timeout,
          signal,
          headers: {
            Accept: 'application/x-ndjson',
            'Content-Type': 'application/json',
          },
        }
      );

      const flux = response.data;

      if (!flux || typeof flux.on !== 'function') {
        throw new ErreurAssistant(
          'Ollama n’a pas retourné de flux exploitable.',
          502
        );
      }

      let tampon = '';

      const traiterLigne = (ligne) => {
        const texte = ligne.trim();

        if (!texte) {
          return;
        }

        let donnees;

        try {
          donnees = JSON.parse(texte);
        } catch {
          throw new ErreurAssistant(
            'Ollama a envoyé un fragment JSON invalide.',
            502
          );
        }

        if (donnees.error) {
          throw new ErreurAssistant(
            String(donnees.error),
            502
          );
        }

        if (donnees.model) {
          modeleUtilise = donnees.model;
        }

        const fragment = donnees.message?.content;

        if (typeof fragment === 'string' && fragment.length > 0) {
          contenuComplet += fragment;

          // Transmission immédiate du fragment au contrôleur.
          onFragment(fragment);
        }

        if (donnees.done === true) {
          fluxTermine = true;
        }
      };

      await new Promise((resolve, reject) => {
        let termine = false;

        const nettoyer = () => {
          flux.removeListener('data', traiterDonnees);
          flux.removeListener('end', terminerFlux);
          flux.removeListener('error', gererErreur);
          signal?.removeEventListener('abort', annulerFlux);
        };

        const terminer = (erreur = null) => {
          if (termine) {
            return;
          }

          termine = true;
          nettoyer();

          if (erreur) {
            reject(erreur);
          } else {
            resolve();
          }
        };

        const traiterDonnees = (bloc) => {
          try {
            tampon += bloc.toString('utf8');

            const lignes = tampon.split('\n');
            tampon = lignes.pop() || '';

            for (const ligne of lignes) {
              traiterLigne(ligne);
            }
          } catch (error) {
            flux.destroy();
            terminer(error);
          }
        };

        const terminerFlux = () => {
          try {
            if (tampon.trim()) {
              traiterLigne(tampon);
            }

            terminer();
          } catch (error) {
            terminer(error);
          }
        };

        const gererErreur = (error) => {
          terminer(error);
        };

        const annulerFlux = () => {
          const erreur = new ErreurAssistant(
            'La génération a été annulée.',
            499
          );

          flux.destroy();
          terminer(erreur);
        };

        flux.on('data', traiterDonnees);
        flux.once('end', terminerFlux);
        flux.once('error', gererErreur);

        if (signal) {
          signal.addEventListener('abort', annulerFlux, {
            once: true,
          });

          if (signal.aborted) {
            annulerFlux();
          }
        }
      });

      if (!fluxTermine) {
        throw new ErreurAssistant(
          'Le flux Ollama s’est terminé sans confirmation de fin.',
          502
        );
      }

      if (!contenuComplet.trim()) {
        throw new ErreurAssistant(
          'Ollama a retourné une réponse vide.',
          502
        );
      }

      return {
        conversationId,
        message: contenuComplet.trim(),
        date: new Date().toISOString(),
        modele: modeleUtilise,
      };
    } catch (error) {
      throw this.normaliserErreurOllama(error);
    }
  }

  // ==========================================================
  // VALIDATION COMMUNE
  // ==========================================================

  validerParametres({
    message,
    style,
    reponsesDetaillees,
  }) {
    if (typeof message !== 'string' || !message.trim()) {
      throw new ErreurAssistant(
        'Le message est obligatoire.',
        400
      );
    }

    if (message.trim().length > this.maxMessageLength) {
      throw new ErreurAssistant(
        'Le message ne doit pas dépasser 20 000 caractères.',
        413
      );
    }

    if (
      typeof style !== 'string' ||
      !style.trim() ||
      style.trim().length > 100
    ) {
      throw new ErreurAssistant(
        'Le style de réponse est invalide.',
        400
      );
    }

    if (typeof reponsesDetaillees !== 'boolean') {
      throw new ErreurAssistant(
        'Le paramètre reponsesDetaillees doit être un booléen.',
        400
      );
    }
  }

  // ==========================================================
  // CONSTRUIRE LES MESSAGES ENVOYÉS À OLLAMA
  // ==========================================================

  construireMessages({
    message,
    style,
    reponsesDetaillees,
    historique,
  }) {
    const historiqueNormalise =
      this.normaliserHistorique(historique);

    return [
      {
        role: 'system',
        content: this.construireInstructions(
          style,
          reponsesDetaillees
        ),
      },
      ...historiqueNormalise,
      {
        role: 'user',
        content: message,
      },
    ];
  }

  // ==========================================================
  // CONSTRUIRE LES INSTRUCTIONS DE L'ASSISTANT
  // ==========================================================

  construireInstructions(
    style = 'Style de réponse',
    reponsesDetaillees = true
  ) {
    const instructions = [
      'Tu es Arboria, un assistant conversationnel utile, clair et fiable.',
      'Tu aides principalement sur les plantes, le jardinage, leur entretien, les maladies végétales et les problèmes courants du jardin.',
      'Tu réponds dans la langue utilisée par l’utilisateur.',
      'Tu ne prétends jamais avoir effectué une action qui n’a pas réellement été effectuée.',
      'Tu distingues les faits établis des hypothèses.',
      'Si une information est incertaine, indique-le honnêtement.',
      'Propose des conseils pratiques, compréhensibles et adaptés à la situation.',
      'Pour les diagnostics de plantes, demande les informations manquantes lorsqu’elles sont nécessaires.',
      'N’invente ni sources, ni résultats d’analyse, ni données scientifiques.',
      'Structure tes réponses avec des paragraphes et des listes lorsque cela améliore la compréhension.',
    ];

    switch (style) {
      case 'Simple et concis':
        instructions.push(
          'Réponds de façon courte, directe et facile à comprendre.',
          'Va à l’essentiel et évite les détails secondaires.'
        );
        break;

      case 'Détaillé':
        instructions.push(
          'Fournis une réponse approfondie, structurée et complète.',
          'Explique les causes, les solutions et les précautions utiles.'
        );
        break;

      case 'Pédagogique':
        instructions.push(
          'Explique progressivement avec des exemples simples.',
          'Définis les termes techniques et explique pourquoi chaque étape est utile.'
        );
        break;

      case 'Professionnel':
        instructions.push(
          'Adopte un ton professionnel, précis et structuré.',
          'Privilégie les formulations claires et les recommandations justifiées.'
        );
        break;

      default:
        instructions.push(
          'Adapte le ton et la longueur de ta réponse à la demande de l’utilisateur.'
        );
        break;
    }

    instructions.push(
      reponsesDetaillees
        ? 'Ajoute les explications et les étapes utiles lorsque cela est pertinent.'
        : 'Privilégie les informations essentielles et évite les longues explications.'
    );

    return instructions.join('\n');
  }

  // ==========================================================
  // NORMALISER L'HISTORIQUE
  // ==========================================================

  normaliserHistorique(historique) {
    if (!Array.isArray(historique)) {
      return [];
    }

    const messagesValides = historique
      .filter((item) => {
        if (!item || typeof item !== 'object') {
          return false;
        }

        const contenu = item.contenu ?? item.content;

        return (
          ['user', 'assistant'].includes(item.role) &&
          typeof contenu === 'string' &&
          contenu.trim().length > 0
        );
      })
      .slice(-this.maxHistorique)
      .map((item) => ({
        role: item.role,
        content: String(item.contenu ?? item.content)
          .trim()
          .slice(0, this.maxMessageLength),
      }));

    let totalCaracteres = 0;
    const resultat = [];

    for (let i = messagesValides.length - 1; i >= 0; i--) {
      const item = messagesValides[i];
      const taille = item.content.length;

      if (
        totalCaracteres + taille >
        this.maxHistoriqueCharacters
      ) {
        continue;
      }

      resultat.unshift(item);
      totalCaracteres += taille;
    }

    return resultat;
  }

  // ==========================================================
  // NORMALISER LES ERREURS D'OLLAMA
  // ==========================================================

  normaliserErreurOllama(error) {
    if (error instanceof ErreurAssistant) {
      return error;
    }

    if (axios.isAxiosError(error)) {
      if (error.response) {
        const status =
          Number.isInteger(error.response.status) &&
          error.response.status >= 400 &&
          error.response.status <= 599
            ? error.response.status
            : 502;

        const messageErreur =
          typeof error.response.data?.error === 'string'
            ? error.response.data.error
            : 'Ollama n’a pas pu traiter la demande.';

        return new ErreurAssistant(messageErreur, status);
      }

      if (
        error.code === 'ECONNABORTED' ||
        error.code === 'ETIMEDOUT'
      ) {
        return new ErreurAssistant(
          'Le délai de réponse d’Ollama est dépassé.',
          504
        );
      }

      if (
        [
          'ECONNREFUSED',
          'ENOTFOUND',
          'ECONNRESET',
          'EHOSTUNREACH',
          'EAI_AGAIN',
        ].includes(error.code || '')
      ) {
        return new ErreurAssistant(
          'Impossible de joindre Ollama. Vérifiez que le service est démarré et que son adresse est correcte.',
          503
        );
      }
    }

    console.error(
      '[Arboria Assistant] Erreur de génération :',
      this.extraireMessageErreur(error)
    );

    return new ErreurAssistant(
      'Une erreur est survenue pendant la génération de la réponse.',
      500
    );
  }

  // ==========================================================
  // EXTRAIRE UN MESSAGE D'ERREUR
  // ==========================================================

  extraireMessageErreur(error) {
    if (error instanceof Error) {
      return error.message;
    }

    if (typeof error === 'string') {
      return error;
    }

    return 'Une erreur inconnue est survenue.';
  }
}

// ============================================================
// EXPORTS COMMONJS
// ============================================================

const assistantService = new AssistantService();

module.exports = assistantService;
module.exports.AssistantService = AssistantService;
module.exports.ErreurAssistant = ErreurAssistant;