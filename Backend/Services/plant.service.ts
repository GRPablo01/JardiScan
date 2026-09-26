// ============================================================
// 🌱 PLANT SERVICE — JARDISCAN
//
// VERSION COMPLÈTE — SANS CONSOLE.LOG / CONSOLE.WARN
//
// ============================================================

import { Injectable } from '@angular/core';

import {
  HttpClient,
  HttpParams
} from '@angular/common/http';

import {
  Observable,
  from,
  of
} from 'rxjs';

import {
  map,
  switchMap
} from 'rxjs/operators';

// ============================================================
// 📸 IMAGE MONGODB
// ============================================================

export interface PlantImage {
  url: string;
  vue?: string;
  _id?: string;
}

// ============================================================
// 🌱 INTERFACE PLANT
// ============================================================

export interface Plant {

  // ----------------------------------------------------------
  // 🗄️ MONGODB
  // ----------------------------------------------------------

  _id?: string;

  // ----------------------------------------------------------
  // 🔢 NUMÉRO AUTOMATIQUE
  // ----------------------------------------------------------

  nombre?: number;

  // ----------------------------------------------------------
  // 🌿 IDENTITÉ
  // ----------------------------------------------------------

  nomCommun: string;
  nomScientifique: string;

  famille?: string;
  genre?: string;
  espece?: string;

  categorie?: string;
  sousCategorie?: string;

  // ----------------------------------------------------------
  // 📝 DESCRIPTION
  // ----------------------------------------------------------

  description?: string;

  // ----------------------------------------------------------
  // 📸 IMAGES
  // ----------------------------------------------------------

  imageUrl?: string;

  images?: Array<
    string | PlantImage
  >;

  // ----------------------------------------------------------
  // 🌍 ORIGINE
  // ----------------------------------------------------------

  origine?: string;
  habitat?: string;

  // ----------------------------------------------------------
  // 🌱 CONDITIONS DE CULTURE
  // ----------------------------------------------------------

  exposition?: string;
  arrosage?: string;
  sol?: string;
  humidite?: string;
  engrais?: string;
  taille?: string;

  // ----------------------------------------------------------
  // 🌡️ TEMPÉRATURES
  // ----------------------------------------------------------

  temperatureMin?: number;
  temperatureMax?: number;

  // ----------------------------------------------------------
  // 📏 CARACTÉRISTIQUES
  // ----------------------------------------------------------

  hauteur?: string;
  floraison?: string;
  periodeFloraison?: string;
  periodeRecolte?: string;
  cycle?: string;

  // ----------------------------------------------------------
  // 🎨 COULEUR
  // ----------------------------------------------------------

  couleur?: string;

  // ----------------------------------------------------------
  // ⚠️ INFORMATIONS
  // ----------------------------------------------------------

  toxicite?: boolean;
  toxique?: boolean;
  comestible?: boolean;
  partiesDangereuses?: string;

  // ----------------------------------------------------------
  // 🍽️ UTILISATION CULINAIRE
  // ----------------------------------------------------------

  usageCulinaire?: string;

  // ----------------------------------------------------------
  // 🌸 ÉLÉMENTS
  // ----------------------------------------------------------

  fruits?: string[];
  fleurs?: string[];
  conseils?: string[];

  // ----------------------------------------------------------
  // 🔁 INFORMATIONS COMPLÉMENTAIRES
  // ----------------------------------------------------------

  retoure?: string | null;

  // ----------------------------------------------------------
  // 📅 DATES MONGODB
  // ----------------------------------------------------------

  createdAt?: string;
  updatedAt?: string;
}

// ============================================================
// 🔎 RÉPONSE API
// ============================================================

export interface PlantApiResponse {

  success?: boolean;
  message?: string;

  // ----------------------------------------------------------
  // UNE PLANTE
  // ----------------------------------------------------------

  plant?: Plant;

  // ----------------------------------------------------------
  // LISTE
  // ----------------------------------------------------------

  plantes?: Plant[];
  plants?: Plant[];

  // ----------------------------------------------------------
  // DATA
  // ----------------------------------------------------------

  data?: Plant | Plant[];

  // ----------------------------------------------------------
  // NOMBRE
  // ----------------------------------------------------------

  count?: number;
}

// ============================================================
// 🤖 RÉPONSE IDENTIFICATION
// ============================================================

export interface PlantIdentificationResponse {

  success?: boolean;
  message?: string;

  plant?: Plant;
  plants?: Plant[];

  data?: Plant | Plant[];

  name?: string;
  nomCommun?: string;
  nomScientifique?: string;

  confidence?: number;
  score?: number;

  [key: string]: any;
}

// ============================================================
// 🌱 SERVICE
// ============================================================

@Injectable({
  providedIn: 'root'
})
export class PlantService {

  // ==========================================================
  // ⚙️ CONFIGURATION IMAGE
  // ==========================================================

  private readonly IMAGE_WIDTH = 800;
  private readonly IMAGE_HEIGHT = 800;
  private readonly IMAGE_QUALITY = 0.80;

  // ==========================================================
  // 🌐 API
  // ==========================================================

  private readonly apiUrl =
    'http://localhost:3000/api/plant';

  private readonly serverUrl =
    'http://localhost:3000';

  // ==========================================================
  // 📂 DOSSIER IMAGES
  // ==========================================================

  private readonly plantsUploadPath =
    `${this.serverUrl}/uploads/plants`;

  // ==========================================================
  // 💉 CONSTRUCTEUR
  // ==========================================================

  constructor(
    private readonly http: HttpClient
  ) {}

  // ==========================================================
  // 🔧 EXTRAIRE LES PLANTES D'UNE RÉPONSE API
  //
  // Compatible avec :
  //
  // 1. [ ... ]
  // 2. { plantes: [...] }
  // 3. { plants: [...] }
  // 4. { plant: [...] }
  // 5. { data: [...] }
  // 6. { data: {...} }
  // 7. { plant: {...} }
  //
  // ==========================================================

  private extractPlants(
    response: PlantApiResponse | Plant[] | unknown
  ): Plant[] {

    // --------------------------------------------------------
    // 1️⃣ TABLEAU DIRECT
    // --------------------------------------------------------

    if (Array.isArray(response)) {
      return response;
    }

    // --------------------------------------------------------
    // 2️⃣ RÉPONSE INVALIDE
    // --------------------------------------------------------

    if (
      !response ||
      typeof response !== 'object'
    ) {
      return [];
    }

    const apiResponse =
      response as PlantApiResponse;

    // --------------------------------------------------------
    // 3️⃣ { plantes: [...] }
    // --------------------------------------------------------

    if (
      Array.isArray(apiResponse.plantes)
    ) {
      return apiResponse.plantes;
    }

    // --------------------------------------------------------
    // 4️⃣ { plants: [...] }
    // --------------------------------------------------------

    if (
      Array.isArray(apiResponse.plants)
    ) {
      return apiResponse.plants;
    }

    // --------------------------------------------------------
    // 5️⃣ { plant: [...] }
    // --------------------------------------------------------

    if (
      Array.isArray(apiResponse.plant)
    ) {
      return apiResponse.plant;
    }

    // --------------------------------------------------------
    // 6️⃣ { data: [...] }
    // --------------------------------------------------------

    if (
      Array.isArray(apiResponse.data)
    ) {
      return apiResponse.data;
    }

    // --------------------------------------------------------
    // 7️⃣ { data: {...} }
    // --------------------------------------------------------

    if (
      apiResponse.data &&
      typeof apiResponse.data === 'object' &&
      !Array.isArray(apiResponse.data)
    ) {
      return [
        apiResponse.data as Plant
      ];
    }

    // --------------------------------------------------------
    // 8️⃣ { plant: {...} }
    // --------------------------------------------------------

    if (
      apiResponse.plant &&
      typeof apiResponse.plant === 'object' &&
      !Array.isArray(apiResponse.plant)
    ) {
      return [
        apiResponse.plant
      ];
    }

    // --------------------------------------------------------
    // 9️⃣ AUCUN FORMAT RECONNU
    // --------------------------------------------------------

    return [];
  }

  // ==========================================================
  // 🌿 GET — RÉCUPÉRER TOUTES LES PLANTES
  //
  // GET /api/plant
  //
  // ==========================================================

  getPlants(): Observable<Plant[]> {

    return this.http
      .get<PlantApiResponse | Plant[]>(
        this.apiUrl
      )
      .pipe(
        map(
          (response) =>
            this.extractPlants(response)
        )
      );
  }

  // ==========================================================
  // 🌿 GET ALL — RÉCUPÉRER TOUTES LES PLANTES
  //
  // GET /api/plant
  //
  // ==========================================================

  getAllPlants(): Observable<Plant[]> {

    return this.http
      .get<PlantApiResponse | Plant[]>(
        this.apiUrl
      )
      .pipe(
        map(
          (response) =>
            this.extractPlants(response)
        )
      );
  }

  // ==========================================================
  // 🌱 GET — UNE PLANTE
  //
  // GET /api/plant/:id
  //
  // ==========================================================

  getPlantById(
    id: string
  ): Observable<Plant> {

    if (!id?.trim()) {
      throw new Error(
        'ID de plante manquant'
      );
    }

    const cleanId =
      id.trim();

    const url =
      `${this.apiUrl}/${encodeURIComponent(cleanId)}`;

    return this.http
      .get<PlantApiResponse>(url)
      .pipe(
        map(
          (response) => {

            // ------------------------------------------------
            // Backend :
            //
            // { plant: {...} }
            // ------------------------------------------------

            if (response?.plant) {
              return response.plant;
            }

            // ------------------------------------------------
            // Compatibilité data
            // ------------------------------------------------

            if (
              response?.data &&
              !Array.isArray(response.data)
            ) {
              return response.data;
            }

            // ------------------------------------------------
            // Réponse directement = plante
            // ------------------------------------------------

            return response as unknown as Plant;
          }
        )
      );
  }

  // ==========================================================
  // 🔎 RECHERCHER DES PLANTES
  //
  // GET /api/plant/search?q=tomate
  //
  // ==========================================================

  searchPlants(
    search: string
  ): Observable<Plant[]> {

    const value =
      search?.trim() || '';

    if (!value) {
      return of([]);
    }

    const params =
      new HttpParams()
        .set(
          'q',
          value
        );

    const url =
      `${this.apiUrl}/search`;

    return this.http
      .get<
        PlantApiResponse |
        Plant[]
      >(
        url,
        {
          params
        }
      )
      .pipe(
        map(
          (response) =>
            this.extractPlants(response)
        )
      );
  }

  // ==========================================================
  // 🏷️ PLANTES PAR CATÉGORIE
  //
  // GET /api/plant/categorie/:categorie
  //
  // ==========================================================

  getPlantsByCategory(
    categorie: string
  ): Observable<Plant[]> {

    if (!categorie?.trim()) {
      throw new Error(
        'Catégorie manquante'
      );
    }

    const cleanCategory =
      categorie.trim();

    const url =
      `${this.apiUrl}/categorie/${encodeURIComponent(
        cleanCategory
      )}`;

    return this.http
      .get<
        Plant[] |
        PlantApiResponse
      >(url)
      .pipe(
        map(
          (response) =>
            this.extractPlants(response)
        )
      );
  }

  // ==========================================================
  // 🌳 PLANTES PAR FAMILLE
  //
  // GET /api/plant/famille/:famille
  //
  // ==========================================================

  getPlantsByFamily(
    famille: string
  ): Observable<Plant[]> {

    if (!famille?.trim()) {
      throw new Error(
        'Famille manquante'
      );
    }

    const cleanFamily =
      famille.trim();

    const url =
      `${this.apiUrl}/famille/${encodeURIComponent(
        cleanFamily
      )}`;

    return this.http
      .get<
        Plant[] |
        PlantApiResponse
      >(url)
      .pipe(
        map(
          (response) =>
            this.extractPlants(response)
        )
      );
  }

  // ==========================================================
  // 🖼️ EXTRAIRE CHEMIN IMAGE
  // ==========================================================

  private extractImagePath(
    image: string | PlantImage | unknown
  ): string {

    // --------------------------------------------------------
    // STRING
    // --------------------------------------------------------

    if (
      typeof image === 'string'
    ) {
      return image.trim();
    }

    // --------------------------------------------------------
    // OBJECT
    // --------------------------------------------------------

    if (
      image &&
      typeof image === 'object'
    ) {

      const imageObject =
        image as PlantImage;

      if (
        typeof imageObject.url === 'string'
      ) {
        return imageObject.url.trim();
      }
    }

    return '';
  }

  // ==========================================================
  // 🖼️ CONSTRUIRE URL IMAGE
  //
  // Aucun placeholder.
  // Aucun asset local.
  //
  // ==========================================================

  getImageUrl(
    imagePath?: string
  ): string {

    // --------------------------------------------------------
    // ABSENTE
    // --------------------------------------------------------

    if (
      imagePath === undefined ||
      imagePath === null
    ) {
      return '';
    }

    let cleanPath =
      String(imagePath).trim();

    if (!cleanPath) {
      return '';
    }

    // --------------------------------------------------------
    // 🚫 PLACEHOLDER
    // --------------------------------------------------------

    if (
      cleanPath
        .toLowerCase()
        .includes('placeholder')
    ) {
      return '';
    }

    // --------------------------------------------------------
    // 🚫 ASSETS LOCAUX
    // --------------------------------------------------------

    if (
      cleanPath
        .replace(/^\/+/, '')
        .toLowerCase()
        .startsWith('assets/')
    ) {
      return '';
    }

    // --------------------------------------------------------
    // 🌐 URL ABSOLUE
    // --------------------------------------------------------

    if (
      cleanPath.startsWith('http://') ||
      cleanPath.startsWith('https://')
    ) {
      return cleanPath;
    }

    // --------------------------------------------------------
    // 💾 DATA URL
    // --------------------------------------------------------

    if (
      cleanPath.startsWith('data:')
    ) {
      return cleanPath;
    }

    // --------------------------------------------------------
    // 🧹 SUPPRESSION DES SLASHES INITIAUX
    // --------------------------------------------------------

    cleanPath =
      cleanPath.replace(/^\/+/, '');

    // --------------------------------------------------------
    // 📂 uploads/...
    // --------------------------------------------------------

    if (
      cleanPath.startsWith('uploads/')
    ) {
      return `${this.serverUrl}/${cleanPath}`;
    }

    // --------------------------------------------------------
    // 🌱 plants/...
    // --------------------------------------------------------

    if (
      cleanPath.startsWith('plants/')
    ) {
      return `${this.serverUrl}/uploads/${cleanPath}`;
    }

    // --------------------------------------------------------
    // 📸 NOM DE FICHIER
    // --------------------------------------------------------

    const filename =
      cleanPath
        .split('/')
        .pop() || '';

    if (!filename) {
      return '';
    }

    return `${this.plantsUploadPath}/${encodeURIComponent(
      filename
    )}`;
  }

  // ==========================================================
  // 📸 IMAGE PRINCIPALE
  // ==========================================================

  getMainImage(
    plant: Plant
  ): string {

    if (!plant) {
      return '';
    }

    // --------------------------------------------------------
    // 1️⃣ imageUrl
    // --------------------------------------------------------

    if (
      plant.imageUrl?.trim()
    ) {

      const image =
        this.getImageUrl(
          plant.imageUrl
        );

      if (image) {
        return image;
      }
    }

    // --------------------------------------------------------
    // 2️⃣ images[]
    // --------------------------------------------------------

    if (
      Array.isArray(plant.images)
    ) {

      for (
        const rawImage of plant.images
      ) {

        const path =
          this.extractImagePath(
            rawImage
          );

        if (!path) {
          continue;
        }

        const image =
          this.getImageUrl(path);

        if (image) {
          return image;
        }
      }
    }

    // --------------------------------------------------------
    // 🚫 AUCUNE IMAGE
    // --------------------------------------------------------

    return '';
  }

  // ==========================================================
  // 📸 TOUTES LES IMAGES
  // ==========================================================

  getPlantImages(
    plant: Plant
  ): string[] {

    if (!plant) {
      return [];
    }

    const result: string[] = [];

    // --------------------------------------------------------
    // images[]
    // --------------------------------------------------------

    if (
      Array.isArray(plant.images)
    ) {

      for (
        const rawImage of plant.images
      ) {

        const path =
          this.extractImagePath(
            rawImage
          );

        if (!path) {
          continue;
        }

        const image =
          this.getImageUrl(path);

        if (!image) {
          continue;
        }

        // ----------------------------------------------------
        // Éviter les doublons
        // ----------------------------------------------------

        if (
          result.includes(image)
        ) {
          continue;
        }

        result.push(image);
      }
    }

    // --------------------------------------------------------
    // imageUrl
    // --------------------------------------------------------

    if (
      result.length === 0 &&
      plant.imageUrl?.trim()
    ) {

      const image =
        this.getImageUrl(
          plant.imageUrl
        );

      if (image) {
        result.push(image);
      }
    }

    return result;
  }

  // ==========================================================
  // 🌱 NOM D'AFFICHAGE
  // ==========================================================

  getPlantDisplayName(
    plant: Plant
  ): string {

    if (!plant) {
      return 'Plante inconnue';
    }

    return (
      plant.nomCommun ||
      plant.nomScientifique ||
      'Plante inconnue'
    );
  }

  // ==========================================================
  // 🔬 NOM SCIENTIFIQUE
  // ==========================================================

  getScientificName(
    plant: Plant
  ): string {

    return (
      plant?.nomScientifique ||
      ''
    );
  }

  // ==========================================================
  // 🏷️ CATÉGORIE
  // ==========================================================

  getCategory(
    plant: Plant
  ): string {

    return (
      plant?.categorie ||
      ''
    );
  }

  // ==========================================================
  // 🌳 FAMILLE
  // ==========================================================

  getFamily(
    plant: Plant
  ): string {

    return (
      plant?.famille ||
      ''
    );
  }

  // ==========================================================
  // 🔢 NUMÉRO DE PLANTE
  // ==========================================================

  getPlantNumber(
    plant: Plant
  ): number | null {

    if (
      typeof plant?.nombre === 'number'
    ) {
      return plant.nombre;
    }

    return null;
  }

  // ==========================================================
  // 📐 REDIMENSIONNEMENT 800 × 800
  // ==========================================================

  resizeImageTo800x800(
    image: Blob
  ): Promise<Blob> {

    return new Promise(
      (
        resolve,
        reject
      ) => {

        if (!image) {
          reject(
            new Error(
              'Image manquante'
            )
          );
          return;
        }

        const imageUrl =
          URL.createObjectURL(image);

        const img =
          new Image();

        img.onload = () => {

          try {

            const canvas =
              document.createElement(
                'canvas'
              );

            canvas.width =
              this.IMAGE_WIDTH;

            canvas.height =
              this.IMAGE_HEIGHT;

            const context =
              canvas.getContext(
                '2d'
              );

            if (!context) {

              URL.revokeObjectURL(
                imageUrl
              );

              reject(
                new Error(
                  'Impossible de récupérer le contexte Canvas'
                )
              );

              return;
            }

            // ------------------------------------------------
            // FOND BLANC
            // ------------------------------------------------

            context.fillStyle =
              '#ffffff';

            context.fillRect(
              0,
              0,
              this.IMAGE_WIDTH,
              this.IMAGE_HEIGHT
            );

            // ------------------------------------------------
            // DIMENSIONS SOURCE
            // ------------------------------------------------

            const sourceWidth =
              img.naturalWidth;

            const sourceHeight =
              img.naturalHeight;

            if (
              !sourceWidth ||
              !sourceHeight
            ) {

              URL.revokeObjectURL(
                imageUrl
              );

              reject(
                new Error(
                  'Dimensions invalides'
                )
              );

              return;
            }

            // ------------------------------------------------
            // RATIOS
            // ------------------------------------------------

            const sourceRatio =
              sourceWidth /
              sourceHeight;

            const targetRatio =
              this.IMAGE_WIDTH /
              this.IMAGE_HEIGHT;

            // ------------------------------------------------
            // DIMENSIONS DE DESSIN
            // ------------------------------------------------

            let drawWidth =
              this.IMAGE_WIDTH;

            let drawHeight =
              this.IMAGE_HEIGHT;

            let offsetX = 0;
            let offsetY = 0;

            // ------------------------------------------------
            // PAYSAGE
            // ------------------------------------------------

            if (
              sourceRatio > targetRatio
            ) {

              drawHeight =
                this.IMAGE_HEIGHT;

              drawWidth =
                Math.round(
                  drawHeight *
                  sourceRatio
                );

              offsetX =
                Math.round(
                  (
                    this.IMAGE_WIDTH -
                    drawWidth
                  ) / 2
                );
            }

            // ------------------------------------------------
            // PORTRAIT
            // ------------------------------------------------

            else if (
              sourceRatio < targetRatio
            ) {

              drawWidth =
                this.IMAGE_WIDTH;

              drawHeight =
                Math.round(
                  drawWidth /
                  sourceRatio
                );

              offsetY =
                Math.round(
                  (
                    this.IMAGE_HEIGHT -
                    drawHeight
                  ) / 2
                );
            }

            // ------------------------------------------------
            // QUALITÉ
            // ------------------------------------------------

            context.imageSmoothingEnabled =
              true;

            context.imageSmoothingQuality =
              'high';

            // ------------------------------------------------
            // DESSIN
            // ------------------------------------------------

            context.drawImage(
              img,
              offsetX,
              offsetY,
              drawWidth,
              drawHeight
            );

            // ------------------------------------------------
            // JPEG
            // ------------------------------------------------

            canvas.toBlob(
              (blob) => {

                URL.revokeObjectURL(
                  imageUrl
                );

                if (!blob) {

                  reject(
                    new Error(
                      'Impossible de créer le Blob JPEG'
                    )
                  );

                  return;
                }

                resolve(blob);
              },
              'image/jpeg',
              this.IMAGE_QUALITY
            );

          } catch (error) {

            URL.revokeObjectURL(
              imageUrl
            );

            reject(error);
          }
        };

        img.onerror = () => {

          URL.revokeObjectURL(
            imageUrl
          );

          reject(
            new Error(
              'Impossible de charger l’image'
            )
          );
        };

        img.src =
          imageUrl;
      }
    );
  }

  // ==========================================================
  // 🤖 IDENTIFICATION
  //
  // POST /api/plant/identify
  //
  // ==========================================================

  identifyPlant(
    image: Blob
  ): Observable<PlantIdentificationResponse> {

    if (!image) {
      throw new Error(
        'Image manquante pour identification'
      );
    }

    const identifyUrl =
      `${this.apiUrl}/identify`;

    const formData =
      new FormData();

    formData.append(
      'image',
      image,
      'plant-scan-800x800.jpg'
    );

    return this.http.post<
      PlantIdentificationResponse
    >(
      identifyUrl,
      formData
    );
  }

  // ==========================================================
  // 🤖 IDENTIFICATION + REDIMENSIONNEMENT
  // ==========================================================

  identifyPlantResized(
    image: Blob
  ): Observable<PlantIdentificationResponse> {

    if (!image) {
      throw new Error(
        'Image manquante pour identification'
      );
    }

    return from(
      this.resizeImageTo800x800(
        image
      )
    ).pipe(
      switchMap(
        (resizedImage) =>
          this.identifyPlant(
            resizedImage
          )
      )
    );
  }
}