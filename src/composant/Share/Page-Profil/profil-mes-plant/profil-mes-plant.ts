
// ============================================================
// 🌱 PROFIL MES PLANTES — JARDISCAN
// ============================================================

import {
  Component,
  OnInit
} from '@angular/core';

import {
  CommonModule
} from '@angular/common';

import {
  UserService
} from '../../../../../Backend/Services/user.service';

import {
  PlantService,
  Plant
} from '../../../../../Backend/Services/plant.service';

@Component({
  selector: 'app-profil-mes-plant',
  standalone: true,
  imports: [
    CommonModule
  ],
  templateUrl: './profil-mes-plant.html',
  styleUrl: './profil-mes-plant.css'
})
export class ProfilMesPlant implements OnInit {

  // ============================================================
  // 👤 UTILISATEUR CONNECTÉ
  // ============================================================

  utilisateur: any = null;

  // ============================================================
  // 🌿 JARDIDEX DE L'UTILISATEUR
  // ============================================================

  jardiDex: any[] = [];

  // ============================================================
  // 🌱 NOMBRES DU JARDIDEX
  // ============================================================

  nombresJardiDex: number[] = [];

  // ============================================================
  // 🌱 PLANTES
  // ============================================================

  plantes: Plant[] = [];

  // ============================================================
  // 🔄 CHARGEMENT UTILISATEUR
  // ============================================================

  chargementUtilisateur = false;

  // ============================================================
  // 🔄 CHARGEMENT PLANTES
  // ============================================================

  chargementPlantes = false;

  // ============================================================
  // ❌ ERREUR UTILISATEUR
  // ============================================================

  erreurUtilisateur = '';

  // ============================================================
  // ❌ ERREUR PLANTES
  // ============================================================

  erreurPlantes = '';

  // ============================================================
  // 🔢 NOMBRE TOTAL DE PLANTES
  // ============================================================

  nombrePlantes = 0;

  // ============================================================
  // 🔓 NOMBRE DE PLANTES DÉBLOQUÉES
  // ============================================================

  nombrePlantesDebloquees = 0;

  // ============================================================
  // 🔒 NOMBRE DE PLANTES VERROUILLÉES
  // ============================================================

  nombrePlantesVerrouillees = 0;

  // ============================================================
  // 🌱 PLANTE SÉLECTIONNÉE
  // ============================================================

  planteSelectionnee: Plant | null = null;

  // ============================================================
  // 🌐 URL DU SERVEUR
  // ============================================================

  private readonly serverUrl =
    'http://localhost:3000';

  // ============================================================
  // 💉 CONSTRUCTEUR
  // ============================================================

  constructor(
    private readonly userService: UserService,
    private readonly plantService: PlantService
  ) {}

  // ============================================================
  // 🚀 INITIALISATION
  // ============================================================

  ngOnInit(): void {

    this.recupererUtilisateur();

    this.recupererToutesLesPlantes();
  }

  // ============================================================
  // 👤 RÉCUPÉRER L'UTILISATEUR
  // ============================================================

  private recupererUtilisateur(): void {

    const utilisateurStocke =
      localStorage.getItem('utilisateur');

    // ----------------------------------------------------------
    // ❌ AUCUN UTILISATEUR LOCAL
    // ----------------------------------------------------------

    if (!utilisateurStocke) {

      this.utilisateur = null;
      this.jardiDex = [];
      this.nombresJardiDex = [];

      return;
    }

    let utilisateurLocal: any;

    // ----------------------------------------------------------
    // 🔄 PARSING
    // ----------------------------------------------------------

    try {

      utilisateurLocal =
        JSON.parse(utilisateurStocke);

    } catch {

      this.utilisateur = null;
      this.jardiDex = [];
      this.nombresJardiDex = [];

      return;
    }

    // ----------------------------------------------------------
    // ❌ DONNÉES INVALIDES
    // ----------------------------------------------------------

    if (
      !utilisateurLocal ||
      typeof utilisateurLocal !== 'object'
    ) {

      this.utilisateur = null;
      this.jardiDex = [];
      this.nombresJardiDex = [];

      return;
    }

    // ----------------------------------------------------------
    // 🔑 IDENTIFIANT
    // ----------------------------------------------------------

    const idUtilisateur =
      utilisateurLocal._id ||
      utilisateurLocal.key;

    // ----------------------------------------------------------
    // 👤 UTILISATEUR LOCAL DISPONIBLE
    // ----------------------------------------------------------

    this.utilisateur =
      utilisateurLocal;

    this.recupererJardiDex();

    // ----------------------------------------------------------
    // 🔑 PAS D'ID
    // ----------------------------------------------------------

    if (!idUtilisateur) {
      return;
    }

    // ----------------------------------------------------------
    // 🌐 RÉCUPÉRATION API
    // ----------------------------------------------------------

    this.chargementUtilisateur = true;
    this.erreurUtilisateur = '';

    this.userService
      .getUser(String(idUtilisateur))
      .subscribe({

        // ======================================================
        // ✅ SUCCÈS
        // ======================================================

        next: (response: any) => {

          const utilisateurApi =
            response?.utilisateur ||
            response?.user ||
            response;

          if (
            utilisateurApi &&
            typeof utilisateurApi === 'object'
          ) {

            this.utilisateur = {
              ...utilisateurLocal,
              ...utilisateurApi
            };

            // --------------------------------------------------
            // 💾 MISE À JOUR LOCALSTORAGE
            // --------------------------------------------------

            try {

              localStorage.setItem(
                'utilisateur',
                JSON.stringify(this.utilisateur)
              );

            } catch {
              // Aucun log volontairement
            }
          }

          // --------------------------------------------------
          // 🌿 RECHARGER LE JARDIDEX
          // --------------------------------------------------

          this.recupererJardiDex();

          this.chargementUtilisateur = false;
        },

        // ======================================================
        // ❌ ERREUR
        // ======================================================

        error: () => {

          this.erreurUtilisateur =
            'Impossible de récupérer les informations de votre compte.';

          this.utilisateur =
            utilisateurLocal;

          this.recupererJardiDex();

          this.chargementUtilisateur = false;
        }
      });
  }

  // ============================================================
  // 🌿 RÉCUPÉRER LE JARDIDEX DU USER
  // ============================================================

  private recupererJardiDex(): void {

    const jardiDexUtilisateur =
      this.utilisateur?.jardiDex;

    // ----------------------------------------------------------
    // 📦 TABLEAU
    // ----------------------------------------------------------

    if (Array.isArray(jardiDexUtilisateur)) {

      this.jardiDex = [
        ...jardiDexUtilisateur
      ];

    }

    // ----------------------------------------------------------
    // 📦 OBJET UNIQUE
    // ----------------------------------------------------------

    else if (
      jardiDexUtilisateur &&
      typeof jardiDexUtilisateur === 'object'
    ) {

      this.jardiDex = [
        jardiDexUtilisateur
      ];

    }

    // ----------------------------------------------------------
    // ❌ AUCUN JARDIDEX
    // ----------------------------------------------------------

    else {

      this.jardiDex = [];
    }

    // ----------------------------------------------------------
    // 🔢 EXTRACTION DES NOMBRES
    // ----------------------------------------------------------

    this.nombresJardiDex =
      this.extraireNombresJardiDex();

    // ==========================================================
    // 🔎 SEUL LOG AUTORISÉ POUR LE JARDIDEX
    // ==========================================================

    console.log(
      '🌿 JardiDex du user :',
      this.jardiDex
    );
  }

  // ============================================================
  // 🔢 EXTRAIRE LES NOMBRES DU JARDIDEX
  // ============================================================

  private extraireNombresJardiDex(): number[] {

    if (!Array.isArray(this.jardiDex)) {
      return [];
    }

    const nombres: number[] = [];

    for (const element of this.jardiDex) {

      if (
        element === null ||
        element === undefined
      ) {
        continue;
      }

      let nombre: any = null;

      // --------------------------------------------------------
      // 1️⃣ VALEUR DIRECTE
      // Exemple : [1, 2, 3]
      // --------------------------------------------------------

      if (
        typeof element === 'number' ||
        typeof element === 'string'
      ) {

        nombre = element;
      }

      // --------------------------------------------------------
      // 2️⃣ OBJET
      // Exemple : [{ nombre: 1 }]
      // --------------------------------------------------------

      else if (
        typeof element === 'object'
      ) {

        nombre =
          element?.nombre ??
          element?.numero ??
          element?.number;

        // ------------------------------------------------------
        // 3️⃣ OBJET PLANTE
        // Exemple : [{ plante: { nombre: 1 } }]
        // ------------------------------------------------------

        if (
          nombre === null ||
          nombre === undefined
        ) {

          nombre =
            element?.plante?.nombre ??
            element?.plant?.nombre;
        }
      }

      // --------------------------------------------------------
      // 🔢 CONVERSION
      // --------------------------------------------------------

      const nombreConverti =
        Number(nombre);

      if (
        Number.isFinite(nombreConverti) &&
        !nombres.includes(nombreConverti)
      ) {

        nombres.push(nombreConverti);
      }
    }

    return nombres;
  }

  // ============================================================
  // 🌱 RÉCUPÉRER TOUTES LES PLANTES
  // ============================================================

  private recupererToutesLesPlantes(): void {

    this.chargementPlantes = true;
    this.erreurPlantes = '';
    this.plantes = [];
    this.nombrePlantes = 0;
    this.nombrePlantesDebloquees = 0;
    this.nombrePlantesVerrouillees = 0;

    this.plantService
      .getAllPlants()
      .subscribe({

        // ======================================================
        // ✅ SUCCÈS
        // ======================================================

        next: (plantes: Plant[]) => {

          if (!Array.isArray(plantes)) {

            this.erreurPlantes =
              'Les données reçues sont invalides.';

            this.chargementPlantes = false;

            return;
          }

          this.plantes = [
            ...plantes
          ];

          this.nombrePlantes =
            this.plantes.length;

          // --------------------------------------------------
          // 🔢 CALCUL DES PLANTES DÉBLOQUÉES
          // --------------------------------------------------

          this.nombrePlantesDebloquees =
            this.plantes.filter(
              (plant: Plant) =>
                this.isPlanteDebloquee(plant)
            ).length;

          this.nombrePlantesVerrouillees =
            this.nombrePlantes -
            this.nombrePlantesDebloquees;

          // ==================================================
          // 🔎 SEUL LOG AUTORISÉ POUR LES PLANTES
          // ==================================================

          console.log(
            '🌱 Plantes récupérées :',
            this.plantes
          );

          this.chargementPlantes = false;
        },

        // ======================================================
        // ❌ ERREUR
        // ======================================================

        error: () => {

          this.erreurPlantes =
            'Impossible de récupérer les plantes.';

          this.plantes = [];
          this.nombrePlantes = 0;
          this.nombrePlantesDebloquees = 0;
          this.nombrePlantesVerrouillees = 0;

          this.chargementPlantes = false;
        }
      });
  }

  // ============================================================
  // 🔑 TRACK BY PLANTE
  // ============================================================

  trackByPlante(
    index: number,
    plant: Plant
  ): string | number {

    return (
      plant?._id ||
      (plant as any)?.key ||
      (plant as any)?.nombre ||
      index
    );
  }

  // ============================================================
  // 🔢 RÉCUPÉRER LE NUMÉRO DE LA PLANTE
  // ============================================================

  getNumeroPlante(
    plant: Plant
  ): number | null {

    try {

      const numero =
        this.plantService.getPlantNumber(plant);

      if (
        numero === null ||
        numero === undefined
      ) {
        return null;
      }

      const numeroConverti =
        Number(numero);

      return Number.isFinite(numeroConverti)
        ? numeroConverti
        : null;

    } catch {

      const plantAny: any =
        plant as any;

      const numero =
        plantAny?.nombre ??
        plantAny?.numero ??
        plantAny?.number;

      const numeroConverti =
        Number(numero);

      return Number.isFinite(numeroConverti)
        ? numeroConverti
        : null;
    }
  }

  // ============================================================
  // 🔓 SAVOIR SI UNE PLANTE EST DÉBLOQUÉE
  // ============================================================

  isPlanteDebloquee(
    plant: Plant
  ): boolean {

    const numero =
      this.getNumeroPlante(plant);

    if (numero === null) {
      return false;
    }

    return this.nombresJardiDex.includes(
      numero
    );
  }

  // ============================================================
  // 🔒 SAVOIR SI UNE PLANTE EST VERROUILLÉE
  // ============================================================

  isPlanteVerrouillee(
    plant: Plant
  ): boolean {

    return !this.isPlanteDebloquee(
      plant
    );
  }

  // ============================================================
  // 🎨 CLASSE DE FILTRE IMAGE
  // ============================================================

  getClasseImagePlante(
    plant: Plant
  ): string {

    return this.isPlanteDebloquee(plant)
      ? ''
      : 'grayscale';
  }

  // ============================================================
  // 🌐 CONSTRUIRE URL IMAGE
  // ============================================================

  getImageUpload(
    image: any
  ): string {

    if (!image) {
      return '';
    }

    let url = '';

    // ----------------------------------------------------------
    // STRING
    // ----------------------------------------------------------

    if (
      typeof image === 'string'
    ) {

      url = image;
    }

    // ----------------------------------------------------------
    // OBJET
    // ----------------------------------------------------------

    else if (
      typeof image === 'object'
    ) {

      url =
        image?.url ||
        image?.path ||
        image?.src ||
        image?.image ||
        image?.filename ||
        image?.fileName ||
        '';
    }

    if (!url) {
      return '';
    }

    // ----------------------------------------------------------
    // NETTOYAGE
    // ----------------------------------------------------------

    url = String(url)
      .replace(/\\/g, '/')
      .trim();

    // ----------------------------------------------------------
    // URL COMPLÈTE
    // ----------------------------------------------------------

    if (
      url.startsWith('http://') ||
      url.startsWith('https://') ||
      url.startsWith('data:')
    ) {

      return url;
    }

    // ----------------------------------------------------------
    // /uploads/plants/...
    // ----------------------------------------------------------

    if (
      url.startsWith('/uploads/plants/')
    ) {

      return `${this.serverUrl}${url}`;
    }

    // ----------------------------------------------------------
    // uploads/plants/...
    // ----------------------------------------------------------

    if (
      url.startsWith('uploads/plants/')
    ) {

      return `${this.serverUrl}/${url}`;
    }

    // ----------------------------------------------------------
    // /uploads/...
    // ----------------------------------------------------------

    if (
      url.startsWith('/uploads/')
    ) {

      return `${this.serverUrl}${url}`;
    }

    // ----------------------------------------------------------
    // uploads/...
    // ----------------------------------------------------------

    if (
      url.startsWith('uploads/')
    ) {

      return `${this.serverUrl}/${url}`;
    }

    // ----------------------------------------------------------
    // NOM DE FICHIER
    // ----------------------------------------------------------

    if (
      !url.startsWith('/')
    ) {

      return `${this.serverUrl}/uploads/plants/${url}`;
    }

    // ----------------------------------------------------------
    // AUTRE CHEMIN ABSOLU
    // ----------------------------------------------------------

    return `${this.serverUrl}${url}`;
  }

  // ============================================================
  // 📸 RÉCUPÉRER TOUTES LES IMAGES
  // ============================================================

  getImagesPlante(
    plant: Plant
  ): string[] {

    const plantAny: any =
      plant as any;

    const imagesBrutes: any[] = [];

    // ----------------------------------------------------------
    // 1️⃣ images
    // ----------------------------------------------------------

    if (
      Array.isArray(plantAny?.images)
    ) {

      imagesBrutes.push(
        ...plantAny.images
      );
    }

    // ----------------------------------------------------------
    // 2️⃣ plantImages
    // ----------------------------------------------------------

    if (
      Array.isArray(plantAny?.plantImages)
    ) {

      imagesBrutes.push(
        ...plantAny.plantImages
      );
    }

    // ----------------------------------------------------------
    // 3️⃣ image unique
    // ----------------------------------------------------------

    if (
      plantAny?.image
    ) {

      imagesBrutes.push(
        plantAny.image
      );
    }

    // ----------------------------------------------------------
    // 4️⃣ IMAGE PRINCIPALE SERVICE
    // ----------------------------------------------------------

    try {

      const imageService =
        this.plantService.getMainImage(plant);

      if (imageService) {

        imagesBrutes.unshift(
          imageService
        );
      }

    } catch {
      // Aucun log volontairement
    }

    // ----------------------------------------------------------
    // 🌐 CONVERSION URL
    // ----------------------------------------------------------

    const images =
      imagesBrutes
        .map(
          (image: any) =>
            this.getImageUpload(image)
        )
        .filter(
          (image: string) =>
            !!image
        );

    // ----------------------------------------------------------
    // 🔄 SUPPRESSION DOUBLONS
    // ----------------------------------------------------------

    return [
      ...new Set(images)
    ];
  }

  // ============================================================
  // 🖼️ IMAGE PRINCIPALE
  // ============================================================

  getImagePlante(
    plant: Plant
  ): string {

    const images =
      this.getImagesPlante(plant);

    return images.length > 0
      ? images[0]
      : '';
  }

  // ============================================================
  // 🖼️ IMAGE EN ERREUR
  // ============================================================

  imageErreur(
    event: Event
  ): void {

    const image =
      event.target as HTMLImageElement;

    if (!image) {
      return;
    }

    image.style.display = 'none';
  }

  // ============================================================
  // 🌱 NOM DE LA PLANTE
  // ============================================================

  getNomPlante(
    plant: Plant
  ): string {

    return this.plantService
      .getPlantDisplayName(plant);
  }

  // ============================================================
  // 🔬 NOM SCIENTIFIQUE
  // ============================================================

  getNomScientifique(
    plant: Plant
  ): string {

    return this.plantService
      .getScientificName(plant);
  }

  // ============================================================
  // 🏷️ CATÉGORIE
  // ============================================================

  getCategorie(
    plant: Plant
  ): string {

    return this.plantService
      .getCategory(plant);
  }

  // ============================================================
  // 🌳 FAMILLE
  // ============================================================

  getFamille(
    plant: Plant
  ): string {

    return this.plantService
      .getFamily(plant);
  }

  // ============================================================
  // 🔄 RECHARGER
  // ============================================================

  rechargerPlantes(): void {

    this.recupererToutesLesPlantes();
  }

  // ============================================================
  // 👁️ OUVRIR LES DÉTAILS
  // ============================================================

  ouvrirDetailsPlante(
    plante: Plant
  ): void {

    this.planteSelectionnee =
      plante;

    document.body.style.overflow =
      'hidden';
  }

  // ============================================================
  // ❌ FERMER LES DÉTAILS
  // ============================================================

  fermerDetailsPlante(): void {

    this.planteSelectionnee =
      null;

    document.body.style.overflow =
      '';
  }
}

