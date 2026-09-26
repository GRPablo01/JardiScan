import {
  Component,
  ElementRef,
  OnDestroy,
  OnInit,
  ViewChild
} from '@angular/core';

import {
  CommonModule
} from '@angular/common';

interface PlantNetSpecies {
  scientificName?: string;
  scientificNameWithoutAuthor?: string;
  scientificNameAuthorship?: string;

  commonNames?: string[];

  genus?: {
    scientificName?: string;
    scientificNameWithoutAuthor?: string;
  };

  family?: {
    scientificName?: string;
    scientificNameWithoutAuthor?: string;
  };
}

interface PlantNetImage {
  organ?: string;
  url?: string;
  author?: string;
  license?: string;
  citation?: string;
}

interface PlantNetResult {
  score?: number;
  species?: PlantNetSpecies;
  images?: PlantNetImage[];
}

interface PlantNetResponse {
  bestMatch?: string;

  results?: PlantNetResult[];

  predictedOrgans?: string[];

  version?: string;

  remainingIdentificationRequests?: number;

  query?: any;

  otherResults?: any;

  message?: string;
}

@Component({
  selector: 'app-widget-scan',
  standalone: true,
  imports: [
    CommonModule
  ],
  templateUrl: './widget-scan.html',
  styleUrl: './widget-scan.css'
})
export class WidgetScan implements OnInit, OnDestroy {

  // ============================================================
  // 🎥 CAMÉRA
  // ============================================================

  @ViewChild('video')
  video?: ElementRef<HTMLVideoElement>;

  private mediaStream: MediaStream | null = null;

  cameraActive = false;

  cameraError = false;

  cameraErrorMessage = '';

  // ============================================================
  // 👤 UTILISATEUR
  // ============================================================

  utilisateur: any = null;

  // ============================================================
  // 🌱 JARDIDEX
  // ============================================================

  jardiDex: any[] = [];

  // ============================================================
  // 📸 IMAGES DU SCAN
  // ============================================================

  imagesScan: File[] = [];

  imageUrls: string[] = [];

  /**
   * Pl@ntNet accepte jusqu'à 5 images
   * d'une même plante dans une requête.
   */
  readonly maxImages = 5;

  // ============================================================
  // 🧠 ÉTAT DU SCAN
  // ============================================================

  scanning = false;

  scanTermine = false;

  erreurScan = false;

  noMatch = false;

  messageScan = '';

  // ============================================================
  // 🌿 RÉSULTAT PRINCIPAL
  // ============================================================

  planteDetectee: any = null;

  confiance = 0;

  // ============================================================
  // 🥈 RÉSULTATS ALTERNATIFS
  // ============================================================

  resultatsAlternatifs: any[] = [];

  // ============================================================
  // 🌿 RÉSULTAT BRUT PL@NTNET
  // ============================================================

  plantNetResult: PlantNetResponse | null = null;

  plantNetVersion = '';

  remainingRequests: number | null = null;

  // ============================================================
  // 📊 PROGRESSION
  // ============================================================

  comparisonProgress = 0;

  comparisonStatus =
    'Préparation de l’analyse...';

  // ============================================================
  // 🌐 BACKEND JARDISCAN
  // ============================================================

  /**
   * IMPORTANT :
   *
   * Angular appelle uniquement ton backend.
   *
   * La clé Pl@ntNet doit rester dans server.js
   * et ne doit JAMAIS être placée ici.
   */
  private readonly apiUrl =
    'http://localhost:3000/api/plants/identify';

  // ============================================================
  // 🎯 SEUIL D'AFFICHAGE
  // ============================================================

  /**
   * Ce seuil ne signifie PAS :
   *
   * "70 % de certitude réelle".
   *
   * C'est simplement le seuil utilisé par JardiScan
   * pour considérer le résultat comme suffisamment
   * intéressant pour être présenté comme identification.
   */
  readonly seuilConfiance = 70;

  // ============================================================
  // 🚀 INITIALISATION
  // ============================================================

  ngOnInit(): void {

    this.recupererUtilisateur();

    this.demarrerCamera();
  }

  // ============================================================
  // 👤 RÉCUPÉRER L'UTILISATEUR
  // ============================================================

  private recupererUtilisateur(): void {

    const utilisateurStorage =
      localStorage.getItem('utilisateur');

    if (!utilisateurStorage) {

      this.utilisateur = null;

      this.jardiDex = [];

      return;
    }

    try {

      const utilisateur =
        JSON.parse(utilisateurStorage);

      this.utilisateur =
        utilisateur;

      this.jardiDex =
        Array.isArray(
          utilisateur?.jardiDex
        )
          ? utilisateur.jardiDex
          : [];

    } catch {

      this.utilisateur = null;

      this.jardiDex = [];
    }
  }

  // ============================================================
  // 🎥 DÉMARRER LA CAMÉRA
  // ============================================================

  async demarrerCamera(): Promise<void> {

    if (
      !navigator.mediaDevices ||
      !navigator.mediaDevices.getUserMedia
    ) {

      this.cameraActive = false;

      this.cameraError = true;

      this.cameraErrorMessage =
        'La caméra n’est pas disponible sur ce navigateur.';

      return;
    }

    this.arreterCamera();

    try {

      this.cameraError = false;

      this.cameraErrorMessage = '';

      this.mediaStream =
        await navigator.mediaDevices.getUserMedia({

          video: {

            facingMode: {
              ideal: 'environment'
            },

            width: {
              ideal: 1920
            },

            height: {
              ideal: 1080
            },

            aspectRatio: {
              ideal: 16 / 9
            }
          },

          audio: false
        });

      this.cameraActive = true;

      this.connecterVideo();

    } catch (error) {

      console.error(
        'Erreur caméra :',
        error
      );

      this.cameraActive = false;

      this.cameraError = true;

      this.cameraErrorMessage =
        'Impossible d’accéder à la caméra. Vérifiez les permissions de votre navigateur.';
    }
  }

  // ============================================================
  // 🎥 CONNECTER LE STREAM
  // ============================================================

  private connecterVideo(): void {

    if (!this.video) {

      setTimeout(() => {

        this.connecterVideo();

      }, 100);

      return;
    }

    if (!this.mediaStream) {

      return;
    }

    const videoElement =
      this.video.nativeElement;

    videoElement.srcObject =
      this.mediaStream;

    videoElement.muted = true;

    videoElement.playsInline = true;

    videoElement.autoplay = true;

    videoElement.play().catch(() => {});
  }

  // ============================================================
  // 📸 PRENDRE UNE PHOTO
  // ============================================================

  prendrePhoto(): void {

    if (
      !this.video ||
      !this.cameraActive ||
      this.scanning
    ) {

      return;
    }

    if (
      this.imagesScan.length >=
      this.maxImages
    ) {

      return;
    }

    const video =
      this.video.nativeElement;

    if (
      video.readyState <
      HTMLMediaElement.HAVE_CURRENT_DATA
    ) {

      return;
    }

    if (
      video.videoWidth === 0 ||
      video.videoHeight === 0
    ) {

      return;
    }

    const canvas =
      document.createElement('canvas');

    canvas.width =
      video.videoWidth;

    canvas.height =
      video.videoHeight;

    const context =
      canvas.getContext('2d');

    if (!context) {

      return;
    }

    context.drawImage(
      video,
      0,
      0,
      canvas.width,
      canvas.height
    );

    canvas.toBlob(
      (blob: Blob | null) => {

        if (!blob) {

          return;
        }

        const maintenant =
          Date.now();

        const fichier =
          new File(
            [blob],
            `jardiscan-${maintenant}.jpg`,
            {
              type: 'image/jpeg',
              lastModified: maintenant
            }
          );

        this.ajouterFichierScan(
          fichier
        );
      },
      'image/jpeg',
      0.90
    );
  }

  // ============================================================
  // 📁 OUVRIR LE FILE PICKER
  // ============================================================

  ouvrirFilePicker(): void {

    const input =
      document.getElementById(
        'fileInput'
      ) as HTMLInputElement | null;

    input?.click();
  }

  // ============================================================
  // 📁 FICHIERS SÉLECTIONNÉS
  // ============================================================

  onFileSelected(event: Event): void {

    const input =
      event.target as HTMLInputElement;

    if (!input.files?.length) {

      return;
    }

    const fichiers =
      Array.from(input.files);

    for (const fichier of fichiers) {

      if (
        this.imagesScan.length >=
        this.maxImages
      ) {

        break;
      }

      if (
        !fichier.type.startsWith(
          'image/'
        )
      ) {

        continue;
      }

      this.ajouterFichierScan(
        fichier
      );
    }

    input.value = '';
  }

  // ============================================================
  // 📸 AJOUTER UNE IMAGE
  // ============================================================

  private ajouterFichierScan(
    fichier: File
  ): void {

    if (
      this.imagesScan.length >=
      this.maxImages
    ) {

      return;
    }

    this.imagesScan.push(
      fichier
    );

    const url =
      URL.createObjectURL(
        fichier
      );

    this.imageUrls.push(
      url
    );

    this.reinitialiserResultat();

    this.erreurScan = false;

    this.noMatch = false;

    this.messageScan = '';
  }

  // ============================================================
  // 🗑️ SUPPRIMER UNE IMAGE
  // ============================================================

  supprimerImage(
    index: number
  ): void {

    if (
      index < 0 ||
      index >= this.imagesScan.length
    ) {

      return;
    }

    const url =
      this.imageUrls[index];

    if (url) {

      URL.revokeObjectURL(
        url
      );
    }

    this.imagesScan.splice(
      index,
      1
    );

    this.imageUrls.splice(
      index,
      1
    );

    this.reinitialiserResultat();
  }

  // ============================================================
  // 🧹 RÉINITIALISER LE RÉSULTAT
  // ============================================================

  private reinitialiserResultat(): void {

    this.planteDetectee = null;

    this.confiance = 0;

    this.resultatsAlternatifs = [];

    this.plantNetResult = null;

    this.plantNetVersion = '';

    this.remainingRequests = null;

    this.scanTermine = false;

    this.erreurScan = false;

    this.noMatch = false;

    this.comparisonProgress = 0;

    this.comparisonStatus =
      'Préparation de l’analyse...';
  }

  // ============================================================
  // 🧠 LANCER LE SCAN
  // ============================================================

  async lancerScan(): Promise<void> {

    if (!this.imagesScan.length) {

      this.erreurScan = true;

      this.noMatch = false;

      this.messageScan =
        'Prenez au moins une photo de la plante.';

      return;
    }

    if (this.scanning) {

      return;
    }

    this.scanning = true;

    this.scanTermine = false;

    this.erreurScan = false;

    this.noMatch = false;

    this.messageScan = '';

    this.planteDetectee = null;

    this.confiance = 0;

    this.resultatsAlternatifs = [];

    this.plantNetResult = null;

    this.comparisonProgress = 0;

    this.comparisonStatus =
      'Préparation des images...';

    this.arreterCamera();

    try {

      // --------------------------------------------------------
      // 1. PRÉPARATION
      // --------------------------------------------------------

      await this.mettreAJourProgression(
        10,
        'Préparation des images...'
      );

      // --------------------------------------------------------
      // 2. ENVOI
      // --------------------------------------------------------

      await this.mettreAJourProgression(
        25,
        'Envoi des images au moteur d’identification...'
      );

      const resultat =
        await this.analyserAvecIA();

      // --------------------------------------------------------
      // 3. ANALYSE
      // --------------------------------------------------------

      await this.mettreAJourProgression(
        50,
        'Analyse des caractéristiques de la plante...'
      );

      if (!resultat) {

        this.refuserIdentification(
          'Impossible d’obtenir un résultat d’identification.'
        );

        return;
      }

      // --------------------------------------------------------
      // 4. STOCKAGE RÉPONSE PL@NTNET
      // --------------------------------------------------------

      this.plantNetResult =
        resultat;

      this.plantNetVersion =
        String(
          resultat?.version ||
          ''
        );

      this.remainingRequests =
        this.extraireQuota(
          resultat
        );

      // --------------------------------------------------------
      // 5. EXTRAIRE LES RÉSULTATS
      // --------------------------------------------------------

      const resultats =
        this.extraireResultats(
          resultat
        );

      if (!resultats.length) {

        this.refuserIdentification(
          resultat?.message ||
          'Aucune plante n’a pu être identifiée à partir des images.'
        );

        return;
      }

      // --------------------------------------------------------
      // 6. PROGRESSION
      // --------------------------------------------------------

      await this.mettreAJourProgression(
        70,
        'Vérification des résultats...'
      );

      // --------------------------------------------------------
      // 7. MEILLEUR RÉSULTAT
      // --------------------------------------------------------

      const meilleur =
        resultats[0];

      const score =
        this.normaliserScore(
          meilleur?.score
        );

      const plante =
        this.convertirResultatPlanteNet(
          meilleur
        );

      // --------------------------------------------------------
      // 8. RÉSULTATS ALTERNATIFS
      // --------------------------------------------------------

      this.resultatsAlternatifs =
        resultats
          .slice(1, 5)
          .map(
            resultatAlternatif =>
              this.convertirResultatPlanteNet(
                resultatAlternatif
              )
          );

      // --------------------------------------------------------
      // 9. AUCUNE IDENTIFICATION
      // --------------------------------------------------------

      if (!plante) {

        this.refuserIdentification(
          'Le moteur d’identification n’a pas retourné une plante exploitable.'
        );

        return;
      }

      // --------------------------------------------------------
      // 10. SCORE INSUFFISANT
      // --------------------------------------------------------

      if (
        score <
        this.seuilConfiance
      ) {

        this.planteDetectee = {
          ...plante,
          score,
          confiance: score
        };

        this.confiance =
          score;

        this.noMatch = true;

        this.erreurScan = false;

        this.scanTermine = false;

        this.messageScan =
          `Le résultat principal est encore incertain (${score} %). Ajoutez une photo plus nette de la feuille, de la fleur ou du fruit puis réessayez.`;

        this.comparisonProgress = 100;

        this.comparisonStatus =
          'Identification incertaine.';

        return;
      }

      // --------------------------------------------------------
      // 11. IDENTIFICATION ACCEPTÉE
      // --------------------------------------------------------

      this.confiance =
        score;

      this.planteDetectee = {

        ...plante,

        score,

        confiance: score,

        rang: 1,

        plantNet: meilleur
      };

      // --------------------------------------------------------
      // 12. FIN
      // --------------------------------------------------------

      await this.mettreAJourProgression(
        100,
        'Identification terminée.'
      );

      this.scanTermine = true;

      this.noMatch = false;

      this.erreurScan = false;

      this.messageScan =
        'Identification terminée. Vérifiez le résultat avant de l’ajouter à votre JardiDex.';

    } catch (error) {

      console.error(
        'Erreur identification JardiScan :',
        error
      );

      const message =
        error instanceof Error
          ? error.message
          : 'Une erreur est survenue pendant l’analyse.';

      this.refuserIdentification(
        message ||
        'Une erreur est survenue pendant l’analyse. Vérifiez que le serveur JardiScan est démarré puis réessayez.'
      );

    } finally {

      this.scanning = false;
    }
  }

  // ============================================================
  // 🧠 EXTRAIRE LES RÉSULTATS PL@NTNET
  // ============================================================

  private extraireResultats(
    resultat: PlantNetResponse
  ): PlantNetResult[] {

    if (
      Array.isArray(
        resultat?.results
      )
    ) {

      return resultat.results
        .filter(
          item =>
            !!item?.species
        )
        .sort(
          (a, b) =>
            Number(b?.score ?? 0) -
            Number(a?.score ?? 0)
        );
    }

    // ----------------------------------------------------------
    // Compatibilité avec ton ancien backend
    // ----------------------------------------------------------

    const identification =
      (resultat as any)?.identification;

    if (
      identification?.plante
    ) {

      return [
        {
          score:
            identification?.score ??
            identification?.confiance ??
            0,

          species: {

            scientificName:
              identification?.plante?.nomScientifique ??
              identification?.plante?.scientificName ??
              identification?.plante?.espece,

            commonNames: [

              identification?.plante?.nomCommun ??
              identification?.plante?.nom ??
              identification?.plante?.name

            ].filter(Boolean)
          }
        }
      ];
    }

    return [];
  }

  // ============================================================
  // 🌿 CONVERTIR RÉSULTAT PL@NTNET
  // ============================================================

  private convertirResultatPlanteNet(
    resultat: PlantNetResult | null
  ): any | null {

    if (
      !resultat?.species
    ) {

      return null;
    }

    const species =
      resultat.species;

    const score =
      this.normaliserScore(
        resultat.score
      );

    const nomScientifique =
      species.scientificName ||
      species.scientificNameWithoutAuthor ||
      '';

    const nomCommun =
      this.getCommonName(
        species
      );

    const famille =
      species?.family?.scientificName ||
      species?.family?.scientificNameWithoutAuthor ||
      '';

    const genre =
      species?.genus?.scientificName ||
      species?.genus?.scientificNameWithoutAuthor ||
      '';

    const images =
      Array.isArray(
        resultat.images
      )
        ? resultat.images
            .map(
              image =>
                typeof image === 'string'
                  ? image
                  : image?.url || ''
            )
            .filter(Boolean)
        : [];

    return {

      _id:
        null,

      key:
        nomScientifique,

      nom:
        nomCommun ||
        nomScientifique,

      nomCommun:
        nomCommun,

      nomScientifique:
        nomScientifique,

      scientificName:
        nomScientifique,

      espece:
        nomScientifique,

      species:
        nomScientifique,

      famille:
        famille,

      family:
        famille,

      genre:
        genre,

      description:
        '',

      images:
        images,

      image:
        images[0] || '',

      score:
        score,

      confiance:
        score,

      plantNet: resultat
    };
  }

  // ============================================================
  // 🌱 NOM COMMUN
  // ============================================================

  private getCommonName(
    species: PlantNetSpecies
  ): string {

    if (
      !Array.isArray(
        species?.commonNames
      )
    ) {

      return '';
    }

    const noms =
      species.commonNames
        .filter(
          nom =>
            typeof nom === 'string' &&
            nom.trim().length > 0
        );

    return noms[0] || '';
  }

  // ============================================================
  // 📊 NORMALISER SCORE
  // ============================================================

  private normaliserScore(
    score: unknown
  ): number {

    if (
      typeof score === 'string'
    ) {

      score =
        score
          .replace('%', '')
          .replace(',', '.')
          .trim();
    }

    const numericScore =
      Number(score);

    if (
      !Number.isFinite(
        numericScore
      )
    ) {

      return 0;
    }

    /**
     * Pl@ntNet retourne actuellement
     * un score entre 0 et 1.
     *
     * Exemple :
     *
     * 0.94 -> 94
     *
     * On garde également la compatibilité
     * avec un backend qui retournerait déjà
     * 94.
     */

    const score100 =
      numericScore <= 1
        ? numericScore * 100
        : numericScore;

    return Math.round(
      Math.max(
        0,
        Math.min(
          100,
          score100
        )
      )
    );
  }

  // ============================================================
  // 📊 QUOTA PL@NTNET
  // ============================================================

  private extraireQuota(
    resultat: any
  ): number | null {

    const quota =
      Number(
        resultat?.remainingIdentificationRequests
      );

    if (
      Number.isFinite(quota)
    ) {

      return quota;
    }

    return null;
  }

  // ============================================================
  // 📊 PROGRESSION
  // ============================================================

  private async mettreAJourProgression(
    progression: number,
    message: string
  ): Promise<void> {

    this.comparisonProgress =
      Math.max(
        0,
        Math.min(
          100,
          progression
        )
      );

    this.comparisonStatus =
      message;

    await new Promise<void>(
      resolve => {

        setTimeout(
          resolve,
          180
        );
      }
    );
  }

  // ============================================================
  // 🌐 APPEL BACKEND
  // ============================================================

  private async analyserAvecIA():
    Promise<PlantNetResponse> {

    const formData =
      new FormData();

    // ----------------------------------------------------------
    // 📸 ENVOYER JUSQU'À 5 IMAGES
    // ----------------------------------------------------------

    for (
      const image of this.imagesScan
    ) {

      formData.append(
        'images',
        image,
        image.name
      );
    }

    // ----------------------------------------------------------
    // 🌿 JARDIDEX
    // ----------------------------------------------------------

    formData.append(
      'jardiDex',
      JSON.stringify(
        this.jardiDex
      )
    );

    // ----------------------------------------------------------
    // 👤 UTILISATEUR
    // ----------------------------------------------------------

    if (
      this.utilisateur
    ) {

      if (
        this.utilisateur._id
      ) {

        formData.append(
          'utilisateurId',
          String(
            this.utilisateur._id
          )
        );

      } else if (
        this.utilisateur.id
      ) {

        formData.append(
          'utilisateurId',
          String(
            this.utilisateur.id
          )
        );

      } else if (
        this.utilisateur.email
      ) {

        formData.append(
          'email',
          String(
            this.utilisateur.email
          )
        );
      }
    }

    // ----------------------------------------------------------
    // 🇫🇷 LANGUE
    // ----------------------------------------------------------

    formData.append(
      'lang',
      'fr'
    );

    // ----------------------------------------------------------
    // 🌿 PROJET PL@NTNET
    // ----------------------------------------------------------

    formData.append(
      'project',
      'all'
    );

    // ----------------------------------------------------------
    // 🔬 ORGANES
    // ----------------------------------------------------------

    /**
     * auto = Pl@ntNet détecte automatiquement
     * si l'image représente une feuille,
     * une fleur, un fruit, etc.
     */
    for (
      let i = 0;
      i < this.imagesScan.length;
      i++
    ) {

      formData.append(
        'organs',
        'auto'
      );
    }

    // ----------------------------------------------------------
    // 📊 NOMBRE DE RÉSULTATS
    // ----------------------------------------------------------

    formData.append(
      'nb-results',
      '5'
    );

    // ----------------------------------------------------------
    // 🌿 IMAGES SIMILAIRES
    // ----------------------------------------------------------

    formData.append(
      'include-related-images',
      'true'
    );

    // ----------------------------------------------------------
    // 🌐 REQUÊTE
    // ----------------------------------------------------------

    const response =
      await fetch(
        this.apiUrl,
        {
          method: 'POST',
          body: formData
        }
      );

    // ----------------------------------------------------------
    // ❌ ERREUR HTTP
    // ----------------------------------------------------------

    if (!response.ok) {

      let message =
        'Erreur lors de l’identification.';

      try {

        const erreur =
          await response.json();

        if (
          typeof erreur?.message ===
          'string'
        ) {

          message =
            erreur.message;
        }

        /**
         * Gestion spécifique du quota.
         */
        if (
          response.status === 429
        ) {

          message =
            'Le quota quotidien d’identification est atteint. Réessayez plus tard.';
        }

      } catch {

        // Réponse non JSON.
      }

      throw new Error(
        message
      );
    }

    // ----------------------------------------------------------
    // 📦 JSON
    // ----------------------------------------------------------

    const resultat =
      await response.json();

    if (
      !resultat
    ) {

      throw new Error(
        'Le serveur a retourné une réponse vide.'
      );
    }

    return resultat;
  }

  // ============================================================
  // ❌ REFUSER L'IDENTIFICATION
  // ============================================================

  private refuserIdentification(
    message: string
  ): void {

    this.planteDetectee = null;

    this.confiance = 0;

    this.scanTermine = false;

    this.erreurScan = true;

    this.noMatch = true;

    this.messageScan =
      message;

    this.comparisonProgress = 0;

    this.comparisonStatus =
      'Identification impossible.';
  }

  // ============================================================
  // 🔄 NOUVEAU SCAN
  // ============================================================

  resetScan(): void {

    this.libererImages();

    this.planteDetectee = null;

    this.confiance = 0;

    this.scanning = false;

    this.scanTermine = false;

    this.erreurScan = false;

    this.noMatch = false;

    this.messageScan = '';

    this.resultatsAlternatifs = [];

    this.plantNetResult = null;

    this.plantNetVersion = '';

    this.remainingRequests = null;

    this.comparisonProgress = 0;

    this.comparisonStatus =
      'Préparation de l’analyse...';

    this.cameraError = false;

    this.cameraErrorMessage = '';

    if (
      !this.cameraActive
    ) {

      this.demarrerCamera();
    }
  }

  // ============================================================
  // 🌱 AJOUTER AU JARDIDEX
  // ============================================================

  ajouterAuJardiDex(): void {

    if (
      !this.planteDetectee
    ) {

      return;
    }

    const plante =
      this.planteDetectee;

    const identifiant =
      plante?._id ??
      plante?.id ??
      plante?.key ??
      plante?.nomScientifique ??
      plante?.scientificName ??
      plante?.nom ??
      plante?.nomCommun;

    if (!identifiant) {

      this.messageScan =
        'Impossible d’identifier cette plante dans le JardiDex.';

      return;
    }

    const dejaPresente =
      this.jardiDex.some(
        (item: any) => {

          const itemId =
            item?._id ??
            item?.id ??
            item?.key ??
            item?.nomScientifique ??
            item?.scientificName ??
            item?.nom ??
            item?.nomCommun;

          return (
            String(itemId) ===
            String(identifiant)
          );
        }
      );

    if (
      dejaPresente
    ) {

      this.messageScan =
        'Cette plante est déjà présente dans votre JardiDex.';

      return;
    }

    this.jardiDex = [
      ...this.jardiDex,
      plante
    ];

    if (
      this.utilisateur
    ) {

      this.utilisateur = {
        ...this.utilisateur,
        jardiDex:
          this.jardiDex
      };

      localStorage.setItem(
        'utilisateur',
        JSON.stringify(
          this.utilisateur
        )
      );
    }

    this.messageScan =
      'La plante a été ajoutée à votre JardiDex.';
  }

  // ============================================================
  // 🌿 VÉRIFIER JARDIDEX
  // ============================================================

  get planteDansJardiDex(): boolean {

    if (
      !this.planteDetectee
    ) {

      return false;
    }

    const identifiant =
      this.planteDetectee?._id ??
      this.planteDetectee?.id ??
      this.planteDetectee?.key ??
      this.planteDetectee?.nomScientifique ??
      this.planteDetectee?.scientificName ??
      this.planteDetectee?.nom;

    if (!identifiant) {

      return false;
    }

    return this.jardiDex.some(
      (item: any) => {

        const itemId =
          item?._id ??
          item?.id ??
          item?.key ??
          item?.nomScientifique ??
          item?.scientificName ??
          item?.nom;

        return (
          String(itemId) ===
          String(identifiant)
        );
      }
    );
  }

  // ============================================================
  // 🧹 LIBÉRER LES IMAGES
  // ============================================================

  private libererImages(): void {

    this.imageUrls.forEach(
      url => {

        if (url) {

          URL.revokeObjectURL(
            url
          );
        }
      }
    );

    this.imagesScan = [];

    this.imageUrls = [];
  }

  // ============================================================
  // 🛑 ARRÊTER LA CAMÉRA
  // ============================================================

  arreterCamera(): void {

    if (
      this.mediaStream
    ) {

      this.mediaStream
        .getTracks()
        .forEach(
          track => {

            track.stop();
          }
        );

      this.mediaStream = null;
    }

    this.cameraActive = false;

    if (
      this.video
    ) {

      this.video.nativeElement.srcObject =
        null;
    }
  }

  // ============================================================
  // 🔢 NOMBRE D'IMAGES
  // ============================================================

  get nombreImages(): number {

    return this.imagesScan.length;
  }

  // ============================================================
  // 📷 PEUT CAPTURER
  // ============================================================

  get peutCapturer(): boolean {

    return (
      this.cameraActive &&
      !this.scanning &&
      this.imagesScan.length <
        this.maxImages
    );
  }

  // ============================================================
  // 📁 PEUT AJOUTER DES IMAGES
  // ============================================================

  get peutAjouterImages(): boolean {

    return (
      !this.scanning &&
      this.imagesScan.length <
        this.maxImages
    );
  }

  // ============================================================
  // 🌱 NOM DE LA PLANTE
  // ============================================================

  getResultPlantName(): string {

    return (
      this.planteDetectee?.nomCommun ||
      this.planteDetectee?.nom ||
      this.planteDetectee?.name ||
      this.planteDetectee?.commonName ||
      this.planteDetectee?.espece ||
      this.planteDetectee?.species ||
      this.planteDetectee?.nomScientifique ||
      this.planteDetectee?.scientificName ||
      'Plante identifiée'
    );
  }

  // ============================================================
  // 🔬 NOM SCIENTIFIQUE
  // ============================================================

  getResultScientificName(): string {

    return (
      this.planteDetectee?.nomScientifique ||
      this.planteDetectee?.scientificName ||
      this.planteDetectee?.scientific_name ||
      this.planteDetectee?.espece ||
      this.planteDetectee?.species ||
      ''
    );
  }

  // ============================================================
  // 🌳 FAMILLE
  // ============================================================

  getResultFamily(): string {

    return (
      this.planteDetectee?.famille ||
      this.planteDetectee?.family ||
      ''
    );
  }

  // ============================================================
  // 🌿 GENRE
  // ============================================================

  getResultGenus(): string {

    return (
      this.planteDetectee?.genre ||
      this.planteDetectee?.genus ||
      ''
    );
  }

  // ============================================================
  // 📝 DESCRIPTION
  // ============================================================

  getResultDescription(): string {

    return (
      this.planteDetectee?.description ||
      this.planteDetectee?.desc ||
      ''
    );
  }

  // ============================================================
  // 📊 SCORE
  // ============================================================

  getResultScore(): number {

    const score =
      this.planteDetectee?.confiance ??
      this.planteDetectee?.score ??
      this.planteDetectee?.confidence ??
      this.confiance ??
      0;

    return this.normaliserScore(
      score
    );
  }

  // ============================================================
  // 🏷️ LABEL DE CONFIANCE
  // ============================================================

  getScoreLabel(): string {

    const score =
      this.getResultScore();

    if (score >= 95) {

      return 'Résultat très probable';
    }

    if (score >= 85) {

      return 'Résultat fortement probable';
    }

    if (score >= 70) {

      return 'Résultat probable';
    }

    if (score >= 50) {

      return 'Résultat incertain';
    }

    return 'Résultat très incertain';
  }

  // ============================================================
  // 🧠 DESCRIPTION CONFIANCE
  // ============================================================

  getScoreDescription(): string {

    const score =
      this.getResultScore();

    if (score >= 95) {

      return (
        'Les images fournies correspondent fortement au résultat proposé par le moteur d’identification.'
      );
    }

    if (score >= 85) {

      return (
        'Les caractéristiques visibles correspondent fortement au résultat proposé.'
      );
    }

    if (score >= 70) {

      return (
        'Le résultat est compatible avec les caractéristiques visibles, mais une vérification visuelle reste recommandée.'
      );
    }

    if (score >= 50) {

      return (
        'Le résultat reste incertain. Ajoutez des photos plus détaillées.'
      );
    }

    return (
      'Les images ne permettent pas de proposer une identification suffisamment fiable.'
    );
  }

  // ============================================================
  // 🟢 IDENTIFICATION VALIDÉE
  // ============================================================

  get identificationValidee(): boolean {

    return (
      !!this.planteDetectee &&
      this.getResultScore() >=
        this.seuilConfiance
    );
  }

  // ============================================================
  // 🖼️ IMAGE PRINCIPALE
  // ============================================================

  getResultMainImage(): string {

    const plante =
      this.planteDetectee;

    if (!plante) {

      return (
        this.imageUrls[0] ||
        ''
      );
    }

    if (
      typeof plante.image ===
        'string' &&
      plante.image
    ) {

      return this.normaliserImageUrl(
        plante.image
      );
    }

    if (
      typeof plante.imageUrl ===
        'string' &&
      plante.imageUrl
    ) {

      return this.normaliserImageUrl(
        plante.imageUrl
      );
    }

    if (
      Array.isArray(
        plante.images
      ) &&
      plante.images.length
    ) {

      const image =
        plante.images[0];

      if (
        typeof image ===
        'string'
      ) {

        return this.normaliserImageUrl(
          image
        );
      }

      if (
        image?.url
      ) {

        return this.normaliserImageUrl(
          image.url
        );
      }
    }

    return (
      this.imageUrls[0] ||
      ''
    );
  }

  // ============================================================
  // 🖼️ IMAGES DE RÉFÉRENCE
  // ============================================================

  getResultImages(): string[] {

    const plante =
      this.planteDetectee;

    if (!plante) {

      return [];
    }

    const images: string[] = [];

    if (
      Array.isArray(
        plante.images
      )
    ) {

      for (
        const image of plante.images
      ) {

        if (
          typeof image ===
          'string'
        ) {

          const url =
            this.normaliserImageUrl(
              image
            );

          if (url) {

            images.push(url);
          }

        } else if (
          image?.url
        ) {

          const url =
            this.normaliserImageUrl(
              image.url
            );

          if (url) {

            images.push(url);
          }
        }

        if (
          images.length >= 5
        ) {

          break;
        }
      }
    }

    if (
      !images.length &&
      plante.image
    ) {

      const url =
        this.normaliserImageUrl(
          plante.image
        );

      if (url) {

        images.push(url);
      }
    }

    if (
      !images.length &&
      plante.imageUrl
    ) {

      const url =
        this.normaliserImageUrl(
          plante.imageUrl
        );

      if (url) {

        images.push(url);
      }
    }

    return images;
  }

  // ============================================================
  // 🖼️ IMAGES PL@NTNET
  // ============================================================

  getPlantNetImages(): PlantNetImage[] {

    const resultat =
      this.planteDetectee?.plantNet;

    if (
      !Array.isArray(
        resultat?.images
      )
    ) {

      return [];
    }

    return resultat.images
      .filter(
        (image: any) =>
          !!image?.url
      )
      .slice(
        0,
        5
      );
  }

  // ============================================================
  // 🌿 NOM SCIENTIFIQUE ALTERNATIF
  // ============================================================

  getAlternativeScientificName(
    resultat: any
  ): string {

    return (
      resultat?.nomScientifique ||
      resultat?.scientificName ||
      resultat?.espece ||
      resultat?.species ||
      ''
    );
  }

  // ============================================================
  // 🌿 NOM COMMUN ALTERNATIF
  // ============================================================

  getAlternativePlantName(
    resultat: any
  ): string {

    return (
      resultat?.nomCommun ||
      resultat?.nom ||
      resultat?.name ||
      resultat?.scientificName ||
      'Plante'
    );
  }

  // ============================================================
  // 📊 SCORE ALTERNATIF
  // ============================================================

  getAlternativeScore(
    resultat: any
  ): number {

    return this.normaliserScore(
      resultat?.score ??
      resultat?.confiance ??
      resultat?.confidence ??
      0
    );
  }

  // ============================================================
  // 🖼️ NORMALISER URL IMAGE
  // ============================================================

  private normaliserImageUrl(
    url: string
  ): string {

    if (!url) {

      return '';
    }

    if (
      url.startsWith(
        'http://'
      ) ||
      url.startsWith(
        'https://'
      ) ||
      url.startsWith(
        'blob:'
      ) ||
      url.startsWith(
        'data:'
      )
    ) {

      return url;
    }

    if (
      url.startsWith('/')
    ) {

      return (
        `http://localhost:3000${url}`
      );
    }

    return url;
  }

  // ============================================================
  // ❌ IMAGE CASSÉE
  // ============================================================

  handleImageError(
    event: Event
  ): void {

    const image =
      event.target as
      HTMLImageElement;

    image.style.display =
      'none';
  }

  // ============================================================
  // 🧹 DESTRUCTION
  // ============================================================

  ngOnDestroy(): void {

    this.arreterCamera();

    this.libererImages();
  }
}
