import { CommonModule } from '@angular/common';
import {
  AfterViewChecked,
  Component,
  ElementRef,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import {
  HttpClient,
  HttpClientModule,
  HttpErrorResponse,
  HttpHeaders,
} from '@angular/common/http';
import { Router, RouterLink } from '@angular/router';
import { firstValueFrom } from 'rxjs';

// ============================================================
// 🌱 ARBORIA — WIDGET ASSISTANT
// Angular Standalone • TypeScript • Tailwind CSS
// Ollama Qwen3:8b • Streaming progressif • MongoDB
//
// • Affichage progressif des réponses
// • Flux SSE : fragment / termine / erreur
// • Historique et conversations MongoDB
// • Compatible avec les clés utilisateur existantes
// • Gestion des erreurs HTTP et du streaming
// • Annulation du flux à la destruction du composant
// • Aucun scan • Aucune caméra
// ============================================================

type RoleAssistant = 'user' | 'assistant';

interface ExempleAssistant {
  titre: string;
  message: string;
  icone: string;
}

interface MessageAssistant {
  role: RoleAssistant;
  contenu: string;
  date: number;
}

interface ConversationArboria {
  id: string;
  titre: string;
  messages: MessageAssistant[];
  dateCreation: number;
  dateModification?: number;
}

interface MessageApi {
  role?: RoleAssistant;
  contenu?: string;
  content?: string;
  message?: string;
  date?: number | string | Date;
}

interface ConversationApi {
  _id?: string;
  id?: string;
  titre?: string;
  messages?: MessageApi[];
  dateCreation?: number | string | Date;
  dateModification?: number | string | Date;
}

interface MessageReponseApi {
  contenu?: string;
  content?: string;
  message?: string;
}

interface ReponseAssistantApi {
  succes?: boolean;
  success?: boolean;
  conversationId?: string | null;
  reponse?: string;
  contenu?: string;
  message?: string | MessageReponseApi;
  date?: number | string | Date;
  modele?: string | null;
  conversation?: ConversationApi;
  conversations?: ConversationApi[];
  erreur?: string;
  error?: string;
  utilisateurId?: string;
}

interface ErreurApi {
  message?: string;
  erreur?: string;
  error?: string;
}

interface EvenementStreaming {
  succes?: boolean;
  success?: boolean;
  contenu?: string;
  conversationId?: string | null;
  utilisateurId?: string;
  reponse?: string;
  modele?: string | null;
  date?: number | string | Date;
  message?: string;
  erreur?: string;
}

interface UtilisateurLocal {
  _id?: string;
  id?: string;
  utilisateurId?: string;
  userId?: string;
  nom?: string;
  email?: string;
  token?: string;
  accessToken?: string;
  jwt?: string;
  utilisateur?: UtilisateurLocal | string | null;
  user?: UtilisateurLocal | string | null;
  session?: UtilisateurLocal | string | null;
  data?: UtilisateurLocal | null;
  profil?: UtilisateurLocal | string | null;
  compte?: UtilisateurLocal | string | null;
}

@Component({
  selector: 'app-widget-assistant',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterLink,
    HttpClientModule,
  ],
  templateUrl: './widget-assistant.html',
  styleUrl: './widget-assistant.css',
})
export class WidgetAssistant
  implements OnInit, AfterViewChecked, OnDestroy
{
  @ViewChild('fichierInput')
  fichierInput?: ElementRef<HTMLInputElement>;

  @ViewChild('messagesContainer')
  messagesContainer?: ElementRef<HTMLElement>;

  message = '';
  styleSelectionne = 'Style de réponse';

  stylesOuverts = false;
  reponsesDetaillees = true;

  rechercheOuverte = false;
  termeRecherche = '';

  fichierSelectionne: File | null = null;

  conversations: ConversationArboria[] = [];
  conversationActiveId: string | null = null;
  conversation: ConversationArboria | null = null;

  utilisateurId: string | null = null;

  private tokenUtilisateur: string | null = null;

  chargement = false;
  chargementHistorique = false;
  chargementConversation = false;

  erreurMessage = '';

  private defilerApresRendu = false;
  private detruit = false;
  private requeteEnCours = false;

  private controleurStreaming: AbortController | null = null;

  /**
   * Identifiant temporaire utilisé uniquement pendant
   * la génération d'une nouvelle conversation.
   */
  private conversationTemporaireId: string | null = null;

  private readonly apiUrl = 'http://localhost:3000/api/assistant';

  readonly stylesDisponibles: string[] = [
    'Simple et concis',
    'Détaillé',
    'Pédagogique',
    'Professionnel',
    'Style de réponse',
  ];

  readonly exemples: ExempleAssistant[] = [
    {
      titre: 'Créer un planning pour entretenir mes plantes',
      message:
        'Crée un planning hebdomadaire simple pour entretenir mes plantes.',
      icone: 'fa-solid fa-calendar-check',
    },
    {
      titre: 'Rédiger un message ou un e-mail',
      message: 'Aide-moi à rédiger un e-mail clair et professionnel.',
      icone: 'fa-regular fa-envelope',
    },
    {
      titre: 'Comprendre un sujet en quelques phrases',
      message:
        'Explique-moi un sujet complexe de manière simple et concise.',
      icone: 'fa-regular fa-comment-dots',
    },
    {
      titre: 'Obtenir des conseils techniques',
      message:
        'Donne-moi des conseils pratiques et détaille les étapes à suivre.',
      icone: 'fa-solid fa-code',
    },
  ];

  constructor(
    private readonly router: Router,
    private readonly http: HttpClient,
  ) {}

  // ==========================================================
  // INITIALISATION / DESTRUCTION
  // ==========================================================

  ngOnInit(): void {
    this.recupererUtilisateurConnecte();
    void this.chargerHistorique();
  }

  ngAfterViewChecked(): void {
    if (!this.defilerApresRendu || this.detruit) {
      return;
    }

    this.defilerApresRendu = false;
    this.defilerMessages();
  }

  ngOnDestroy(): void {
    this.detruit = true;
    this.controleurStreaming?.abort();
    this.controleurStreaming = null;
  }

  // ==========================================================
  // UTILISATEUR CONNECTÉ — LOCALSTORAGE
  // ==========================================================

  recupererUtilisateurConnecte(): void {
    if (typeof localStorage === 'undefined') {
      this.utilisateurId = null;
      this.tokenUtilisateur = null;
      return;
    }

    const clesUtilisateur = [
      'jardiscan_session',
      'utilisateur',
      'user',
    ];

    let utilisateurTrouve: string | null = null;
    let tokenTrouve: string | null = null;

    for (const cle of clesUtilisateur) {
      const valeur = localStorage.getItem(cle);

      if (!valeur) {
        continue;
      }

      const resultat = this.lireUtilisateurStocke(valeur);

      if (!utilisateurTrouve && resultat.utilisateurId) {
        utilisateurTrouve = resultat.utilisateurId;
      }

      if (!tokenTrouve && resultat.token) {
        tokenTrouve = resultat.token;
      }

      if (utilisateurTrouve && tokenTrouve) {
        break;
      }
    }

    const tokenDirect = localStorage.getItem('token');

    if (!tokenTrouve && tokenDirect?.trim()) {
      tokenTrouve = tokenDirect.trim();
    }

    this.utilisateurId = utilisateurTrouve;
    this.tokenUtilisateur = tokenTrouve;
  }

  private lireUtilisateurStocke(
    valeur: string,
  ): {
    utilisateurId: string | null;
    token: string | null;
  } {
    const texte = valeur.trim();

    if (!texte) {
      return {
        utilisateurId: null,
        token: null,
      };
    }

    try {
      const donnees: unknown = JSON.parse(texte);

      if (typeof donnees === 'string') {
        return {
          utilisateurId: this.estObjectId(donnees)
            ? donnees.trim()
            : null,
          token: null,
        };
      }

      if (
        !donnees ||
        typeof donnees !== 'object' ||
        Array.isArray(donnees)
      ) {
        return {
          utilisateurId: null,
          token: null,
        };
      }

      const utilisateur = donnees as UtilisateurLocal;

      return {
        utilisateurId: this.extraireIdUtilisateur(utilisateur),
        token: this.extraireTokenUtilisateur(utilisateur),
      };
    } catch {
      return {
        utilisateurId: this.estObjectId(texte) ? texte : null,
        token: null,
      };
    }
  }

  private extraireIdUtilisateur(
    utilisateur: UtilisateurLocal,
    profondeur = 0,
  ): string | null {
    if (profondeur > 5) {
      return null;
    }

    const identifiants = [
      utilisateur._id,
      utilisateur.id,
      utilisateur.utilisateurId,
      utilisateur.userId,
    ];

    for (const identifiant of identifiants) {
      if (
        typeof identifiant === 'string' &&
        this.estObjectId(identifiant)
      ) {
        return identifiant.trim();
      }
    }

    const objetsImbriques = [
      utilisateur.utilisateur,
      utilisateur.user,
      utilisateur.session,
      utilisateur.data,
      utilisateur.profil,
      utilisateur.compte,
    ];

    for (const objet of objetsImbriques) {
      if (typeof objet === 'string') {
        if (this.estObjectId(objet)) {
          return objet.trim();
        }

        const resultat = this.lireUtilisateurStocke(objet);

        if (resultat.utilisateurId) {
          return resultat.utilisateurId;
        }

        continue;
      }

      if (
        objet &&
        typeof objet === 'object' &&
        !Array.isArray(objet)
      ) {
        const id = this.extraireIdUtilisateur(
          objet as UtilisateurLocal,
          profondeur + 1,
        );

        if (id) {
          return id;
        }
      }
    }

    return null;
  }

  private extraireTokenUtilisateur(
    utilisateur: UtilisateurLocal,
    profondeur = 0,
  ): string | null {
    if (profondeur > 5) {
      return null;
    }

    const jetons = [
      utilisateur.token,
      utilisateur.accessToken,
      utilisateur.jwt,
    ];

    for (const jeton of jetons) {
      if (typeof jeton === 'string' && jeton.trim()) {
        return jeton.trim();
      }
    }

    const objetsImbriques = [
      utilisateur.utilisateur,
      utilisateur.user,
      utilisateur.session,
      utilisateur.data,
      utilisateur.profil,
      utilisateur.compte,
    ];

    for (const objet of objetsImbriques) {
      if (typeof objet === 'string') {
        try {
          const donnees: unknown = JSON.parse(objet);

          if (
            donnees &&
            typeof donnees === 'object' &&
            !Array.isArray(donnees)
          ) {
            const token = this.extraireTokenUtilisateur(
              donnees as UtilisateurLocal,
              profondeur + 1,
            );

            if (token) {
              return token;
            }
          }
        } catch {
          // La valeur peut être un simple identifiant.
        }

        continue;
      }

      if (
        objet &&
        typeof objet === 'object' &&
        !Array.isArray(objet)
      ) {
        const token = this.extraireTokenUtilisateur(
          objet as UtilisateurLocal,
          profondeur + 1,
        );

        if (token) {
          return token;
        }
      }
    }

    return null;
  }

  private estObjectId(valeur: string): boolean {
    return /^[a-f\d]{24}$/i.test(valeur.trim());
  }

  private obtenirOptionsHttp(): {
    headers: HttpHeaders;
  } {
    let headers = new HttpHeaders();

    if (this.tokenUtilisateur) {
      headers = headers.set(
        'Authorization',
        `Bearer ${this.tokenUtilisateur}`,
      );
    }

    return { headers };
  }

  /**
   * Construit les en-têtes utilisés par fetch() pour le streaming.
   */
  private obtenirEntetesStreaming(): Record<string, string> {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      Accept: 'text/event-stream',
    };

    if (this.tokenUtilisateur) {
      headers['Authorization'] = `Bearer ${this.tokenUtilisateur}`;
    }

    return headers;
  }

  // ==========================================================
  // CONVERSATION ACTIVE
  // ==========================================================

  get conversationActive(): ConversationArboria | undefined {
    return this.conversations.find(
      (item) => item.id === this.conversationActiveId,
    );
  }

  get messagesActifs(): MessageAssistant[] {
    return this.conversationActive?.messages ?? [];
  }

  get afficherAccueil(): boolean {
    return (
      !this.conversationActiveId &&
      !this.chargement &&
      !this.chargementConversation
    );
  }

  get conversationsTriees(): ConversationArboria[] {
    return [...this.conversations].sort(
      (a, b) =>
        (b.dateModification ?? b.dateCreation) -
        (a.dateModification ?? a.dateCreation),
    );
  }

  get conversationsFiltrees(): ConversationArboria[] {
    const recherche = this.termeRecherche
      .trim()
      .toLocaleLowerCase('fr');

    if (!recherche) {
      return this.conversationsTriees;
    }

    return this.conversationsTriees.filter((item) => {
      const titreCorrespond = item.titre
        .toLocaleLowerCase('fr')
        .includes(recherche);

      const messageCorrespond = item.messages.some((message) =>
        message.contenu.toLocaleLowerCase('fr').includes(recherche),
      );

      return titreCorrespond || messageCorrespond;
    });
  }

  get conversationsAujourdhui(): ConversationArboria[] {
    const debutJour = new Date();
    debutJour.setHours(0, 0, 0, 0);

    return this.conversationsFiltrees.filter(
      (item) => item.dateCreation >= debutJour.getTime(),
    );
  }

  get conversationsHier(): ConversationArboria[] {
    const debutHier = new Date();
    debutHier.setHours(0, 0, 0, 0);
    debutHier.setDate(debutHier.getDate() - 1);

    const finHier = new Date(debutHier);
    finHier.setDate(finHier.getDate() + 1);

    return this.conversationsFiltrees.filter(
      (item) =>
        item.dateCreation >= debutHier.getTime() &&
        item.dateCreation < finHier.getTime(),
    );
  }

  get conversationsPrecedentes(): ConversationArboria[] {
    const debutHier = new Date();
    debutHier.setHours(0, 0, 0, 0);
    debutHier.setDate(debutHier.getDate() - 1);

    return this.conversationsFiltrees.filter(
      (item) => item.dateCreation < debutHier.getTime(),
    );
  }

  // ==========================================================
  // CHARGER L'HISTORIQUE
  // ==========================================================

  async chargerHistorique(): Promise<void> {
    if (this.chargementHistorique || this.detruit) {
      return;
    }

    this.recupererUtilisateurConnecte();

    if (!this.utilisateurId) {
      this.conversations = [];
      this.conversationActiveId = null;
      this.conversation = null;
      this.chargementHistorique = false;
      return;
    }

    this.chargementHistorique = true;
    this.erreurMessage = '';

    try {
      const resultat = await firstValueFrom(
        this.http.get<ReponseAssistantApi>(
          `${this.apiUrl}/conversations`,
          {
            ...this.obtenirOptionsHttp(),
            params: {
              utilisateurId: this.utilisateurId,
            },
          },
        ),
      );

      if (this.detruit) {
        return;
      }

      if (resultat.succes === false || resultat.success === false) {
        throw new Error(
          this.extraireContenuReponse(resultat) ||
            'Impossible de charger les conversations.',
        );
      }

      this.conversations = (resultat.conversations ?? [])
        .map((item) => this.normaliserConversation(item))
        .filter(
          (item): item is ConversationArboria => item !== null,
        );

      if (
        this.conversationActiveId &&
        !this.conversations.some(
          (item) => item.id === this.conversationActiveId,
        )
      ) {
        this.conversationActiveId = null;
        this.conversation = null;
      }
    } catch (error: unknown) {
      if (!this.detruit) {
        this.erreurMessage = this.lireErreur(
          error,
          'Impossible de charger les conversations enregistrées.',
        );
      }
    } finally {
      this.chargementHistorique = false;
    }
  }

  // ==========================================================
  // NOUVELLE CONVERSATION
  // ==========================================================

  nouvelleConversation(): void {
    if (this.chargement) {
      return;
    }

    this.conversationActiveId = null;
    this.conversation = null;
    this.conversationTemporaireId = null;
    this.message = '';
    this.fichierSelectionne = null;

    this.stylesOuverts = false;
    this.rechercheOuverte = false;
    this.termeRecherche = '';

    this.erreurMessage = '';
    this.chargementConversation = false;
    this.reinitialiserInputFichier();
  }

  // ==========================================================
  // CHARGER UNE CONVERSATION
  // ==========================================================

  async chargerConversation(id: string): Promise<void> {
    if (
      !id ||
      this.chargementConversation ||
      this.chargement ||
      this.detruit
    ) {
      return;
    }

    this.recupererUtilisateurConnecte();

    if (!this.utilisateurId) {
      this.erreurMessage =
        'Impossible de retrouver ton identifiant utilisateur. Reconnecte-toi puis réessaie.';
      return;
    }

    this.erreurMessage = '';
    this.message = '';
    this.fichierSelectionne = null;
    this.stylesOuverts = false;
    this.chargementConversation = true;

    this.reinitialiserInputFichier();

    const conversationLocale = this.conversations.find(
      (item) => item.id === id,
    );

    if (conversationLocale) {
      this.conversationActiveId = id;
      this.conversation = conversationLocale;
      this.defilerApresRendu = true;
    }

    try {
      const resultat = await firstValueFrom(
        this.http.get<ReponseAssistantApi>(
          `${this.apiUrl}/conversations/${encodeURIComponent(id)}`,
          {
            ...this.obtenirOptionsHttp(),
            params: {
              utilisateurId: this.utilisateurId,
            },
          },
        ),
      );

      if (this.detruit) {
        return;
      }

      if (resultat.succes === false || resultat.success === false) {
        throw new Error(
          this.extraireContenuReponse(resultat) ||
            'Impossible de charger cette conversation.',
        );
      }

      if (!resultat.conversation) {
        if (!conversationLocale) {
          throw new Error(
            'Le serveur n’a pas renvoyé les détails de cette conversation.',
          );
        }
      } else {
        const conversation = this.normaliserConversation(
          resultat.conversation,
        );

        if (!conversation) {
          throw new Error(
            'Les données de cette conversation sont invalides.',
          );
        }

        this.ajouterOuRemplacerConversation(conversation);
        this.conversationActiveId = conversation.id;
        this.conversation = conversation;
      }

      this.defilerApresRendu = true;
    } catch (error: unknown) {
      if (!this.detruit) {
        this.erreurMessage = this.lireErreur(
          error,
          'Impossible de charger cette conversation.',
        );
      }
    } finally {
      this.chargementConversation = false;
    }
  }

  // ==========================================================
  // RECHERCHE
  // ==========================================================

  rechercherConversation(): void {
    this.rechercheOuverte = !this.rechercheOuverte;

    if (!this.rechercheOuverte) {
      this.termeRecherche = '';
    }
  }

  fermerRecherche(): void {
    this.rechercheOuverte = false;
    this.termeRecherche = '';
  }

  // ==========================================================
  // STYLES DE RÉPONSE
  // ==========================================================

  basculerStyles(): void {
    this.stylesOuverts = !this.stylesOuverts;
  }

  selectionnerStyle(style: string): void {
    if (!this.stylesDisponibles.includes(style)) {
      return;
    }

    this.styleSelectionne = style;
    this.stylesOuverts = false;
  }

  utiliserExemple(message: string): void {
    this.message = message;
    this.erreurMessage = '';
  }

  utiliserSuggestion(message: string): void {
    this.utiliserExemple(message);
  }

  basculerReponsesDetaillees(): void {
    this.reponsesDetaillees = !this.reponsesDetaillees;
  }

  // ==========================================================
  // PIÈCES JOINTES
  // ==========================================================

  ouvrirPieceJointe(): void {
    this.fichierInput?.nativeElement.click();
  }

  traiterPieceJointe(event: Event): void {
    const input = event.target as HTMLInputElement;
    const fichier = input.files?.[0] ?? null;

    if (!fichier) {
      return;
    }

    const extensionsAutorisees = [
      '.pdf',
      '.txt',
      '.doc',
      '.docx',
    ];

    const nom = fichier.name.toLocaleLowerCase('fr');

    const extensionAutorisee = extensionsAutorisees.some(
      (extension) => nom.endsWith(extension),
    );

    const imageAutorisee = fichier.type.startsWith('image/');

    if (!imageAutorisee && !extensionAutorisee) {
      this.fichierSelectionne = null;
      this.erreurMessage =
        'Format non pris en charge. Choisis une image, un PDF, un TXT, un DOC ou un DOCX.';
      input.value = '';
      return;
    }

    if (fichier.size > 10 * 1024 * 1024) {
      this.fichierSelectionne = null;
      this.erreurMessage =
        'Le fichier ne doit pas dépasser 10 Mo.';
      input.value = '';
      return;
    }

    this.fichierSelectionne = fichier;
    this.erreurMessage = '';
  }

  retirerPieceJointe(): void {
    this.fichierSelectionne = null;
    this.reinitialiserInputFichier();
  }

  private reinitialiserInputFichier(): void {
    if (this.fichierInput) {
      this.fichierInput.nativeElement.value = '';
    }
  }

  // ==========================================================
  // CLAVIER
  // ==========================================================

  gererClavier(event: KeyboardEvent): void {
    if (
      event.key === 'Enter' &&
      !event.shiftKey &&
      !event.isComposing
    ) {
      event.preventDefault();
      void this.envoyerMessage();
    }
  }

  // ==========================================================
  // ENVOYER UN MESSAGE EN STREAMING
  // ==========================================================

  async envoyerMessage(): Promise<void> {
    const contenu = this.message.trim();

    if (
      !contenu ||
      this.chargement ||
      this.chargementConversation ||
      this.requeteEnCours ||
      this.detruit
    ) {
      return;
    }

    this.recupererUtilisateurConnecte();

    if (!this.utilisateurId) {
      this.erreurMessage =
        'Impossible de retrouver l’identifiant de ton compte. Vérifie que user, utilisateur ou jardiscan_session contient un identifiant MongoDB valide.';
      return;
    }

    if (this.fichierSelectionne) {
      this.erreurMessage =
        'Les pièces jointes sont sélectionnables, mais leur traitement doit être ajouté au backend avant de pouvoir les envoyer à l’assistant.';
      return;
    }

    this.erreurMessage = '';
    this.chargement = true;
    this.requeteEnCours = true;

    const conversationExistante = this.conversationActive;

    const historique = (conversationExistante?.messages ?? [])
      .filter((item) => item.contenu.trim().length > 0)
      .slice(-20)
      .map((item) => ({
        role: item.role,
        contenu: item.contenu,
      }));

    const payload = {
      conversationId: conversationExistante?.id ?? null,
      message: contenu,
      style: this.styleSelectionne,
      reponsesDetaillees: this.reponsesDetaillees,
      historique,
      utilisateurId: this.utilisateurId,
    };

    const controleur = new AbortController();
    this.controleurStreaming = controleur;

    // --------------------------------------------------------
    // 1. PRÉPARER LA CONVERSATION LOCALE
    // --------------------------------------------------------

    const maintenant = Date.now();

    let conversationLocale = conversationExistante;

    if (!conversationLocale) {
      const idTemporaire = `temp-${maintenant}`;

      this.conversationTemporaireId = idTemporaire;

      conversationLocale = {
        id: idTemporaire,
        titre: this.creerTitre(contenu),
        messages: [],
        dateCreation: maintenant,
        dateModification: maintenant,
      };

      this.ajouterOuRemplacerConversation(conversationLocale);
      this.conversationActiveId = idTemporaire;
    }

    const messageUtilisateur: MessageAssistant = {
      role: 'user',
      contenu,
      date: maintenant,
    };

    const messageAssistant: MessageAssistant = {
      role: 'assistant',
      contenu: '',
      date: Date.now(),
    };

    conversationLocale.messages.push(
      messageUtilisateur,
      messageAssistant,
    );

    conversationLocale.dateModification = Date.now();

    this.conversation = conversationLocale;
    this.message = '';
    this.retirerPieceJointe();
    this.defilerApresRendu = true;

    let fluxTermine = false;
    let texteComplet = '';

    try {
      // ------------------------------------------------------
      // 2. APPEL DE LA ROUTE STREAMING EXPRESS
      // ------------------------------------------------------

      const response = await fetch(
        `${this.apiUrl}/message/stream`,
        {
          method: 'POST',
          headers: this.obtenirEntetesStreaming(),
          body: JSON.stringify(payload),
          signal: controleur.signal,
        },
      );

      if (!response.ok) {
        const corps = await response.text();
        let messageErreur = `Erreur HTTP ${response.status}.`;

        try {
          const donnees = JSON.parse(corps) as ErreurApi;

          messageErreur =
            donnees.message ??
            donnees.erreur ??
            donnees.error ??
            messageErreur;
        } catch {
          if (corps.trim()) {
            messageErreur = corps;
          }
        }

        throw new Error(messageErreur);
      }

      if (!response.body) {
        throw new Error(
          'Le navigateur ne permet pas de lire le flux de réponse.',
        );
      }

      // ------------------------------------------------------
      // 3. LECTURE PROGRESSIVE DU FLUX SSE
      // ------------------------------------------------------

      const lecteur = response.body.getReader();
      const decodeur = new TextDecoder('utf-8');

      let tampon = '';

      const traiterEvenement = (bloc: string): void => {
        if (!bloc.trim()) {
          return;
        }

        let typeEvenement = 'message';
        const lignesDonnees: string[] = [];

        for (const ligne of bloc.split(/\r?\n/)) {
          if (ligne.startsWith('event:')) {
            typeEvenement = ligne.slice(6).trim();
          } else if (ligne.startsWith('data:')) {
            lignesDonnees.push(ligne.slice(5).trimStart());
          }
        }

        if (!lignesDonnees.length) {
          return;
        }

        const texteDonnees = lignesDonnees.join('\n');

        let donnees: EvenementStreaming;

        try {
          donnees = JSON.parse(texteDonnees) as EvenementStreaming;
        } catch {
          throw new Error(
            'Le serveur a envoyé un événement de streaming invalide.',
          );
        }

        // Un fragment est immédiatement ajouté au message affiché.
        if (typeEvenement === 'fragment') {
          const fragment = donnees.contenu;

          if (typeof fragment === 'string' && fragment.length > 0) {
            texteComplet += fragment;
            messageAssistant.contenu += fragment;

            conversationLocale!.dateModification = Date.now();

            this.conversation = conversationLocale;
            this.defilerApresRendu = true;
          }

          return;
        }

        // Événement final envoyé après la sauvegarde MongoDB.
        if (typeEvenement === 'termine') {
          fluxTermine = true;

          if (typeof donnees.reponse === 'string') {
            texteComplet = donnees.reponse;
            messageAssistant.contenu = donnees.reponse;
          }

          const idServeur = donnees.conversationId;

          if (typeof idServeur === 'string' && idServeur.trim()) {
            const ancienId = conversationLocale!.id;

            conversationLocale!.id = idServeur;
            conversationLocale!.dateModification =
              this.normaliserDate(donnees.date);

            if (this.conversationActiveId === ancienId) {
              this.conversationActiveId = idServeur;
            }

            if (this.conversationTemporaireId === ancienId) {
              this.conversationTemporaireId = null;
            }

            this.ajouterOuRemplacerConversation(conversationLocale!);
            this.conversation = conversationLocale;
          }

          this.defilerApresRendu = true;
          return;
        }

        if (typeEvenement === 'erreur') {
          throw new Error(
            donnees.message ||
              donnees.erreur ||
              'Une erreur est survenue pendant la génération.',
          );
        }
      };

      while (true) {
        const { value, done } = await lecteur.read();

        if (done) {
          tampon += decodeur.decode();
          break;
        }

        tampon += decodeur.decode(value, { stream: true });

        // SSE utilise une ligne vide pour séparer les événements.
        const blocs = tampon.split(/\r?\n\r?\n/);
        tampon = blocs.pop() ?? '';

        for (const bloc of blocs) {
          traiterEvenement(bloc);
        }
      }

      // Traiter un éventuel dernier événement sans séparateur final.
      if (tampon.trim()) {
        traiterEvenement(tampon);
      }

      if (!fluxTermine) {
        throw new Error(
          'Le flux s’est terminé avant la confirmation de sauvegarde de la conversation.',
        );
      }

      if (!texteComplet.trim()) {
        throw new Error(
          'L’assistant n’a renvoyé aucun texte.',
        );
      }

      // ------------------------------------------------------
      // 4. FINALISER LA CONVERSATION LOCALE
      // ------------------------------------------------------

      messageAssistant.contenu = texteComplet.trim();
      conversationLocale.dateModification = Date.now();

      this.ajouterOuRemplacerConversation(conversationLocale);
      this.conversationActiveId = conversationLocale.id;
      this.conversation = conversationLocale;

      this.defilerApresRendu = true;
    } catch (error: unknown) {
      if (controleur.signal.aborted || this.detruit) {
        return;
      }

      this.erreurMessage = this.lireErreur(
        error,
        'Impossible de générer la réponse. Vérifie Ollama et le backend.',
      );

      // Le message partiel reste visible, sans prétendre
      // que la génération a été enregistrée par le serveur.
      if (!messageAssistant.contenu.trim()) {
        const index = conversationLocale.messages.indexOf(
          messageAssistant,
        );

        if (index !== -1) {
          conversationLocale.messages.splice(index, 1);
        }
      }

      if (!conversationLocale.messages.length) {
        this.conversations = this.conversations.filter(
          (item) => item.id !== conversationLocale!.id,
        );

        this.conversationActiveId = null;
        this.conversation = null;
        this.conversationTemporaireId = null;
      } else {
        this.conversation = conversationLocale;
        this.ajouterOuRemplacerConversation(conversationLocale);
      }

      this.defilerApresRendu = true;
    } finally {
      if (this.controleurStreaming === controleur) {
        this.controleurStreaming = null;
      }

      this.chargement = false;
      this.requeteEnCours = false;
    }
  }

  // ==========================================================
  // AFFICHAGE
  // ==========================================================

  private defilerMessages(): void {
    const conteneur = this.messagesContainer?.nativeElement;

    if (conteneur) {
      conteneur.scrollTop = conteneur.scrollHeight;
    }
  }

  formaterHeure(date: number): string {
    return new Intl.DateTimeFormat('fr-FR', {
      hour: '2-digit',
      minute: '2-digit',
    }).format(new Date(date));
  }

  formaterDate(date: number): string {
    return new Intl.DateTimeFormat('fr-FR', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    }).format(new Date(date));
  }

  // ==========================================================
  // NORMALISATION API / MONGODB
  // ==========================================================

  private normaliserConversation(
    source: ConversationApi,
  ): ConversationArboria | null {
    const id = source._id ?? source.id;

    if (typeof id !== 'string' || !id.trim()) {
      return null;
    }

    const messages: MessageAssistant[] = (source.messages ?? [])
      .filter(
        (item) =>
          (item.role === 'user' || item.role === 'assistant') &&
          typeof (item.contenu ?? item.content ?? item.message) ===
            'string',
      )
      .map((item) => ({
        role: item.role as RoleAssistant,
        contenu: item.contenu ?? item.content ?? item.message ?? '',
        date: this.normaliserDate(item.date),
      }));

    return {
      id,
      titre:
        source.titre?.trim() ||
        this.creerTitre(
          messages[0]?.contenu ?? 'Nouvelle conversation',
        ),
      messages,
      dateCreation: this.normaliserDate(source.dateCreation),
      dateModification: this.normaliserDate(
        source.dateModification ?? source.dateCreation,
      ),
    };
  }

  private ajouterOuRemplacerConversation(
    conversation: ConversationArboria,
  ): void {
    const index = this.conversations.findIndex(
      (item) => item.id === conversation.id,
    );

    if (index === -1) {
      this.conversations = [
        conversation,
        ...this.conversations,
      ];
      return;
    }

    this.conversations = this.conversations.map((item, i) =>
      i === index ? conversation : item,
    );
  }

  private normaliserDate(
    valeur?: number | string | Date,
  ): number {
    if (valeur instanceof Date) {
      const timestamp = valeur.getTime();

      return Number.isFinite(timestamp) ? timestamp : Date.now();
    }

    if (typeof valeur === 'number' && Number.isFinite(valeur)) {
      return valeur < 100_000_000_000
        ? valeur * 1000
        : valeur;
    }

    if (typeof valeur === 'string' && valeur.trim()) {
      const timestamp = new Date(valeur).getTime();

      if (Number.isFinite(timestamp)) {
        return timestamp;
      }

      const numerique = Number(valeur);

      if (Number.isFinite(numerique)) {
        return numerique < 100_000_000_000
          ? numerique * 1000
          : numerique;
      }
    }

    return Date.now();
  }

  private extraireContenuReponse(
    resultat: ReponseAssistantApi,
  ): string {
    if (typeof resultat.reponse === 'string') {
      return resultat.reponse;
    }

    if (typeof resultat.contenu === 'string') {
      return resultat.contenu;
    }

    if (typeof resultat.message === 'string') {
      return resultat.message;
    }

    if (
      resultat.message &&
      typeof resultat.message === 'object'
    ) {
      return (
        resultat.message.contenu ??
        resultat.message.content ??
        resultat.message.message ??
        ''
      );
    }

    return '';
  }

  private lireErreur(
    error: unknown,
    messageParDefaut: string,
  ): string {
    if (error instanceof HttpErrorResponse) {
      const corps = error.error as ErreurApi | string | null;

      if (typeof corps === 'string' && corps.trim()) {
        return corps;
      }

      if (corps && typeof corps === 'object') {
        const message =
          corps.message ?? corps.erreur ?? corps.error;

        if (typeof message === 'string' && message.trim()) {
          return message;
        }
      }

      if (error.status === 0) {
        return 'Le serveur est inaccessible. Vérifie que le backend est démarré sur le port 3000.';
      }

      if (error.status === 401) {
        return 'Utilisateur non identifié ou authentification refusée. Vérifie la session et le middleware backend.';
      }

      if (error.status === 403) {
        return 'Tu n’es pas autorisé à accéder à cette conversation.';
      }

      if (error.status === 404) {
        return 'La route de streaming est introuvable. Vérifie Assistant.routes.js.';
      }

      if (error.status === 503) {
        return 'Ollama ou MongoDB est indisponible.';
      }

      if (error.status === 504) {
        return 'Ollama met trop de temps à répondre.';
      }

      return messageParDefaut;
    }

    if (error instanceof Error) {
      return error.message || messageParDefaut;
    }

    return messageParDefaut;
  }

  private creerTitre(message: string): string {
    const titre = message.replace(/\s+/g, ' ').trim();

    return titre.length > 42
      ? `${titre.slice(0, 39).trimEnd()}…`
      : titre || 'Nouvelle conversation';
  }

  // ==========================================================
  // NAVIGATION
  // ==========================================================

  ouvrirDecouverte(): void {
    void this.router.navigate(['/decouvrir']);
  }

  ouvrirParametres(): void {
    void this.router.navigate(['/parametre']);
  }
}
