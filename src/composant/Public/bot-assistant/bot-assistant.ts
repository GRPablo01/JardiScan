import {
  AfterViewChecked,
  Component,
  ElementRef,
  OnDestroy,
  OnInit,
  ViewChild
} from '@angular/core';

import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

import {
  PlantService,
  Plant,
  PlantApiResponse
} from '../../../../Backend/Services/plant.service';

import { ThemeService } from '../../../../Backend/Services/theme.service';


// ============================================================
// 💬 MESSAGE
// ============================================================

interface Message {
  id: number;
  sender: 'bot' | 'user';
  text: string;
  time: string;
}


// ============================================================
// 🤖 ÉTAT DU BOT
// ============================================================

type BotState =
  | 'idle'
  | 'thinking'
  | 'speaking';


// ============================================================
// 🌱 CHAMPS PLANTE
// ============================================================

type PlantField =
  | 'description'
  | 'nomCommun'
  | 'nomScientifique'
  | 'origine'
  | 'famille'
  | 'genre'
  | 'espece'
  | 'categorie'
  | 'sousCategorie'
  | 'exposition'
  | 'arrosage'
  | 'sol'
  | 'humidite'
  | 'engrais'
  | 'taille'
  | 'hauteur'
  | 'floraison'
  | 'periodeFloraison'
  | 'periodeRecolte'
  | 'cycle'
  | 'couleur'
  | 'toxicite'
  | 'comestible'
  | 'partiesDangereuses'
  | 'conseils'
  | 'maladies'
  | 'parasites';


// ============================================================
// 🤖 BOT ASSISTANT — JARDISCAN
// ============================================================

@Component({
  selector: 'app-bot-assistant',

  standalone: true,

  imports: [
    CommonModule,
    FormsModule,
    HttpClientModule
  ],

  templateUrl: './bot-assistant.html',
  styleUrl: './bot-assistant.css'
})
export class BotAssistant
  implements OnInit, OnDestroy, AfterViewChecked {

  // ============================================================
  // 🎯 ELEMENTS HTML
  // ============================================================

  @ViewChild('messagesContainer')
  private messagesContainer?: ElementRef<HTMLDivElement>;

  @ViewChild('messageInput')
  private messageInput?: ElementRef<HTMLTextAreaElement>;


  // ============================================================
  // 💉 CONSTRUCTEUR
  // ============================================================

  constructor(
    public themeService: ThemeService,
    private plantService: PlantService
  ) {}


  // ============================================================
  // 🤖 ÉTAT DU BOT
  // ============================================================

  /**
   * Contrôle la visibilité complète du bot.
   *
   * true :
   * - avatar visible
   * - chat éventuellement visible
   *
   * false :
   * - avatar caché
   * - chat caché
   */
  showMessage = false;


  /**
   * Contrôle UNIQUEMENT la conversation.
   *
   * true  = chat ouvert
   * false = chat fermé
   *
   * L'avatar reste visible dans les deux cas.
   */
  chatOpen = false;


  /**
   * Animation de disparition complète.
   */
  isHiding = false;


  /**
   * État interne du bot.
   */
  botState: BotState = 'idle';


  // ============================================================
  // 🌱 PLANTES
  // ============================================================

  plants: Plant[] = [];

  plantsLoading = true;

  plantsError = false;


  // ============================================================
  // 💬 MESSAGE D'ACCUEIL
  // ============================================================

  fullMessage =
    "Qu'est-ce que je peux faire pour vous ?";

  displayedMessage = '';


  // ============================================================
  // ⌨️ INPUT UTILISATEUR
  // ============================================================

  userInput = '';


  // ============================================================
  // 🗂️ HISTORIQUE
  // ============================================================

  messages: Message[] = [];


  // ============================================================
  // 🔢 IDS
  // ============================================================

  private messageId = 0;


  // ============================================================
  // ⏱️ TIMERS
  // ============================================================

  private messageTimer?: ReturnType<typeof setTimeout>;

  private typingInterval?: ReturnType<typeof setInterval>;

  private typingStartTimer?: ReturnType<typeof setTimeout>;

  private responseTimer?: ReturnType<typeof setTimeout>;

  private responseTypingInterval?: ReturnType<typeof setInterval>;


  // ============================================================
  // 🚀 INITIALISATION
  // ============================================================

  ngOnInit(): void {

    this.loadPlants();

    // ----------------------------------------------------------
    // 💬 APPARITION AUTOMATIQUE
    // ----------------------------------------------------------

    this.messageTimer = setTimeout(() => {

      if (this.isHiding) {
        return;
      }

      this.showMessage = true;

      /**
       * IMPORTANT :
       * Le bot apparaît avec son avatar,
       * mais la conversation reste fermée.
       */
      this.chatOpen = false;

      this.botState = 'idle';

    }, 2000);
  }


  // ============================================================
  // 🌱 RÉCUPÉRER TOUTES LES PLANTES
  // ============================================================

  private loadPlants(): void {

    this.plantsLoading = true;
    this.plantsError = false;

    console.log(
      '🌱 [BotAssistant] Récupération des plantes...'
    );

    this.plantService.getPlants().subscribe({

      next: (
        response: Plant[] | PlantApiResponse
      ) => {

        this.plants =
          this.extractPlants(response);

        this.plantsLoading = false;

        console.log(
          '🌿 [BotAssistant] Plantes récupérées :',
          this.plants.length
        );

      },

      error: (error) => {

        console.error(
          '❌ [BotAssistant] Erreur récupération plantes :',
          error
        );

        this.plants = [];
        this.plantsLoading = false;
        this.plantsError = true;
      }

    });
  }


  // ============================================================
  // 🌱 EXTRAIRE LES PLANTES
  // ============================================================

  private extractPlants(
    response: Plant[] | PlantApiResponse
  ): Plant[] {

    if (Array.isArray(response)) {

      return response.filter(
        (plant): plant is Plant =>
          this.isValidPlant(plant)
      );
    }

    if (
      !response ||
      typeof response !== 'object'
    ) {

      return [];
    }

    if (Array.isArray(response.plants)) {

      return response.plants.filter(
        (plant): plant is Plant =>
          this.isValidPlant(plant)
      );
    }

    if (
      response.plant &&
      this.isValidPlant(response.plant)
    ) {

      return [
        response.plant
      ];
    }

    if (Array.isArray(response.data)) {

      return response.data.filter(
        (plant): plant is Plant =>
          this.isValidPlant(plant)
      );
    }

    if (
      response.data &&
      this.isValidPlant(response.data)
    ) {

      return [
        response.data
      ];
    }

    console.warn(
      '⚠️ [BotAssistant] Format API plantes inconnu :',
      response
    );

    return [];
  }


  // ============================================================
  // ✅ VALIDATION PLANTE
  // ============================================================

  private isValidPlant(
    plant: unknown
  ): plant is Plant {

    if (
      !plant ||
      typeof plant !== 'object'
    ) {

      return false;
    }

    const value =
      plant as Partial<Plant>;

    return (
      typeof value.nomCommun === 'string' ||
      typeof value.nomScientifique === 'string'
    );
  }


  // ============================================================
  // 🔘 TOGGLE CONVERSATION
  // ============================================================

  /**
   * Ouvre / ferme UNIQUEMENT le chat.
   *
   * L'avatar ne disparaît jamais ici.
   */
  toggleMessage(): void {

    if (this.isHiding) {
      return;
    }

    /**
     * Sécurité :
     * si l'utilisateur clique sur l'avatar après
     * l'apparition du bot, on s'assure que celui-ci
     * reste visible.
     */
    this.showMessage = true;

    this.chatOpen = !this.chatOpen;

    // ----------------------------------------------------------
    // 🔓 OUVERTURE
    // ----------------------------------------------------------

    if (this.chatOpen) {

      /**
       * Message d'accueil uniquement lorsqu'il
       * n'y a encore aucune conversation.
       */
      if (
        !this.displayedMessage &&
        this.messages.length === 0
      ) {

        this.startTyping();
      }

      this.focusInput();

      return;
    }

    // ----------------------------------------------------------
    // 🔒 FERMETURE DU CHAT
    // ----------------------------------------------------------

    this.stopTyping();
    this.stopResponseTyping();

    if (this.responseTimer) {

      clearTimeout(
        this.responseTimer
      );

      this.responseTimer = undefined;
    }

    this.botState = 'idle';
  }


  // ============================================================
  // ✖️ FERMER UNIQUEMENT LE CHAT
  // ============================================================

  /**
   * Le X du header ferme UNIQUEMENT la conversation.
   *
   * Il ne :
   * - cache pas l'avatar
   * - ne vide pas l'historique
   * - ne modifie pas showMessage
   */
  closeChat(): void {

    if (this.isHiding) {
      return;
    }

    this.chatOpen = false;

    this.stopTyping();
    this.stopResponseTyping();

    if (this.responseTimer) {

      clearTimeout(
        this.responseTimer
      );

      this.responseTimer = undefined;
    }

    this.botState = 'idle';
  }


  // ============================================================
  // ❌ MASQUER COMPLÈTEMENT LE BOT
  // ============================================================

  /**
   * Ferme complètement le bot.
   *
   * Cette méthode est volontairement séparée
   * de closeChat().
   */
  hideMessage(): void {

    if (this.isHiding) {
      return;
    }

    this.isHiding = true;

    this.chatOpen = false;

    this.stopTyping();
    this.stopResponseTyping();

    if (this.responseTimer) {

      clearTimeout(
        this.responseTimer
      );

      this.responseTimer = undefined;
    }

    this.botState = 'idle';

    setTimeout(() => {

      this.showMessage = false;

      this.isHiding = false;

    }, 450);
  }


  // ============================================================
  // ✍️ MESSAGE D'ACCUEIL — TYPING
  // ============================================================

  startTyping(): void {

    this.stopTyping();

    this.displayedMessage = '';

    this.botState = 'speaking';

    let index = 0;

    this.typingStartTimer =
      setTimeout(() => {

        this.typingInterval =
          setInterval(() => {

            if (
              index < this.fullMessage.length
            ) {

              this.displayedMessage +=
                this.fullMessage.charAt(index);

              index++;

              return;
            }

            this.stopTyping();

            this.botState = 'idle';

          }, 40);

      }, 250);
  }


  // ============================================================
  // 🛑 STOP TYPING ACCUEIL
  // ============================================================

  stopTyping(): void {

    if (this.typingInterval) {

      clearInterval(
        this.typingInterval
      );

      this.typingInterval = undefined;
    }

    if (this.typingStartTimer) {

      clearTimeout(
        this.typingStartTimer
      );

      this.typingStartTimer = undefined;
    }
  }


  // ============================================================
  // ⌨️ CLAVIER
  // ============================================================

  onInputKeydown(
    event: KeyboardEvent
  ): void {

    if (
      event.key === 'Enter' &&
      !event.shiftKey
    ) {

      event.preventDefault();

      this.sendMessage();
    }
  }


  // ============================================================
  // 📤 ENVOYER MESSAGE
  // ============================================================

  sendMessage(): void {

    const text =
      this.userInput.trim();

    if (!text) {
      return;
    }

    if (
      this.botState === 'thinking'
    ) {

      return;
    }

    // ----------------------------------------------------------
    // 🔓 SÉCURISER L'OUVERTURE
    // ----------------------------------------------------------

    this.showMessage = true;
    this.chatOpen = true;


    // ----------------------------------------------------------
    // 👤 MESSAGE UTILISATEUR
    // ----------------------------------------------------------

    this.messages.push({

      id: ++this.messageId,

      sender: 'user',

      text,

      time: this.getCurrentTime()
    });


    // ----------------------------------------------------------
    // 🧹 INPUT
    // ----------------------------------------------------------

    this.userInput = '';


    // ----------------------------------------------------------
    // 🤖 BOT RÉFLÉCHIT
    // ----------------------------------------------------------

    this.displayedMessage = '';

    this.stopTyping();

    this.stopResponseTyping();

    this.botState = 'thinking';


    // ----------------------------------------------------------
    // ⏱️ PAUSE NATURELLE
    // ----------------------------------------------------------

    if (this.responseTimer) {

      clearTimeout(
        this.responseTimer
      );
    }

    this.responseTimer =
      setTimeout(() => {

        this.responseTimer =
          undefined;

        const response =
          this.getBotResponse(text);

        this.addBotMessage(response);

      }, 900);
  }


  // ============================================================
  // 🤖 AJOUTER UNE RÉPONSE DU BOT
  // ============================================================

  private addBotMessage(
    text: string
  ): void {

    this.stopResponseTyping();

    this.botState = 'speaking';

    this.displayedMessage = '';

    let index = 0;

    this.responseTypingInterval =
      setInterval(() => {

        if (
          index < text.length
        ) {

          this.displayedMessage +=
            text.charAt(index);

          index++;

          return;
        }

        this.stopResponseTyping();

        this.messages.push({

          id: ++this.messageId,

          sender: 'bot',

          text: this.displayedMessage,

          time: this.getCurrentTime()
        });

        this.displayedMessage = '';

        this.botState = 'idle';

      }, 35);
  }


  // ============================================================
  // 🛑 STOP TYPING RÉPONSE
  // ============================================================

  private stopResponseTyping(): void {

    if (
      this.responseTypingInterval
    ) {

      clearInterval(
        this.responseTypingInterval
      );

      this.responseTypingInterval =
        undefined;
    }
  }


  // ============================================================
  // ⚡ QUESTION RAPIDE
  // ============================================================

  quickAsk(
    text: string
  ): void {

    if (
      this.botState === 'thinking'
    ) {

      return;
    }

    this.showMessage = true;

    this.chatOpen = true;

    this.userInput = text;

    this.sendMessage();
  }


  // ============================================================
  // 🧠 RÉPONSE DU BOT
  // ============================================================

  private getBotResponse(
    question: string
  ): string {

    const q =
      this.normalizeText(question);


    // ==========================================================
    // 👋 SALUT
    // ==========================================================

    if (
      this.containsAny(q, [
        'bonjour',
        'salut',
        'hello',
        'bonsoir',
        'coucou'
      ])
    ) {

      return (
        "Bonjour 🌱 ! Je suis l'assistant JardiScan. " +
        "Comment puis-je vous aider ?"
      );
    }


    // ==========================================================
    // 🌱 JARDISCAN
    // ==========================================================

    if (
      q.includes('jardiscan') ||
      q.includes('application') ||
      q === 'app' ||
      q.includes('fonctionne')
    ) {

      return (
        "JardiScan vous aide à identifier vos plantes " +
        "et à mieux les entretenir. Vous pouvez notamment " +
        "utiliser le scanner pour analyser une plante à partir " +
        "d'une photo."
      );
    }


    // ==========================================================
    // 🔢 NOMBRE DE PLANTES
    // ==========================================================

    if (
      q.includes('combien de plantes') ||
      q.includes('nombre de plantes') ||
      q.includes('combien de plante') ||
      q.includes('nombre de plante') ||
      q.includes('combien y a')
    ) {

      if (this.plantsLoading) {

        return (
          "Je récupère actuellement toutes les plantes " +
          "présentes dans la base de données 🌱..."
        );
      }

      if (this.plantsError) {

        return (
          "Je n'arrive pas à accéder à la base de données " +
          "des plantes pour le moment."
        );
      }

      const count =
        this.plants.length;

      return (
        `La base de données contient actuellement ${count} ` +
        `plante${count > 1 ? 's' : ''} 🌿.`
      );
    }


    // ==========================================================
    // 📋 LISTE DES PLANTES
    // ==========================================================

    if (
      q.includes('liste des plantes') ||
      q.includes('liste plante') ||
      q.includes('quelles plantes') ||
      q.includes('quels plantes') ||
      q.includes('plantes disponibles') ||
      q.includes('plantes dans la base') ||
      q.includes('plantes presentes') ||
      q.includes('toutes les plantes')
    ) {

      return this.buildPlantListResponse();
    }


    // ==========================================================
    // 🌱 RECHERCHE D'UNE PLANTE
    // ==========================================================

    const plantFound =
      this.findPlant(question);

    if (plantFound) {

      return this.buildSpecificPlantResponse(
        plantFound,
        q
      );
    }


    // ==========================================================
    // 💧 ARROSAGE GÉNÉRAL
    // ==========================================================

    if (
      q.includes('arroser') ||
      q.includes('arrosage') ||
      q.includes('eau')
    ) {

      return (
        "L'arrosage dépend de la plante, de la saison, " +
        "de la température et de l'humidité du sol. " +
        "Évitez généralement de laisser les racines " +
        "constamment dans l'eau."
      );
    }


    // ==========================================================
    // 🦠 MALADIE
    // ==========================================================

    if (
      q.includes('maladie') ||
      q.includes('malade') ||
      q.includes('feuille jaune') ||
      q.includes('feuilles jaunes')
    ) {

      return (
        "Une feuille jaune peut avoir plusieurs causes : " +
        "excès d'eau, manque de lumière, carence ou problème " +
        "racinaire. Une photo de la plante peut aider à affiner " +
        "le diagnostic."
      );
    }


    // ==========================================================
    // 🔎 IDENTIFICATION
    // ==========================================================

    if (
      q.includes('identifier') ||
      q.includes('identification') ||
      q.includes('quelle plante') ||
      q.includes('nom de la plante') ||
      q.includes('reconnaitre')
    ) {

      return (
        "Vous pouvez utiliser le scanner JardiScan pour essayer " +
        "d'identifier votre plante à partir d'une photo."
      );
    }


    // ==========================================================
    // 🙏 MERCI
    // ==========================================================

    if (
      q.includes('merci') ||
      q.includes('thanks')
    ) {

      return (
        "Avec plaisir 🌿 ! Je suis là si vous avez " +
        "une autre question."
      );
    }


    // ==========================================================
    // ❓ RÉPONSE PAR DÉFAUT
    // ==========================================================

    return (
      "Je comprends votre question 🌱. Pour le moment, " +
      "mes connaissances intégrées sont encore limitées. " +
      "Vous pouvez me demander des informations sur les " +
      "plantes présentes dans JardiScan, leur identification, " +
      "leur description, leur origine, leur arrosage, leur " +
      "entretien ou leurs caractéristiques."
    );
  }


  // ============================================================
  // 📋 RÉPONSE — LISTE DES PLANTES
  // ============================================================

  private buildPlantListResponse(): string {

    if (this.plantsLoading) {

      return (
        "Je récupère actuellement toutes les plantes " +
        "présentes dans la base de données 🌱..."
      );
    }

    if (this.plantsError) {

      return (
        "Je n'arrive pas à récupérer la liste des plantes " +
        "pour le moment."
      );
    }

    if (!this.plants.length) {

      return (
        "Aucune plante n'est actuellement disponible " +
        "dans la base de données."
      );
    }

    const names =
      this.plants
        .map(
          plant =>
            this.getPlantName(plant)
        )
        .filter(
          name =>
            name.length > 0
        );

    if (!names.length) {

      return (
        `J'ai trouvé ${this.plants.length} ` +
        `plante${this.plants.length > 1 ? 's' : ''}, ` +
        "mais leur nom n'est pas renseigné."
      );
    }

    const displayedNames =
      names.slice(0, 15);

    const remaining =
      names.length -
      displayedNames.length;

    let response =
      "Voici les plantes présentes dans JardiScan 🌿 : " +
      displayedNames.join(', ');

    if (remaining > 0) {

      response +=
        ` et ${remaining} autre${remaining > 1 ? 's' : ''}.`;

    } else {

      response += '.';
    }

    return response;
  }


  // ============================================================
  // 🎯 RÉPONSE CIBLÉE SUR UNE PLANTE
  // ============================================================

  private buildSpecificPlantResponse(
    plant: Plant,
    question: string
  ): string {

    const requestedFields =
      this.detectRequestedPlantFields(question);

    if (requestedFields.length > 0) {

      return this.buildRequestedFieldsResponse(
        plant,
        requestedFields
      );
    }

    return this.buildPlantResponse(plant);
  }


  // ============================================================
  // 🔎 DÉTECTER LES INFORMATIONS DEMANDÉES
  // ============================================================

  private detectRequestedPlantFields(
    question: string
  ): PlantField[] {

    const q =
      this.normalizeText(question);

    const fields: PlantField[] = [];

    const addField = (
      field: PlantField
    ): void => {

      if (!fields.includes(field)) {

        fields.push(field);
      }
    };


    if (
      /\bdescription\b/.test(q) ||
      /\bdecris\b/.test(q) ||
      /\bdecrire\b/.test(q) ||
      /\bpresente\b/.test(q)
    ) {

      addField('description');
    }


    if (
      q.includes('nom commun') ||
      q.includes('nom de la plante')
    ) {

      addField('nomCommun');
    }


    if (
      q.includes('nom scientifique') ||
      q.includes('nom latin')
    ) {

      addField('nomScientifique');
    }


    if (
      q.includes('origine') ||
      q.includes('vient de') ||
      q.includes('originaire')
    ) {

      addField('origine');
    }


    if (/\bfamille\b/.test(q)) {

      addField('famille');
    }


    if (/\bgenre\b/.test(q)) {

      addField('genre');
    }


    if (/\bespece\b/.test(q)) {

      addField('espece');
    }


    if (q.includes('sous categorie')) {

      addField('sousCategorie');
    }


    if (
      /\bcategorie\b/.test(q) ||
      q.includes('type de plante')
    ) {

      addField('categorie');
    }


    if (
      /\bexposition\b/.test(q) ||
      q.includes('lumiere') ||
      q.includes('besoin de soleil') ||
      q.includes('besoin en soleil')
    ) {

      addField('exposition');
    }


    if (
      /\barrosage\b/.test(q) ||
      /\barroser\b/.test(q) ||
      q.includes('besoin en eau') ||
      q.includes('besoins en eau')
    ) {

      addField('arrosage');
    }


    if (
      /\bsol\b/.test(q) ||
      q.includes('terre adaptee') ||
      q.includes('type de terre')
    ) {

      addField('sol');
    }


    if (/\bhumidite\b/.test(q)) {

      addField('humidite');
    }


    if (
      /\bengrais\b/.test(q) ||
      q.includes('fertilisant') ||
      q.includes('fertilisation')
    ) {

      addField('engrais');
    }


    if (
      /\btaille\b/.test(q) ||
      /\btailler\b/.test(q)
    ) {

      addField('taille');
    }


    if (/\bhauteur\b/.test(q)) {

      addField('hauteur');
    }


    if (
      /\bfloraison\b/.test(q) ||
      /\bfleurit\b/.test(q) ||
      /\bfleurir\b/.test(q)
    ) {

      addField('floraison');
    }


    if (
      q.includes('periode de floraison') ||
      q.includes('periode floraison')
    ) {

      addField('periodeFloraison');

      const floraisonIndex =
        fields.indexOf('floraison');

      if (floraisonIndex !== -1) {

        fields.splice(
          floraisonIndex,
          1
        );
      }
    }


    if (
      q.includes('periode de recolte') ||
      q.includes('periode recolte') ||
      q.includes('recolte')
    ) {

      addField('periodeRecolte');
    }


    if (/\bcycle\b/.test(q)) {

      addField('cycle');
    }


    if (
      /\bcouleur\b/.test(q) ||
      q.includes('coloris')
    ) {

      addField('couleur');
    }


    if (
      /\btoxique\b/.test(q) ||
      /\btoxicite\b/.test(q) ||
      q.includes('dangereuse') ||
      q.includes('danger pour')
    ) {

      addField('toxicite');
    }


    if (
      /\bcomestible\b/.test(q) ||
      q.includes('mangeable') ||
      q.includes('peut on la manger') ||
      q.includes('peut on le manger')
    ) {

      addField('comestible');
    }


    if (
      q.includes('parties dangereuses') ||
      q.includes('partie dangereuse') ||
      q.includes('parties toxiques') ||
      q.includes('partie toxique')
    ) {

      addField('partiesDangereuses');
    }


    if (/\bconseils?\b/.test(q)) {

      addField('conseils');
    }


    if (/\bmaladies?\b/.test(q)) {

      addField('maladies');
    }


    if (/\bparasites?\b/.test(q)) {

      addField('parasites');
    }


    return fields;
  }


  // ============================================================
  // 🎯 CONSTRUIRE RÉPONSE CHAMPS
  // ============================================================

  private buildRequestedFieldsResponse(
    plant: Plant,
    fields: PlantField[]
  ): string {

    const values: string[] = [];

    for (const field of fields) {

      const value =
        this.getRawPlantFieldValue(
          plant,
          field
        );

      if (value !== '') {

        values.push(value);

        continue;
      }

      values.push(
        this.getMissingFieldMessage(field)
      );
    }

    if (values.length === 1) {

      return values[0];
    }

    return values.join('\n\n');
  }


  // ============================================================
  // 🌱 RÉCUPÉRER VALEUR CHAMP
  // ============================================================

  private getRawPlantFieldValue(
    plant: Plant,
    field: PlantField
  ): string {

    switch (field) {

      case 'description':
        return this.cleanPlantValue(
          plant.description
        );

      case 'nomCommun':
        return this.cleanPlantValue(
          plant.nomCommun
        );

      case 'nomScientifique':
        return this.cleanPlantValue(
          plant.nomScientifique
        );

      case 'origine':
        return this.cleanPlantValue(
          plant.origine
        );

      case 'famille':
        return this.cleanPlantValue(
          plant.famille
        );

      case 'genre':
        return this.cleanPlantValue(
          plant.genre
        );

      case 'espece':
        return this.cleanPlantValue(
          plant.espece
        );

      case 'categorie':
        return this.cleanPlantValue(
          plant.categorie
        );

      case 'sousCategorie':
        return this.cleanPlantValue(
          plant.sousCategorie
        );

      case 'exposition':
        return this.cleanPlantValue(
          plant.exposition
        );

      case 'arrosage':
        return this.cleanPlantValue(
          plant.arrosage
        );

      case 'sol':
        return this.cleanPlantValue(
          plant.sol
        );

      case 'humidite':
        return this.cleanPlantValue(
          plant.humidite
        );

      case 'engrais':
        return this.cleanPlantValue(
          plant.engrais
        );

      case 'taille':
        return this.cleanPlantValue(
          plant.taille
        );

      case 'hauteur':
        return this.cleanPlantValue(
          plant.hauteur
        );

      case 'floraison':
        return this.cleanPlantValue(
          plant.floraison
        );

      case 'periodeFloraison':
        return this.cleanPlantValue(
          plant.periodeFloraison
        );

      case 'periodeRecolte':
        return this.cleanPlantValue(
          plant.periodeRecolte
        );

      case 'cycle':
        return this.cleanPlantValue(
          plant.cycle
        );

      case 'couleur':
        return this.cleanPlantValue(
          plant.couleur
        );

      case 'toxicite':

        if (
          plant.toxicite === true ||
          plant.toxique === true
        ) {

          return 'true';
        }

        if (
          plant.toxicite === false ||
          plant.toxique === false
        ) {

          return 'false';
        }

        return '';

      case 'comestible':

        if (
          plant.comestible === true
        ) {

          return 'true';
        }

        if (
          plant.comestible === false
        ) {

          return 'false';
        }

        return '';

      case 'partiesDangereuses':
        return this.cleanPlantValue(
          plant.partiesDangereuses
        );

      case 'conseils':
        return this.formatArrayValue(
          plant.conseils
        );

      default:
        return '';
    }
  }


  // ============================================================
  // 🧹 NETTOYER VALEUR
  // ============================================================

  private cleanPlantValue(
    value: unknown
  ): string {

    if (
      typeof value !== 'string'
    ) {

      return '';
    }

    return value.trim();
  }


  // ============================================================
  // 📋 FORMATER TABLEAU
  // ============================================================

  private formatArrayValue(
    value: unknown
  ): string {

    if (!Array.isArray(value)) {

      return '';
    }

    const values =
      value
        .map(item => {

          if (
            typeof item === 'string'
          ) {

            return item.trim();
          }

          if (
            item &&
            typeof item === 'object'
          ) {

            try {

              return JSON.stringify(item);

            } catch {

              return '';
            }
          }

          return '';
        })
        .filter(
          item =>
            item.length > 0
        );

    return values.join('\n');
  }


  // ============================================================
  // ⚠️ INFORMATION ABSENTE
  // ============================================================

  private getMissingFieldMessage(
    field: PlantField
  ): string {

    switch (field) {

      case 'description':
        return "La description n'est pas renseignée dans la base de données.";

      case 'nomCommun':
        return "Le nom commun n'est pas renseigné dans la base de données.";

      case 'nomScientifique':
        return "Le nom scientifique n'est pas renseigné dans la base de données.";

      case 'origine':
        return "L'origine n'est pas renseignée dans la base de données.";

      case 'famille':
        return "La famille n'est pas renseignée dans la base de données.";

      case 'genre':
        return "Le genre n'est pas renseigné dans la base de données.";

      case 'espece':
        return "L'espèce n'est pas renseignée dans la base de données.";

      case 'categorie':
        return "La catégorie n'est pas renseignée dans la base de données.";

      case 'sousCategorie':
        return "La sous-catégorie n'est pas renseignée dans la base de données.";

      case 'exposition':
        return "L'exposition n'est pas renseignée dans la base de données.";

      case 'arrosage':
        return "L'arrosage n'est pas renseigné dans la base de données.";

      case 'sol':
        return "Le sol n'est pas renseigné dans la base de données.";

      case 'humidite':
        return "L'humidité n'est pas renseignée dans la base de données.";

      case 'engrais':
        return "L'engrais n'est pas renseigné dans la base de données.";

      case 'taille':
        return "La taille n'est pas renseignée dans la base de données.";

      case 'hauteur':
        return "La hauteur n'est pas renseignée dans la base de données.";

      case 'floraison':
        return "La floraison n'est pas renseignée dans la base de données.";

      case 'periodeFloraison':
        return "La période de floraison n'est pas renseignée dans la base de données.";

      case 'periodeRecolte':
        return "La période de récolte n'est pas renseignée dans la base de données.";

      case 'cycle':
        return "Le cycle n'est pas renseigné dans la base de données.";

      case 'couleur':
        return "La couleur n'est pas renseignée dans la base de données.";

      case 'toxicite':
        return "La toxicité n'est pas renseignée dans la base de données.";

      case 'comestible':
        return "La comestibilité n'est pas renseignée dans la base de données.";

      case 'partiesDangereuses':
        return "Les parties dangereuses ne sont pas renseignées dans la base de données.";

      case 'conseils':
        return "Aucun conseil n'est renseigné dans la base de données.";

      case 'maladies':
        return "Aucune maladie n'est renseignée dans la base de données.";

      case 'parasites':
        return "Aucun parasite n'est renseigné dans la base de données.";

      default:
        return "Cette information n'est pas renseignée dans la base de données.";
    }
  }


  // ============================================================
  // 🔎 TROUVER UNE PLANTE
  // ============================================================

  private findPlant(
    question: string
  ): Plant | undefined {

    if (!this.plants.length) {

      return undefined;
    }

    const normalizedQuestion =
      this.normalizeText(question);


    // ----------------------------------------------------------
    // 🎯 RECHERCHE EXACTE
    // ----------------------------------------------------------

    const exactMatch =
      this.plants.find(
        plant => {

          const commonName =
            this.normalizeText(
              plant.nomCommun ?? ''
            );

          const scientificName =
            this.normalizeText(
              plant.nomScientifique ?? ''
            );

          return (
            (
              commonName &&
              normalizedQuestion.includes(
                commonName
              )
            ) ||
            (
              scientificName &&
              normalizedQuestion.includes(
                scientificName
              )
            )
          );
        }
      );

    if (exactMatch) {

      return exactMatch;
    }


    // ----------------------------------------------------------
    // 🔎 RECHERCHE PAR MOTS
    // ----------------------------------------------------------

    const ignoredWords =
      new Set([
        'donne',
        'donnez',
        'moi',
        'une',
        'un',
        'des',
        'du',
        'de',
        'la',
        'le',
        'les',
        'l',
        'quelle',
        'quel',
        'quelles',
        'quels',
        'est',
        'sont',
        'pour',
        'avec',
        'sur',
        'dans',
        'cette',
        'ce',
        'ces',
        'information',
        'informations',
        'description',
        'decris',
        'decrire',
        'origine',
        'famille',
        'genre',
        'espece',
        'categorie',
        'type',
        'sous',
        'exposition',
        'lumiere',
        'soleil',
        'arrosage',
        'arroser',
        'eau',
        'sol',
        'terre',
        'humidite',
        'engrais',
        'fertilisant',
        'taille',
        'tailler',
        'hauteur',
        'floraison',
        'fleurit',
        'fleurir',
        'periode',
        'recolte',
        'cycle',
        'couleur',
        'toxique',
        'toxicite',
        'comestible',
        'mangeable',
        'parties',
        'dangereuses',
        'conseil',
        'conseils',
        'maladie',
        'maladies',
        'parasite',
        'parasites',
        'estce',
        'que',
        'comment',
        'peut',
        'on',
        'elle',
        'il',
        'son',
        'sa',
        'ses'
      ]);


    const words =
      normalizedQuestion
        .split(/\s+/)
        .filter(
          word =>
            word.length >= 3 &&
            !ignoredWords.has(word)
        );


    if (!words.length) {

      return undefined;
    }


    let bestPlant:
      Plant | undefined;

    let bestScore = 0;


    for (const plant of this.plants) {

      const commonName =
        this.normalizeText(
          plant.nomCommun ?? ''
        );

      const scientificName =
        this.normalizeText(
          plant.nomScientifique ?? ''
        );

      const commonWords =
        commonName
          ? commonName.split(/\s+/)
          : [];

      const scientificWords =
        scientificName
          ? scientificName.split(/\s+/)
          : [];


      let score = 0;


      // --------------------------------------------------------
      // 🌱 NOM COMMUN
      // --------------------------------------------------------

      for (const word of words) {

        const exactCommonWord =
          commonWords.some(
            nameWord =>
              nameWord === word
          );

        if (exactCommonWord) {

          score += 5;

          continue;
        }


        const similarCommonWord =
          commonWords.some(
            nameWord =>
              this.isSimilarPlantWord(
                nameWord,
                word
              )
          );

        if (similarCommonWord) {

          score += 3;
        }
      }


      // --------------------------------------------------------
      // 🔬 NOM SCIENTIFIQUE
      // --------------------------------------------------------

      for (const word of words) {

        if (
          scientificWords.some(
            nameWord =>
              nameWord === word
          )
        ) {

          score += 4;
        }
      }


      // --------------------------------------------------------
      // 🏆 MEILLEUR SCORE
      // --------------------------------------------------------

      if (score > bestScore) {

        bestScore = score;

        bestPlant = plant;
      }
    }


    return bestScore > 0
      ? bestPlant
      : undefined;
  }


  // ============================================================
  // 🔎 COMPARAISON MOTS
  // ============================================================

  private isSimilarPlantWord(
    nameWord: string,
    questionWord: string
  ): boolean {

    if (
      nameWord.length < 5 ||
      questionWord.length < 5
    ) {

      return false;
    }


    if (
      nameWord === questionWord
    ) {

      return true;
    }


    if (
      nameWord.startsWith(questionWord) &&
      nameWord.length - questionWord.length <= 1
    ) {

      return true;
    }


    if (
      questionWord.startsWith(nameWord) &&
      questionWord.length - nameWord.length <= 1
    ) {

      return true;
    }


    return false;
  }


  // ============================================================
  // 🌱 NOM PLANTE
  // ============================================================

  private getPlantName(
    plant: Plant
  ): string {

    return (
      plant.nomCommun?.trim() ||
      plant.nomScientifique?.trim() ||
      'Plante sans nom'
    );
  }


  // ============================================================
  // 🔬 NOM SCIENTIFIQUE
  // ============================================================

  private getScientificName(
    plant: Plant
  ): string {

    return (
      plant.nomScientifique?.trim() ||
      ''
    );
  }


  // ============================================================
  // 🏷️ CATÉGORIE
  // ============================================================

  private getCategory(
    plant: Plant
  ): string {

    return (
      plant.categorie?.trim() ||
      ''
    );
  }


  // ============================================================
  // 🌳 FAMILLE
  // ============================================================

  private getFamily(
    plant: Plant
  ): string {

    return (
      plant.famille?.trim() ||
      ''
    );
  }


  // ============================================================
  // 🌍 ORIGINE
  // ============================================================

  private getOrigin(
    plant: Plant
  ): string {

    return (
      plant.origine?.trim() ||
      ''
    );
  }


  // ============================================================
  // 🌱 ENTRETIEN
  // ============================================================

  private getCareInformation(
    plant: Plant
  ): string {

    const information: string[] = [];


    if (plant.exposition?.trim()) {

      information.push(
        `Exposition : ${plant.exposition.trim()}`
      );
    }


    if (plant.arrosage?.trim()) {

      information.push(
        `Arrosage : ${plant.arrosage.trim()}`
      );
    }


    if (plant.sol?.trim()) {

      information.push(
        `Sol : ${plant.sol.trim()}`
      );
    }


    if (plant.humidite?.trim()) {

      information.push(
        `Humidité : ${plant.humidite.trim()}`
      );
    }


    if (plant.engrais?.trim()) {

      information.push(
        `Engrais : ${plant.engrais.trim()}`
      );
    }


    if (plant.taille?.trim()) {

      information.push(
        `Taille : ${plant.taille.trim()}`
      );
    }


    return information.join(' • ');
  }


  // ============================================================
  // 🌱 CONSTRUIRE RÉPONSE PLANTE
  // ============================================================

  private buildPlantResponse(
    plant: Plant
  ): string {

    const name =
      this.getPlantName(plant);

    const scientificName =
      this.getScientificName(plant);

    const category =
      this.getCategory(plant);

    const family =
      this.getFamily(plant);

    const origin =
      this.getOrigin(plant);

    const description =
      plant.description?.trim() || '';

    const care =
      this.getCareInformation(plant);


    let response =
      `🌱 ${name}`;


    if (
      scientificName &&
      this.normalizeText(scientificName) !==
      this.normalizeText(name)
    ) {

      response +=
        ` (${scientificName})`;
    }


    response +=
      " est présente dans la base de données JardiScan.";


    if (description) {

      response +=
        ` ${description}`;
    }


    if (category) {

      response +=
        ` Catégorie : ${category}.`;
    }


    if (family) {

      response +=
        ` Famille : ${family}.`;
    }


    if (origin) {

      response +=
        ` Origine : ${origin}.`;
    }


    if (care) {

      response +=
        ` ${care}.`;
    }


    if (plant.hauteur?.trim()) {

      response +=
        ` Hauteur : ${plant.hauteur.trim()}.`;
    }


    if (plant.floraison?.trim()) {

      response +=
        ` Floraison : ${plant.floraison.trim()}.`;
    }


    if (plant.periodeFloraison?.trim()) {

      response +=
        ` Période de floraison : ` +
        `${plant.periodeFloraison.trim()}.`;
    }


    if (plant.periodeRecolte?.trim()) {

      response +=
        ` Période de récolte : ` +
        `${plant.periodeRecolte.trim()}.`;
    }


    if (
      plant.toxicite === true ||
      plant.toxique === true
    ) {

      response +=
        ' ⚠️ Cette plante est indiquée comme toxique.';
    }


    if (
      plant.comestible === true
    ) {

      response +=
        ' Elle est indiquée comme comestible.';
    }


    if (
      Array.isArray(plant.fleurs) &&
      plant.fleurs.length
    ) {

      response +=
        ` Fleurs : ${plant.fleurs.join(', ')}.`;
    }


    if (
      Array.isArray(plant.fruits) &&
      plant.fruits.length
    ) {

      response +=
        ` Fruits : ${plant.fruits.join(', ')}.`;
    }


    return response;
  }


  // ============================================================
  // 🔤 NORMALISATION
  // ============================================================

  private normalizeText(
    value: string
  ): string {

    return (
      value
        .toLowerCase()
        .normalize('NFD')
        .replace(
          /[\u0300-\u036f]/g,
          ''
        )
        .replace(
          /[^\p{L}\p{N}\s-]/gu,
          ' '
        )
        .replace(
          /\s+/g,
          ' '
        )
        .trim()
    );
  }


  // ============================================================
  // 🔎 CONTIENT AU MOINS UN TERME
  // ============================================================

  private containsAny(
    value: string,
    terms: string[]
  ): boolean {

    return terms.some(
      term =>
        value.includes(term)
    );
  }


  // ============================================================
  // 🕐 HEURE ACTUELLE
  // ============================================================

  private getCurrentTime(): string {

    return new Date().toLocaleTimeString(
      'fr-FR',
      {
        hour: '2-digit',
        minute: '2-digit'
      }
    );
  }


  // ============================================================
  // 🎯 FOCUS INPUT
  // ============================================================

  private focusInput(): void {

    setTimeout(() => {

      this.messageInput
        ?.nativeElement
        .focus();

    }, 50);
  }


  // ============================================================
  // 📜 SCROLL AUTOMATIQUE
  // ============================================================

  ngAfterViewChecked(): void {

    if (!this.messagesContainer) {
      return;
    }

    const element =
      this.messagesContainer.nativeElement;

    element.scrollTop =
      element.scrollHeight;
  }


  // ============================================================
  // 🧹 DESTRUCTION
  // ============================================================

  ngOnDestroy(): void {

    if (this.messageTimer) {

      clearTimeout(
        this.messageTimer
      );

      this.messageTimer = undefined;
    }


    if (this.responseTimer) {

      clearTimeout(
        this.responseTimer
      );

      this.responseTimer = undefined;
    }


    this.stopTyping();

    this.stopResponseTyping();
  }
}