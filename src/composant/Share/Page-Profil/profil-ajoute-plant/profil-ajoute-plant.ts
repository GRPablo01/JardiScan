// ============================================================
// 🌱 PROFIL AJOUTE PLANT — JARDISCAN
// ============================================================

import {
  Component,
  OnDestroy,
  OnInit
} from '@angular/core';

import {
  CommonModule
} from '@angular/common';

import {
  FormsModule
} from '@angular/forms';

import {
  RouterLink
} from '@angular/router';

import {
  HttpClient,
  HttpErrorResponse
} from '@angular/common/http';

import {
  Subscription
} from 'rxjs';

import {
  ThemeService
} from '../../../../../Backend/Services/theme.service';

import {
  PlantService,
  Plant
} from '../../../../../Backend/Services/plant.service';


// ============================================================
// 🌿 INTERFACE PLANTE
// ============================================================
//
// IMPORTANT :
//
// Le champ "nombre" n'est volontairement PAS présent ici.
//
// Il est généré automatiquement par le backend.
//
// Exemple :
//
// première plante  → nombre = 1
// deuxième plante  → nombre = 2
// troisième plante → nombre = 3
//
// ============================================================

interface NouvellePlante {

  // ----------------------------------------------------------
  // 🌱 IDENTITÉ
  // ----------------------------------------------------------

  nomCommun: string;

  nomScientifique: string;

  famille: string;

  description: string;

  origine: string;


  // ----------------------------------------------------------
  // 🎨 CARACTÉRISTIQUES
  // ----------------------------------------------------------

  couleur: string;

  periodeFloraison: string;

  periodeRecolte: string;

  cycle: string;


  // ----------------------------------------------------------
  // ☀️ CONDITIONS
  // ----------------------------------------------------------

  exposition: string;

  arrosage: string;

  sol: string;

  temperatureMin: number | null;

  temperatureMax: number | null;

  humidite: string;


  // ----------------------------------------------------------
  // ⚠️ SÉCURITÉ
  // ----------------------------------------------------------

  partiesDangereuses: string;


  // ----------------------------------------------------------
  // 🍽️ CULINAIRE
  // ----------------------------------------------------------

  usageCulinaire: string;


  // ----------------------------------------------------------
  // 🔁 RETOUR FACULTATIF
  // ----------------------------------------------------------

  retoure: string;
}


// ============================================================
// 🚀 COMPOSANT
// ============================================================

@Component({
  selector: 'app-profil-ajoute-plant',

  standalone: true,

  imports: [
    CommonModule,
    FormsModule,
    RouterLink
  ],

  templateUrl: './profil-ajoute-plant.html',

  styleUrl: './profil-ajoute-plant.css'
})
export class ProfilAjoutePlant
  implements OnInit, OnDestroy {


  // ==========================================================
  // 🌐 API
  // ==========================================================

  private readonly apiUrl =
    'http://localhost:3000/api/plant';


  // ==========================================================
  // 👤 UTILISATEUR CONNECTÉ
  // ==========================================================

  utilisateur: any = null;


  // ==========================================================
  // 🌿 TOUTES LES PLANTES
  // ==========================================================
  //
  // Cette liste est récupérée avec PlantService.
  //
  // Exemple :
  //
  // [
  //   {
  //     nombre: 1,
  //     nomCommun: "Tournesol"
  //   },
  //   {
  //     nombre: 2,
  //     nomCommun: "Rose"
  //   }
  // ]
  //
  // ==========================================================

  plantes: Plant[] = [];

  plantesLoading = false;

  plantesErreur = '';


  // ==========================================================
  // 📊 NOMBRE TOTAL DE PLANTES
  // ==========================================================

  nombreTotalPlantes = 0;


  // ==========================================================
  // 🔢 DERNIER NUMÉRO
  // ==========================================================

  dernierNombrePlante: number | null = null;


  // ==========================================================
  // ⏳ ÉTAT CRÉATION
  // ==========================================================

  creationLoading = false;

  creationErreur = '';

  creationSucces = '';


  // ==========================================================
  // 🖼️ IMAGE
  // ==========================================================

  imageSelectionnee: File | null = null;

  imagePreview: string | null = null;


  // ==========================================================
  // 🌱 FORMULAIRE
  // ==========================================================

  nouvellePlante: NouvellePlante =
    this.creerPlanteVide();


  // ==========================================================
  // 🔄 SUBSCRIPTIONS
  // ==========================================================

  private creationSubscription?: Subscription;

  private plantesSubscription?: Subscription;


  // ==========================================================
  // 🚀 CONSTRUCTEUR
  // ==========================================================

  constructor(
    public themeService: ThemeService,

    private http: HttpClient,

    private plantService: PlantService
  ) {}


  // ==========================================================
  // 🚀 INITIALISATION
  // ==========================================================

  ngOnInit(): void {

    // --------------------------------------------------------
    // 👤 Récupérer utilisateur
    // --------------------------------------------------------

    this.recupererUtilisateur();


    // --------------------------------------------------------
    // 🌱 Récupérer toutes les plantes
    // --------------------------------------------------------

    this.recupererToutesLesPlantes();
  }


  // ==========================================================
  // 👤 RÉCUPÉRER UTILISATEUR
  // ==========================================================

  private recupererUtilisateur(): void {

    const utilisateurStocke =
      localStorage.getItem('utilisateur');


    // --------------------------------------------------------
    // Aucun utilisateur
    // --------------------------------------------------------

    if (!utilisateurStocke) {

      this.utilisateur = null;

      return;
    }


    // --------------------------------------------------------
    // Lecture
    // --------------------------------------------------------

    try {

      this.utilisateur =
        JSON.parse(
          utilisateurStocke
        );

    } catch (error) {

      console.error(
        '❌ Impossible de récupérer l’utilisateur :',
        error
      );

      this.utilisateur = null;
    }
  }


  // ==========================================================
  // 🌱 RÉCUPÉRER TOUTES LES PLANTES
  // ==========================================================
  //
  // Utilise PlantService.
  //
  // GET :
  //
  // http://localhost:3000/api/plant
  //
  // ==========================================================

  recupererToutesLesPlantes(): void {

    // --------------------------------------------------------
    // Annuler ancienne requête
    // --------------------------------------------------------

    this.plantesSubscription
      ?.unsubscribe();


    // --------------------------------------------------------
    // État chargement
    // --------------------------------------------------------

    this.plantesLoading = true;

    this.plantesErreur = '';


    // --------------------------------------------------------
    // 📡 Récupération
    // --------------------------------------------------------

    this.plantesSubscription =
      this.plantService
        .getPlants()
        .subscribe({

          // ==================================================
          // ✅ SUCCÈS
          // ==================================================

          next: (plantes: Plant[]) => {

            console.log(
              '🌱 Plantes récupérées :',
              plantes
            );


            // ------------------------------------------------
            // Stockage
            // ------------------------------------------------

            this.plantes =
              Array.isArray(plantes)
                ? plantes
                : [];


            // ------------------------------------------------
            // Nombre total
            // ------------------------------------------------

            this.nombreTotalPlantes =
              this.plantes.length;


            // ------------------------------------------------
            // Trier par nombre
            //
            // 1
            // 2
            // 3
            // 4
            //
            // ------------------------------------------------

            this.plantes.sort(
              (a, b) => {

                const nombreA =
                  typeof a.nombre === 'number'
                    ? a.nombre
                    : Number.MAX_SAFE_INTEGER;

                const nombreB =
                  typeof b.nombre === 'number'
                    ? b.nombre
                    : Number.MAX_SAFE_INTEGER;


                return nombreA - nombreB;
              }
            );


            // ------------------------------------------------
            // Dernier numéro
            // ------------------------------------------------

            const plantesAvecNombre =
              this.plantes.filter(
                (plante) =>
                  typeof plante.nombre === 'number'
              );


            if (
              plantesAvecNombre.length > 0
            ) {

              this.dernierNombrePlante =
                Math.max(
                  ...plantesAvecNombre.map(
                    (plante) =>
                      plante.nombre as number
                  )
                );

            } else {

              this.dernierNombrePlante =
                null;
            }


            // ------------------------------------------------
            // Fin chargement
            // ------------------------------------------------

            this.plantesLoading = false;
          },


          // ==================================================
          // ❌ ERREUR
          // ==================================================

          error: (error: unknown) => {

            console.error(
              '❌ Erreur récupération des plantes :',
              error
            );


            this.plantes = [];

            this.nombreTotalPlantes = 0;

            this.dernierNombrePlante = null;

            this.plantesLoading = false;


            // ------------------------------------------------
            // Message
            // ------------------------------------------------

            if (
              error instanceof HttpErrorResponse
            ) {

              this.plantesErreur =
                this.getMessageErreurRecuperation(
                  error
                );

            } else {

              this.plantesErreur =
                'Impossible de récupérer les plantes.';
            }
          }
        });
  }


  // ==========================================================
  // ❌ MESSAGE ERREUR RÉCUPÉRATION
  // ==========================================================

  private getMessageErreurRecuperation(
    error: HttpErrorResponse
  ): string {

    // --------------------------------------------------------
    // Backend objet
    // --------------------------------------------------------

    if (
      error?.error &&
      typeof error.error === 'object'
    ) {

      if (
        typeof error.error.message === 'string' &&
        error.error.message.trim()
      ) {

        return error.error.message;
      }


      if (
        typeof error.error.error === 'string' &&
        error.error.error.trim()
      ) {

        return error.error.error;
      }
    }


    // --------------------------------------------------------
    // Backend texte
    // --------------------------------------------------------

    if (
      typeof error?.error === 'string' &&
      error.error.trim()
    ) {

      return error.error;
    }


    // --------------------------------------------------------
    // Serveur inaccessible
    // --------------------------------------------------------

    if (error.status === 0) {

      return (
        'Impossible de contacter le serveur JardiScan. ' +
        'Vérifiez que le backend est bien démarré sur le port 3000.'
      );
    }


    // --------------------------------------------------------
    // Erreur serveur
    // --------------------------------------------------------

    if (error.status >= 500) {

      return (
        'Une erreur interne est survenue lors de la récupération des plantes.'
      );
    }


    return (
      'Impossible de récupérer les plantes.'
    );
  }


  // ==========================================================
  // 🌱 CRÉER PLANTE VIDE
  // ==========================================================

  private creerPlanteVide(): NouvellePlante {

    return {

      // ------------------------------------------------------
      // 🌱 IDENTITÉ
      // ------------------------------------------------------

      nomCommun: '',

      nomScientifique: '',

      famille: '',

      description: '',

      origine: '',


      // ------------------------------------------------------
      // 🎨 CARACTÉRISTIQUES
      // ------------------------------------------------------

      couleur: '',

      periodeFloraison: '',

      periodeRecolte: '',

      cycle: '',


      // ------------------------------------------------------
      // ☀️ CONDITIONS
      // ------------------------------------------------------

      exposition: '',

      arrosage: '',

      sol: '',

      temperatureMin: null,

      temperatureMax: null,

      humidite: '',


      // ------------------------------------------------------
      // ⚠️ SÉCURITÉ
      // ------------------------------------------------------

      partiesDangereuses: '',


      // ------------------------------------------------------
      // 🍽️ CULINAIRE
      // ------------------------------------------------------

      usageCulinaire: '',


      // ------------------------------------------------------
      // 🔁 RETOUR
      // ------------------------------------------------------

      retoure: ''
    };
  }


  // ==========================================================
  // 🖼️ SÉLECTIONNER UNE IMAGE
  // ==========================================================

  selectionnerImage(
    event: Event
  ): void {

    const input =
      event.target as HTMLInputElement;


    // --------------------------------------------------------
    // Aucun fichier
    // --------------------------------------------------------

    if (
      !input.files ||
      input.files.length === 0
    ) {

      return;
    }


    const fichier =
      input.files[0];


    // ========================================================
    // 📏 TAILLE MAXIMALE
    // ========================================================

    const tailleMaximale =
      10 * 1024 * 1024;


    if (
      fichier.size > tailleMaximale
    ) {

      this.creationErreur =
        'L’image ne doit pas dépasser 10 Mo.';

      this.imageSelectionnee = null;

      this.imagePreview = null;

      input.value = '';

      return;
    }


    // ========================================================
    // 🖼️ FORMATS AUTORISÉS
    // ========================================================

    const formatsAutorises = [
      'image/jpeg',
      'image/jpg',
      'image/png',
      'image/webp',
      'image/gif'
    ];


    if (
      !formatsAutorises.includes(
        fichier.type
      )
    ) {

      this.creationErreur =
        'Format d’image non pris en charge. Utilisez JPG, JPEG, PNG, WEBP ou GIF.';

      this.imageSelectionnee = null;

      this.imagePreview = null;

      input.value = '';

      return;
    }


    // ========================================================
    // ✅ IMAGE VALIDE
    // ========================================================

    this.creationErreur = '';

    this.imageSelectionnee =
      fichier;


    // ========================================================
    // 👁️ APERÇU
    // ========================================================

    const lecteur =
      new FileReader();


    lecteur.onload = () => {

      this.imagePreview =
        lecteur.result as string;
    };


    lecteur.onerror = () => {

      this.imagePreview = null;

      this.creationErreur =
        'Impossible de lire cette image.';
    };


    lecteur.readAsDataURL(
      fichier
    );
  }


  // ==========================================================
  // 🗑️ SUPPRIMER IMAGE
  // ==========================================================

  supprimerImage(): void {

    this.imageSelectionnee =
      null;

    this.imagePreview =
      null;

    this.creationErreur =
      '';
  }


  // ==========================================================
  // 🌱 AJOUTER LA PLANTE
  // ==========================================================

  ajouterPlante(): void {

    // ========================================================
    // 🧹 NETTOYAGE
    // ========================================================

    this.creationErreur = '';

    this.creationSucces = '';


    // ========================================================
    // 🛑 DOUBLE SOUMISSION
    // ========================================================

    if (
      this.creationLoading
    ) {

      return;
    }


    // ========================================================
    // 🧹 NETTOYAGE VALEURS
    // ========================================================

    const nomCommun =
      this.nouvellePlante.nomCommun.trim();

    const nomScientifique =
      this.nouvellePlante.nomScientifique.trim();

    const famille =
      this.nouvellePlante.famille.trim();

    const description =
      this.nouvellePlante.description.trim();

    const origine =
      this.nouvellePlante.origine.trim();

    const couleur =
      this.nouvellePlante.couleur.trim();

    const periodeFloraison =
      this.nouvellePlante.periodeFloraison.trim();

    const periodeRecolte =
      this.nouvellePlante.periodeRecolte.trim();

    const cycle =
      this.nouvellePlante.cycle.trim();

    const exposition =
      this.nouvellePlante.exposition.trim();

    const arrosage =
      this.nouvellePlante.arrosage.trim();

    const sol =
      this.nouvellePlante.sol.trim();

    const humidite =
      this.nouvellePlante.humidite.trim();

    const partiesDangereuses =
      this.nouvellePlante.partiesDangereuses.trim();

    const usageCulinaire =
      this.nouvellePlante.usageCulinaire.trim();

    const retoure =
      this.nouvellePlante.retoure.trim();


    // ========================================================
    // ❌ VALIDATIONS
    // ========================================================

    if (!nomCommun) {

      this.creationErreur =
        'Veuillez renseigner le nom commun de la plante.';

      return;
    }


    if (!nomScientifique) {

      this.creationErreur =
        'Veuillez renseigner le nom scientifique de la plante.';

      return;
    }


    if (!famille) {

      this.creationErreur =
        'Veuillez renseigner la famille de la plante.';

      return;
    }


    if (!description) {

      this.creationErreur =
        'Veuillez renseigner la description de la plante.';

      return;
    }


    if (!origine) {

      this.creationErreur =
        'Veuillez renseigner l’origine de la plante.';

      return;
    }


    if (!couleur) {

      this.creationErreur =
        'Veuillez renseigner la couleur de la plante.';

      return;
    }


    if (!cycle) {

      this.creationErreur =
        'Veuillez renseigner le cycle de la plante.';

      return;
    }


    if (!exposition) {

      this.creationErreur =
        'Veuillez renseigner l’exposition de la plante.';

      return;
    }


    if (!arrosage) {

      this.creationErreur =
        'Veuillez renseigner l’arrosage de la plante.';

      return;
    }


    if (!sol) {

      this.creationErreur =
        'Veuillez renseigner le type de sol.';

      return;
    }


    // ========================================================
    // 🌡️ TEMPÉRATURE MINIMALE
    // ========================================================

    if (
      this.nouvellePlante.temperatureMin === null ||
      this.nouvellePlante.temperatureMin === undefined
    ) {

      this.creationErreur =
        'Veuillez renseigner la température minimale.';

      return;
    }


    // ========================================================
    // 🌡️ TEMPÉRATURE MAXIMALE
    // ========================================================

    if (
      this.nouvellePlante.temperatureMax === null ||
      this.nouvellePlante.temperatureMax === undefined
    ) {

      this.creationErreur =
        'Veuillez renseigner la température maximale.';

      return;
    }


    // ========================================================
    // 🌡️ COHÉRENCE
    // ========================================================

    if (
      Number(
        this.nouvellePlante.temperatureMin
      ) >
      Number(
        this.nouvellePlante.temperatureMax
      )
    ) {

      this.creationErreur =
        'La température minimale ne peut pas être supérieure à la température maximale.';

      return;
    }


    if (!humidite) {

      this.creationErreur =
        'Veuillez renseigner le niveau d’humidité.';

      return;
    }


    if (!partiesDangereuses) {

      this.creationErreur =
        'Veuillez renseigner les parties dangereuses.';

      return;
    }


    if (!usageCulinaire) {

      this.creationErreur =
        'Veuillez renseigner l’usage culinaire.';

      return;
    }


    // ========================================================
    // ⏳ CHARGEMENT
    // ========================================================

    this.creationLoading = true;


    // ========================================================
    // 📦 FORM DATA
    // ========================================================

    const formData =
      new FormData();


    // ========================================================
    // 🌱 IDENTITÉ
    // ========================================================

    formData.append(
      'nomCommun',
      nomCommun
    );

    formData.append(
      'nomScientifique',
      nomScientifique
    );

    formData.append(
      'famille',
      famille
    );

    formData.append(
      'description',
      description
    );

    formData.append(
      'origine',
      origine
    );


    // ========================================================
    // 🎨 CARACTÉRISTIQUES
    // ========================================================

    formData.append(
      'couleur',
      couleur
    );

    formData.append(
      'periodeFloraison',
      periodeFloraison
    );

    formData.append(
      'periodeRecolte',
      periodeRecolte
    );

    formData.append(
      'cycle',
      cycle
    );


    // ========================================================
    // ☀️ CONDITIONS
    // ========================================================

    formData.append(
      'exposition',
      exposition
    );

    formData.append(
      'arrosage',
      arrosage
    );

    formData.append(
      'sol',
      sol
    );

    formData.append(
      'temperatureMin',
      String(
        Number(
          this.nouvellePlante.temperatureMin
        )
      )
    );

    formData.append(
      'temperatureMax',
      String(
        Number(
          this.nouvellePlante.temperatureMax
        )
      )
    );

    formData.append(
      'humidite',
      humidite
    );


    // ========================================================
    // ⚠️ SÉCURITÉ
    // ========================================================

    formData.append(
      'partiesDangereuses',
      partiesDangereuses
    );


    // ========================================================
    // 🍽️ CULINAIRE
    // ========================================================

    formData.append(
      'usageCulinaire',
      usageCulinaire
    );


    // ========================================================
    // 🔁 RETOUR FACULTATIF
    // ========================================================

    if (retoure) {

      formData.append(
        'retoure',
        retoure
      );
    }


    // ========================================================
    // 🖼️ IMAGE
    // ========================================================
    //
    // IMPORTANT :
    //
    // Le backend attend :
    //
    // upload.array('images', ...)
    //
    // donc :
    //
    // "images"
    //
    // ========================================================

    if (
      this.imageSelectionnee
    ) {

      formData.append(
        'images',
        this.imageSelectionnee,
        this.imageSelectionnee.name
      );
    }


    // ========================================================
    // 🔎 DEBUG
    // ========================================================

    console.log(
      '📦 Données envoyées à /api/plant :'
    );


    formData.forEach(
      (valeur, cle) => {

        if (
          valeur instanceof File
        ) {

          console.log(
            `${cle} = fichier :`,
            valeur.name,
            valeur.type,
            valeur.size
          );

        } else {

          console.log(
            `${cle} =`,
            valeur
          );
        }
      }
    );


    // ========================================================
    // 📤 ENVOI
    // ========================================================

    this.envoyerPlante(
      formData
    );
  }


  // ==========================================================
  // 📤 ENVOYER PLANTE
  // ==========================================================

  private envoyerPlante(
    donnees: FormData
  ): void {

    // --------------------------------------------------------
    // Annuler ancienne requête
    // --------------------------------------------------------

    this.creationSubscription
      ?.unsubscribe();


    // ========================================================
    // 📡 POST
    // ========================================================

    this.creationSubscription =
      this.http
        .post<any>(
          this.apiUrl,
          donnees
        )
        .subscribe({

          // ==================================================
          // ✅ SUCCÈS
          // ==================================================

          next: (response) => {

            console.log(
              '🌱 Plante ajoutée avec succès :',
              response
            );


            this.creationLoading =
              false;


            this.creationSucces =
              'La plante a été ajoutée avec succès à JardiScan.';


            this.creationErreur =
              '';


            // ------------------------------------------------
            // 🔢 Afficher le numéro attribué
            // ------------------------------------------------

            const planteCreee =
              response?.plante ||
              response?.plant;


            if (
              planteCreee &&
              typeof planteCreee.nombre === 'number'
            ) {

              this.creationSucces =
                `La plante a été ajoutée avec succès à JardiScan. Numéro de plante : ${planteCreee.nombre}.`;
            }


            // ------------------------------------------------
            // Réinitialiser formulaire
            // ------------------------------------------------

            this.reinitialiserFormulaire();


            // ------------------------------------------------
            // Récupérer à nouveau toutes les plantes
            // ------------------------------------------------

            this.recupererToutesLesPlantes();


            // ------------------------------------------------
            // Rafraîchir utilisateur
            // ------------------------------------------------

            this.recupererUtilisateur();
          },


          // ==================================================
          // ❌ ERREUR
          // ==================================================

          error: (
            error: HttpErrorResponse
          ) => {

            console.error(
              '❌ Erreur lors de la création de la plante :',
              error
            );


            console.error(
              '❌ Statut HTTP :',
              error.status
            );


            console.error(
              '❌ Réponse backend :',
              error.error
            );


            this.creationLoading =
              false;


            this.creationSucces =
              '';


            this.creationErreur =
              this.getMessageErreur(
                error
              );
          }
        });
  }


  // ==========================================================
  // ❌ MESSAGE ERREUR CRÉATION
  // ==========================================================

  private getMessageErreur(
    error: HttpErrorResponse
  ): string {

    // ========================================================
    // Backend objet
    // ========================================================

    if (
      error?.error &&
      typeof error.error === 'object'
    ) {

      if (
        typeof error.error.message === 'string' &&
        error.error.message.trim()
      ) {

        return error.error.message;
      }


      if (
        typeof error.error.error === 'string' &&
        error.error.error.trim()
      ) {

        return error.error.error;
      }


      if (
        typeof error.error.details === 'string' &&
        error.error.details.trim()
      ) {

        return error.error.details;
      }
    }


    // ========================================================
    // Backend texte
    // ========================================================

    if (
      typeof error?.error === 'string' &&
      error.error.trim()
    ) {

      return error.error;
    }


    // ========================================================
    // SERVEUR INACCESSIBLE
    // ========================================================

    if (
      error.status === 0
    ) {

      return (
        'Impossible de contacter le serveur JardiScan. ' +
        'Vérifiez que le backend est bien démarré sur le port 3000.'
      );
    }


    // ========================================================
    // 400
    // ========================================================

    if (
      error.status === 400
    ) {

      return (
        'Les informations envoyées sont invalides. ' +
        'Vérifiez les champs de la plante et le format de l’image.'
      );
    }


    // ========================================================
    // 401
    // ========================================================

    if (
      error.status === 401
    ) {

      return (
        'Vous devez être connecté pour ajouter une plante.'
      );
    }


    // ========================================================
    // 403
    // ========================================================

    if (
      error.status === 403
    ) {

      return (
        'Vous n’avez pas l’autorisation d’ajouter cette plante.'
      );
    }


    // ========================================================
    // 404
    // ========================================================

    if (
      error.status === 404
    ) {

      return (
        'La route de création de plante est introuvable sur le serveur.'
      );
    }


    // ========================================================
    // 413
    // ========================================================

    if (
      error.status === 413
    ) {

      return (
        'L’image envoyée est trop volumineuse.'
      );
    }


    // ========================================================
    // 500+
    // ========================================================

    if (
      error.status >= 500
    ) {

      return (
        'Une erreur interne est survenue sur le serveur JardiScan.'
      );
    }


    // ========================================================
    // GÉNÉRIQUE
    // ========================================================

    return (
      'Une erreur est survenue lors de la création de la plante.'
    );
  }


  // ==========================================================
  // 🧹 RÉINITIALISER FORMULAIRE
  // ==========================================================

  private reinitialiserFormulaire(): void {

    this.nouvellePlante =
      this.creerPlanteVide();


    this.imageSelectionnee =
      null;


    this.imagePreview =
      null;


    this.creationErreur =
      '';
  }


  // ==========================================================
  // 🔢 OBTENIR LE NUMÉRO D'UNE PLANTE
  // ==========================================================
  //
  // Permet au HTML de faire :
  //
  // {{ obtenirNumeroPlante(plante) }}
  //
  // ==========================================================

  obtenirNumeroPlante(
    plante: Plant
  ): string {

    if (
      typeof plante?.nombre === 'number'
    ) {

      return `#${plante.nombre}`;
    }


    return '#—';
  }


  // ==========================================================
  // 🌱 NOM D'UNE PLANTE
  // ==========================================================

  obtenirNomPlante(
    plante: Plant
  ): string {

    return this.plantService
      .getPlantDisplayName(
        plante
      );
  }


  // ==========================================================
  // 🖼️ IMAGE D'UNE PLANTE
  // ==========================================================

  obtenirImagePlante(
    plante: Plant
  ): string {

    return this.plantService
      .getMainImage(
        plante
      );
  }


  // ==========================================================
  // 🧹 DESTRUCTION
  // ==========================================================

  ngOnDestroy(): void {

    // --------------------------------------------------------
    // Annuler création
    // --------------------------------------------------------

    this.creationSubscription
      ?.unsubscribe();


    // --------------------------------------------------------
    // Annuler récupération
    // --------------------------------------------------------

    this.plantesSubscription
      ?.unsubscribe();


    // --------------------------------------------------------
    // Libérer preview blob
    // --------------------------------------------------------

    if (
      this.imagePreview &&
      this.imagePreview.startsWith('blob:')
    ) {

      URL.revokeObjectURL(
        this.imagePreview
      );
    }
  }
}