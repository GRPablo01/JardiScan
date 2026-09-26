import {
  Component,
  OnInit,
  OnDestroy
} from '@angular/core';



import { CommonModule } from '@angular/common';

import {
  FormsModule
} from '@angular/forms';

import {
  RouterLink
} from '@angular/router';

import {
  Subscription
} from 'rxjs';

import {
  ThemeService
} from '../../../../../Backend/Services/theme.service';

import {
  Rappel,
  RappelService
} from '../../../../../Backend/Services/rappel.service';


@Component({
  selector: 'app-profil-accueil',

  imports: [
    CommonModule,
    FormsModule,
    RouterLink
  ],

  templateUrl: './profil-accueil.html',

  styleUrl: './profil-accueil.css',
})


export class ProfilAccueil
  implements OnInit, OnDestroy {


  // ============================================================
  // 👤 UTILISATEUR CONNECTÉ
  // ============================================================

  utilisateur: any = null;


  // ============================================================
  // 🌱 PLANTES DU JARDIDEX
  // ============================================================

  plantes: any[] = [];


  // ============================================================
  // 🌱 NOMBRE DE PLANTES
  // ============================================================

  nombrePlantes: number = 0;


  // ============================================================
  // 🔔 RAPPELS
  // ============================================================

  rappels: Rappel[] = [];

  rappelsDuJour: Rappel[] = [];

  rappelsLoading: boolean = false;

  rappelError: boolean = false;

  private rappelSubscription?: Subscription;


  // ============================================================
  // ⏳ TIMER — DISPARITION APRÈS 10 MINUTES
  // ============================================================

  private rappelsTimeouts =
    new Map<string, ReturnType<typeof setTimeout>>();


  // ============================================================
  // ↩️ TIMER — AFFICHAGE DU BOUTON RETOUR APRÈS 3 SECONDES
  // ============================================================

  private rappelsReouvertureTimeouts =
    new Map<string, ReturnType<typeof setTimeout>>();


  // ============================================================
  // ➕ POPUP — CRÉATION D'UN RAPPEL
  // ============================================================

  popupRappelOuvert: boolean = false;

  creationRappelLoading: boolean = false;

  creationRappelErreur: string = '';


  // ============================================================
  // 📝 NOUVEAU RAPPEL
  // ============================================================

  nouveauRappel: {
    titre: string;

    description: string;

    type:
    | 'arrosage'
    | 'exposition'
    | 'engrais'
    | 'rempotage'
    | 'taille'
    | 'traitement'
    | 'observation'
    | 'autre';

    date: string;

    frequence:
    | 'unique'
    | 'quotidien'
    | 'hebdomadaire'
    | 'mensuel';

  } = {

      titre: '',

      description: '',

      type: 'arrosage',

      date: '',

      frequence: 'unique'

    };


  // ============================================================
  // 💡 CONSEILS DU JOUR
  // ============================================================

  conseils = [

    {
      titre: 'Prenez soin de vos plantes',

      description:
        'Observez régulièrement vos plantes et vérifiez leurs besoins en lumière, eau et entretien.'
    },

    {
      titre: 'Arrosez au bon moment',

      description:
        'Vérifiez l’humidité du terreau avant d’arroser afin d’éviter les excès d’eau.'
    },

    {
      titre: 'Observez les feuilles',

      description:
        'Des feuilles jaunes, sèches ou tombantes peuvent signaler un besoin particulier.'
    },

    {
      titre: 'Adaptez la lumière',

      description:
        'Placez chaque plante dans un endroit adapté à ses besoins en lumière naturelle.'
    },

    {
      titre: 'Évitez les excès d’eau',

      description:
        'Un arrosage trop fréquent peut fragiliser les racines et favoriser la pourriture des racines.'
    },

    {
      titre: 'Nettoyez les feuilles',

      description:
        'Dépoussiérez doucement les feuilles pour favoriser une meilleure absorption de la lumière.'
    },

    {
      titre: 'Surveillez les parasites',

      description:
        'Inspectez régulièrement vos plantes pour détecter rapidement les petits parasites.'
    },

    {
      titre: 'Faites tourner vos plantes',

      description:
        'Tournez légèrement vos plantes afin que toutes leurs parties profitent correctement de la lumière.'
    },

    {
      titre: 'Choisissez le bon pot',

      description:
        'Utilisez un pot adapté à la taille des racines et disposant d’un bon drainage.'
    },

    {
      titre: 'Aérez votre intérieur',

      description:
        'Une bonne circulation de l’air contribue à maintenir un environnement sain pour vos plantes.'
    },

    {
      titre: 'Rempotez si nécessaire',

      description:
        'Lorsque les racines manquent d’espace, pensez à installer votre plante dans un pot plus grand.'
    },

    {
      titre: 'Respectez les saisons',

      description:
        'Les besoins en eau et en lumière peuvent changer selon la saison et la température.'
    },

    {
      titre: 'Évitez les changements brusques',

      description:
        'Déplacez progressivement une plante lorsque vous souhaitez modifier son environnement.'
    },

    {
      titre: 'Utilisez un terreau adapté',

      description:
        'Choisissez un substrat correspondant aux besoins spécifiques de chaque type de plante.'
    },

    {
      titre: 'Taillez avec précaution',

      description:
        'Retirez les feuilles et branches abîmées avec un outil propre pour favoriser la croissance.'
    },

    {
      titre: 'Fertilisez avec modération',

      description:
        'Respectez les doses recommandées et évitez de surcharger votre plante en engrais.'
    },

    {
      titre: 'Regardez sous les feuilles',

      description:
        'Certains parasites se cachent sous les feuilles, pensez donc à les inspecter régulièrement.'
    },

    {
      titre: 'Observez la croissance',

      description:
        'Suivre l’évolution de vos plantes permet de détecter rapidement les changements.'
    },

    {
      titre: 'Gardez vos outils propres',

      description:
        'Nettoyez vos outils de jardinage pour limiter la propagation de maladies entre les plantes.'
    },

    {
      titre: 'Apprenez à connaître vos plantes',

      description:
        'Chaque plante possède ses propres besoins : prenez le temps de découvrir ce qui lui convient.'
    }

  ];


  // ============================================================
  // 💡 CONSEIL ACTUELLEMENT AFFICHÉ
  // ============================================================

  conseilDuJour = this.conseils[0];


  // ============================================================
  // 🚀 CONSTRUCTEUR
  // ============================================================

  constructor(

    public themeService: ThemeService,

    private rappelService: RappelService

  ) { }


  // ============================================================
  // 🔎 TRACK BY RAPPEL
  // ============================================================

  trackByRappel(
    index: number,
    rappel: Rappel
  ): string {

    return rappel._id;

  }


  // ============================================================
  // 🚀 INITIALISATION
  // ============================================================

  ngOnInit(): void {

    this.recupererUtilisateur();

    this.genererConseilDuJour();

    this.chargerRappels();

  }


  // ============================================================
  // 👤 RÉCUPÉRER L'UTILISATEUR
  // ============================================================

  recupererUtilisateur(): void {

    const utilisateurStocke =
      localStorage.getItem('utilisateur');


    if (!utilisateurStocke) {

      console.warn(
        'Aucun utilisateur connecté.'
      );

      this.utilisateur = null;

      this.plantes = [];

      this.nombrePlantes = 0;

      return;

    }


    try {

      this.utilisateur =
        JSON.parse(utilisateurStocke);


      

      

      if (
        Array.isArray(
          this.utilisateur?.jardiDex
        )
      ) {

        this.plantes =
          this.utilisateur.jardiDex;

        this.nombrePlantes =
          this.plantes.length;

      } else {

        this.plantes = [];

        this.nombrePlantes = 0;

      }


      


    } catch (error) {

      console.error(
        'Impossible de récupérer l’utilisateur depuis le localStorage :',
        error
      );

      this.utilisateur = null;

      this.plantes = [];

      this.nombrePlantes = 0;

    }

  }


  // ============================================================
  // 👤 PRÉNOM DE L'UTILISATEUR
  // ============================================================

  get prenomUtilisateur(): string {

    return (
      this.utilisateur?.prenom ||
      ''
    );

  }


  // ============================================================
  // 👤 NOM DE L'UTILISATEUR
  // ============================================================

  get nomUtilisateur(): string {

    return (
      this.utilisateur?.nom ||
      ''
    );

  }


  // ============================================================
  // 👤 NOM COMPLET DE L'UTILISATEUR
  // ============================================================

  get nomCompletUtilisateur(): string {

    const prenom =
      this.prenomUtilisateur.trim();

    const nom =
      this.nomUtilisateur.trim();

    return `${prenom} ${nom}`.trim();

  }


  // ============================================================
  // 🔔 TERMINER UN RAPPEL
  // ============================================================

  terminerRappel(
    rappel: Rappel
  ): void {

    if (!rappel?._id) {

      console.error(
        '❌ Impossible de terminer le rappel : ID manquant.'
      );

      return;

    }


    // ==========================================================
    // 🛑 DÉJÀ TERMINÉ
    // ==========================================================

    if (rappel.termine) {

      return;

    }


    // ==========================================================
    // 🧹 NETTOYER LES ANCIENS TIMERS
    // ==========================================================

    this.clearRappelTimeout(
      rappel._id
    );

    this.clearReouvertureTimeout(
      rappel._id
    );


    // ==========================================================
    // ⚡ CHANGEMENT IMMÉDIAT DE L'INTERFACE
    // ==========================================================

    rappel.termine = true;

    rappel.reouvertureVisible = false;


    // ==========================================================
    // 📤 ENVOYER AU BACKEND
    // ==========================================================

    this.rappelService
      .terminerRappel(rappel._id)
      .subscribe({

        // ======================================================
        // ✅ SUCCÈS
        // ======================================================

        next: (response) => {

          


          // ====================================================
          // ⏳ APRÈS 3 SECONDES
          // AFFICHER LE BOUTON RETOUR
          // ====================================================

          const timeoutRetour =
            setTimeout(() => {

              if (rappel.termine) {

                rappel.reouvertureVisible =
                  true;

                

              }

              this.rappelsReouvertureTimeouts.delete(
                rappel._id
              );

            }, 3000);


          this.rappelsReouvertureTimeouts.set(
            rappel._id,
            timeoutRetour
          );


          // ====================================================
          // ⏱️ APRÈS 10 MINUTES
          // SUPPRIMER LE RAPPEL
          // ====================================================

          this.programmerDisparitionRappel(
            rappel
          );

        },


        // ======================================================
        // ❌ ERREUR
        // ======================================================

        error: (error) => {

          console.error(
            '❌ Erreur lors de la terminaison du rappel :',
            error
          );


          rappel.termine = false;

          rappel.reouvertureVisible = false;

          this.clearRappelTimeout(
            rappel._id
          );

          this.clearReouvertureTimeout(
            rappel._id
          );

        }

      });

  }


  // ============================================================
  // ↩️ ROUVRIR UN RAPPEL
  // ============================================================

  retourRappel(
    rappel: Rappel
  ): void {

    if (!rappel?._id) {

      console.error(
        '❌ Impossible de rouvrir le rappel : ID manquant.'
      );

      return;

    }


    if (!rappel.termine) {

      return;

    }


    // ==========================================================
    // 🧹 ANNULER LES DEUX TIMERS
    // ==========================================================

    this.clearRappelTimeout(
      rappel._id
    );

    this.clearReouvertureTimeout(
      rappel._id
    );


    // ==========================================================
    // 💾 CONSERVER L'ÉTAT AVANT MODIFICATION
    // ==========================================================

    const ancienEtat =
      rappel.termine;

    const ancienneVisibilite =
      rappel.reouvertureVisible;


    // ==========================================================
    // ⚡ ROUVRIR IMMÉDIATEMENT DANS L'UI
    // ==========================================================

    rappel.termine = false;

    rappel.reouvertureVisible = false;


    // ==========================================================
    // 📤 ROUVRIR CÔTÉ BACKEND
    // ==========================================================

    this.rappelService
      .annulerTerminaisonRappel(
        rappel._id
      )
      .subscribe({

        // ======================================================
        // ✅ SUCCÈS
        // ======================================================

        next: (response) => {

          

        },


        // ======================================================
        // ❌ ERREUR
        // ======================================================

        error: (error) => {

          console.error(
            '❌ Erreur lors de la réouverture du rappel :',
            error
          );


          // ====================================================
          // 🔙 RESTAURER L'ÉTAT
          // ====================================================

          rappel.termine =
            ancienEtat;

          rappel.reouvertureVisible =
            ancienneVisibilite;


          // ====================================================
          // ⏱️ REPROGRAMMER LA DISPARITION
          // ====================================================

          if (rappel.termine) {

            this.programmerDisparitionRappel(
              rappel
            );

          }

        }

      });

  }


  // ============================================================
  // ⏳ TIMER — BOUTON RETOUR
  // ============================================================

  private programmerAffichageRetour(
    rappel: Rappel
  ): void {

    if (!rappel?._id) {

      return;

    }


    // ==========================================================
    // 🧹 NETTOYER L'ANCIEN TIMER
    // ==========================================================

    this.clearReouvertureTimeout(
      rappel._id
    );


    // ==========================================================
    // 🔒 CACHER LE BOUTON
    // ==========================================================

    rappel.reouvertureVisible = false;


    // ==========================================================
    // ⏳ ATTENDRE 3 SECONDES
    // ==========================================================

    const timeoutRetour =
      setTimeout(() => {

        if (rappel.termine) {

          rappel.reouvertureVisible =
            true;

        }

        this.rappelsReouvertureTimeouts.delete(
          rappel._id
        );

      }, 3000);


    this.rappelsReouvertureTimeouts.set(
      rappel._id,
      timeoutRetour
    );

  }


  // ============================================================
  // ⏳ PROGRAMMER LA DISPARITION APRÈS 10 MINUTES
  // ============================================================

  private programmerDisparitionRappel(
    rappel: Rappel
  ): void {

    if (!rappel?._id) {

      return;

    }


    this.clearRappelTimeout(
      rappel._id
    );


    const timeout =
      setTimeout(() => {

        if (rappel.termine) {

          this.supprimerRappelDeLaListe(
            rappel._id
          );

        }

        this.rappelsTimeouts.delete(
          rappel._id
        );

      }, 10 * 60 * 1000);


    this.rappelsTimeouts.set(
      rappel._id,
      timeout
    );

  }


  // ============================================================
  // 🧹 NETTOYER TIMER DISPARITION
  // ============================================================

  private clearRappelTimeout(
    id: string
  ): void {

    const timeout =
      this.rappelsTimeouts.get(id);

    if (timeout) {

      clearTimeout(timeout);

      this.rappelsTimeouts.delete(id);

    }

  }


  // ============================================================
  // 🧹 NETTOYER TIMER BOUTON RETOUR
  // ============================================================

  private clearReouvertureTimeout(
    id: string
  ): void {

    const timeout =
      this.rappelsReouvertureTimeouts.get(id);

    if (timeout) {

      clearTimeout(timeout);

      this.rappelsReouvertureTimeouts.delete(id);

    }

  }


  // ============================================================
  // 🗑️ SUPPRIMER UN RAPPEL DE LA LISTE
  // ============================================================

  private supprimerRappelDeLaListe(
    rappelId: string
  ): void {

    this.clearRappelTimeout(
      rappelId
    );

    this.clearReouvertureTimeout(
      rappelId
    );


    this.rappelsDuJour =
      this.rappelsDuJour.filter(
        (rappel: Rappel) =>
          rappel._id !== rappelId
      );


    this.rappels =
      this.rappels.filter(
        (rappel: Rappel) =>
          rappel._id !== rappelId
      );


    console.log(
      '🗑️ Rappel retiré de l’affichage après 10 minutes :',
      rappelId
    );

  }



  // ============================================================
  // 🔔 CHARGER TOUS LES RAPPELS
  // ============================================================

  chargerRappels(): void {

    // ==========================================================
    // ⏳ ÉTAT DE CHARGEMENT
    // ==========================================================

    this.rappelsLoading = true;
    this.rappelError = false;

    // ==========================================================
    // 🧹 ANNULER UNE ANCIENNE REQUÊTE
    // ==========================================================

    this.rappelSubscription?.unsubscribe();

    // ==========================================================
    // 📋 RÉCUPÉRER TOUS LES RAPPELS
    // ==========================================================
    //
    // IMPORTANT :
    // getRappels() récupère TOUS les rappels via :
    //
    // GET http://localhost:3000/api/rappels
    //
    // Contrairement à :
    //
    // getRappelsDuJour()
    //
    // qui utilise :
    //
    // GET http://localhost:3000/api/rappels/today
    //
    // ==========================================================

    this.rappelSubscription =
      this.rappelService
        .getRappels()
        .subscribe({

          // ======================================================
          // ✅ SUCCÈS
          // ======================================================

          next: (rappels: Rappel[]) => {

            // ====================================================
            // 📋 STOCKER TOUS LES RAPPELS
            // ====================================================

            this.rappels = rappels || [];

            // ====================================================
            // 📦 CONSERVATION DE LA PROPRIÉTÉ EXISTANTE
            // ====================================================
            //
            // Même si son ancien nom était "rappelsDuJour",
            // elle contient maintenant TOUS les rappels.
            //
            // Cela évite de casser ton HTML actuel.
            //
            // ====================================================

            this.rappelsDuJour = [
              ...this.rappels
            ];

            // ====================================================
            // 🔄 INITIALISER CHAQUE RAPPEL
            // ====================================================

            this.rappels.forEach(
              (rappel: Rappel) => {

                // ==================================================
                // 🔔 RAPPEL TERMINÉ
                // ==================================================

                if (rappel.termine) {

                  // ------------------------------------------------
                  // ↩️ LE BOUTON RETOUR EST DISPONIBLE
                  // ------------------------------------------------

                  rappel.reouvertureVisible = true;

                  // ------------------------------------------------
                  // ⏳ PROGRAMMER LA DISPARITION APRÈS 10 MINUTES
                  // ------------------------------------------------

                  this.programmerDisparitionRappel(
                    rappel
                  );

                } else {

                  // ------------------------------------------------
                  // 🔒 RAPPEL NON TERMINÉ
                  // ------------------------------------------------

                  rappel.reouvertureVisible = false;

                }

              }
            );

            // ====================================================
            // ✅ FIN DU CHARGEMENT
            // ====================================================

            this.rappelsLoading = false;
            this.rappelError = false;

            // ====================================================
            // 📝 DEBUG
            // ====================================================

            console.log(
              '🔔 Tous les rappels récupérés :',
              this.rappels
            );

            console.log(
              '🔢 Nombre total de rappels :',
              this.rappels.length
            );

            // ====================================================
            // 👤 INFORMATIONS UTILISATEUR
            // ====================================================

            this.rappels.forEach(
              (rappel: Rappel) => {

                console.log(
                  '👤 Utilisateur du rappel :',
                  {
                    prenom: rappel.prenom || '',
                    nom: rappel.nom || ''
                  }
                );

              }
            );

          },

          // ======================================================
          // ❌ ERREUR
          // ======================================================

          error: (error) => {

            console.error(
              '❌ Erreur récupération de tous les rappels :',
              error
            );

            // ====================================================
            // 🧹 VIDER LES LISTES
            // ====================================================

            this.rappels = [];
            this.rappelsDuJour = [];

            // ====================================================
            // ❌ ÉTAT ERREUR
            // ====================================================

            this.rappelsLoading = false;
            this.rappelError = true;

          }

        });
  }




  // ============================================================
  // 🔄 RECHARGER LES RAPPELS
  // ============================================================

  rechargerRappels(): void {

    this.chargerRappels();

  }


  // ============================================================
  // ➕ OUVRIR LE POPUP DE CRÉATION
  // ============================================================

  ouvrirPopupRappel(): void {

    this.creationRappelErreur = '';

    this.creationRappelLoading =
      false;


    this.nouveauRappel = {

      titre: '',

      description: '',

      type: 'arrosage',

      date:
        this.getDateAujourdhui(),

      frequence: 'unique'

    };


    this.popupRappelOuvert =
      true;

  }


  // ============================================================
  // ❌ FERMER LE POPUP
  // ============================================================

  fermerPopupRappel(): void {

    if (
      this.creationRappelLoading
    ) {

      return;

    }


    this.popupRappelOuvert =
      false;

    this.creationRappelErreur =
      '';

  }


  // ============================================================
  // 📅 OBTENIR LA DATE DU JOUR
  // ============================================================

  private getDateAujourdhui(): string {

    const maintenant =
      new Date();


    const annee =
      maintenant.getFullYear();


    const mois =
      String(
        maintenant.getMonth() + 1
      ).padStart(
        2,
        '0'
      );


    const jour =
      String(
        maintenant.getDate()
      ).padStart(
        2,
        '0'
      );


    return `${annee}-${mois}-${jour}`;

  }


  // ============================================================
  // 🌱 CRÉER UN RAPPEL
  // ============================================================

  creerRappel(): void {

    if (
      !this.nouveauRappel.titre ||
      !this.nouveauRappel.titre.trim()
    ) {

      this.creationRappelErreur =
        'Veuillez saisir un titre.';

      return;

    }


    if (
      !this.nouveauRappel.date
    ) {

      this.creationRappelErreur =
        'Veuillez choisir une date.';

      return;

    }


    this.creationRappelLoading =
      true;

    this.creationRappelErreur =
      '';


    this.rappelService
      .createRappel({

        titre:
          this.nouveauRappel.titre.trim(),

        description:
          this.nouveauRappel.description
            ? this.nouveauRappel.description.trim()
            : '',

        type:
          this.nouveauRappel.type,

        date:
          this.nouveauRappel.date,

        frequence:
          this.nouveauRappel.frequence

      })

      .subscribe({

        next: (response) => {

         


          if (response?.rappel) {

            

          }


          this.creationRappelLoading =
            false;


          this.popupRappelOuvert =
            false;


          this.nouveauRappel = {

            titre: '',

            description: '',

            type: 'arrosage',

            date: '',

            frequence: 'unique'

          };


          this.chargerRappels();

        },


        error: (error) => {

          console.error(
            'Erreur lors de la création du rappel :',
            error
          );


          this.creationRappelLoading =
            false;


          this.creationRappelErreur =
            error?.error?.message ||
            'Impossible de créer le rappel.';

        }

      });

  }


  // ============================================================
  // 🔔 OBTENIR L'ICÔNE D'UN RAPPEL
  // ============================================================

  getRappelIcon(
    type: Rappel['type']
  ): string {

    switch (type) {

      case 'arrosage':
        return 'fa-droplet';

      case 'exposition':
        return 'fa-sun';

      case 'engrais':
        return 'fa-seedling';

      case 'rempotage':
        return 'fa-box-open';

      case 'taille':
        return 'fa-scissors';

      case 'traitement':
        return 'fa-spray-can-sparkles';

      case 'observation':
        return 'fa-eye';

      case 'autre':

      default:
        return 'fa-bell';

    }

  }


  // ============================================================
  // 🎨 COULEUR D'UN RAPPEL
  // ============================================================

  getRappelColor(
    type: Rappel['type']
  ): string {

    switch (type) {

      case 'arrosage':
        return this.themeService.Leaf;

      case 'exposition':
        return '#f59e0b';

      case 'engrais':
        return '#84cc16';

      case 'rempotage':
        return '#a16207';

      case 'taille':
        return '#10b981';

      case 'traitement':
        return '#ef4444';

      case 'observation':
        return '#6366f1';

      case 'autre':

      default:
        return this.themeService.Primary;

    }

  }


  // ============================================================
  // 🕐 FORMATER L'HEURE DU RAPPEL
  // ============================================================

  getHeureRappel(
    date: string
  ): string {

    if (!date) {

      return '';

    }


    const dateRappel =
      new Date(date);


    if (
      isNaN(
        dateRappel.getTime()
      )
    ) {

      return '';

    }


    return new Intl.DateTimeFormat(
      'fr-FR',
      {
        hour: '2-digit',
        minute: '2-digit'
      }
    ).format(
      dateRappel
    );

  }


  // ============================================================
  // 🪴 OBTENIR LE NOM DE LA PLANTE
  // ============================================================

  getNomPlante(
    rappel: Rappel
  ): string {

    if (
      !rappel ||
      !rappel.plante
    ) {

      return '';

    }


    return (
      rappel.plante.nom ||
      rappel.plante.espece ||
      ''
    );

  }


  // ============================================================
  // 👤 OBTENIR LE PRÉNOM DU RAPPEL
  // ============================================================

  getPrenomRappel(
    rappel: Rappel
  ): string {

    return (
      rappel?.prenom ||
      this.prenomUtilisateur ||
      ''
    );

  }


  // ============================================================
  // 👤 OBTENIR LE NOM DU RAPPEL
  // ============================================================

  getNomRappel(
    rappel: Rappel
  ): string {

    return (
      rappel?.nom ||
      this.nomUtilisateur ||
      ''
    );

  }


  // ============================================================
  // 👤 OBTENIR LE NOM COMPLET DU RAPPEL
  // ============================================================

  getNomCompletRappel(
    rappel: Rappel
  ): string {

    const prenom =
      this.getPrenomRappel(rappel)
        .trim();


    const nom =
      this.getNomRappel(rappel)
        .trim();


    return `${prenom} ${nom}`.trim();

  }


  // ============================================================
  // 🔢 NOMBRE DE RAPPELS
  // ============================================================

  get nombreRappels(): number {

    return this.rappelsDuJour.length;

  }


  // ============================================================
  // ⏰ VÉRIFIER SI UN RAPPEL EST URGENT
  // ============================================================

  rappelEstProche(
    rappel: Rappel
  ): boolean {

    if (!rappel?.date) {

      return false;

    }


    const maintenant =
      new Date().getTime();


    const dateRappel =
      new Date(
        rappel.date
      ).getTime();


    const difference =
      dateRappel - maintenant;


    return (
      difference >= 0 &&
      difference <=
      2 * 60 * 60 * 1000
    );

  }


  // ============================================================
  // 💡 GÉNÉRER UN CONSEIL ALÉATOIRE
  // ============================================================

  genererConseilDuJour(): void {

    if (
      !this.conseils ||
      this.conseils.length === 0
    ) {

      return;

    }


    const index =
      Math.floor(
        Math.random() *
        this.conseils.length
      );


    this.conseilDuJour =
      this.conseils[index];

  }


  // ============================================================
  // 🔀 CHANGER DE CONSEIL
  // ============================================================

  changerConseil(): void {

    if (
      !this.conseils ||
      this.conseils.length <= 1
    ) {

      return;

    }


    const ancienConseil =
      this.conseilDuJour;


    let index =
      Math.floor(
        Math.random() *
        this.conseils.length
      );


    while (
      this.conseils[index] ===
      ancienConseil
    ) {

      index =
        Math.floor(
          Math.random() *
          this.conseils.length
        );

    }


    this.conseilDuJour =
      this.conseils[index];

  }


  // ============================================================
  // 🌱 VÉRIFIER SI LE JARDIDEX EST VIDE
  // ============================================================

  get jardiDexVide(): boolean {

    return this.plantes.length === 0;

  }


  // ============================================================
  // 🧹 NETTOYAGE
  // ============================================================

  ngOnDestroy(): void {

    // ==========================================================
    // 🧹 ANNULER LA REQUÊTE
    // ==========================================================

    this.rappelSubscription
      ?.unsubscribe();


    // ==========================================================
    // 🧹 TIMER — DISPARITION
    // ==========================================================

    this.rappelsTimeouts.forEach(
      (timeout) => {

        clearTimeout(timeout);

      }
    );


    this.rappelsTimeouts.clear();


    // ==========================================================
    // 🧹 TIMER — BOUTON RETOUR
    // ==========================================================

    this.rappelsReouvertureTimeouts.forEach(
      (timeout) => {

        clearTimeout(timeout);

      }
    );


    this.rappelsReouvertureTimeouts.clear();

  }

  // ============================================================
  // ⏳ COMPTE À REBOURS — 10 MINUTES
  // ============================================================

  compteReboursSecondes = 10 * 60;

  private compteReboursInterval: ReturnType<typeof setInterval> | null = null;




  // ============================================================
  // ⏳ COMPTE À REBOURS DU RAPPEL TERMINÉ
  // ============================================================

  rappelReouvertureId: string | null = null;



  // ============================================================
  // 🔑 RÉCUPÉRER L'ID DU RAPPEL
  // Compatible avec _id ou id
  // ============================================================

  getRappelId(rappel: any): string {

    return String(
      rappel?._id ??
      rappel?.id ??
      ''
    );
  }


  // ============================================================
  // ✅ TERMINER UN RAPPEL + DÉMARRER LE COMPTEUR
  // ============================================================

  terminerRappelAvecCompteRebours(rappel: any): void {

    /*
     * Si le rappel est déjà terminé,
     * on ne redémarre pas le compteur.
     */
    if (rappel.termine) {
      return;
    }

    // ID du rappel sélectionné
    this.rappelReouvertureId = this.getRappelId(rappel);

    // 10 minutes
    this.compteReboursSecondes = 10 * 60;

    // Lance le compteur
    this.demarrerCompteRebours();

    /*
     * On conserve ta logique existante.
     * Ton ancien bouton appelait :
     *
     * terminerRappel(rappel)
     */
    this.terminerRappel(rappel);
  }


  // ============================================================
  // ⏳ DÉMARRER LE COMPTEUR
  // ============================================================

  private demarrerCompteRebours(): void {

    // Évite plusieurs setInterval simultanés
    this.arreterCompteRebours();

    this.compteReboursInterval = setInterval(() => {

      if (this.compteReboursSecondes > 0) {

        this.compteReboursSecondes--;

      } else {

        this.arreterCompteRebours();

      }

    }, 1000);
  }


  // ============================================================
  // 🕐 FORMAT MM:SS
  // ============================================================

  formatCompteRebours(): string {

    const minutes = Math.floor(
      this.compteReboursSecondes / 60
    );

    const secondes =
      this.compteReboursSecondes % 60;

    return `${minutes
      .toString()
      .padStart(2, '0')}:${secondes
        .toString()
        .padStart(2, '0')}`;
  }


  // ============================================================
  // 🔄 ROUIVRIR LE RAPPEL
  // ============================================================

  retourRappelAvecCompteRebours(rappel: any): void {

    /*
     * On arrête immédiatement le compteur
     */
    this.arreterCompteRebours();

    /*
     * On retire la sélection
     */
    this.rappelReouvertureId = null;

    this.compteReboursSecondes = 0;

    /*
     * On conserve ta logique existante
     */
    this.retourRappel(rappel);
  }


  // ============================================================
  // 🛑 ARRÊTER LE COMPTEUR
  // ============================================================

  private arreterCompteRebours(): void {

    if (this.compteReboursInterval) {

      clearInterval(this.compteReboursInterval);

      this.compteReboursInterval = null;
    }
  }






}