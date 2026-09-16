// ============================================================
// 🌱 PLANT SERVICE — JARDISCAN
//
// VERSION ROBUSTE — COMPATIBLE AVEC LES DEUX FORMATS MONGODB
//
// FORMAT 1 :
// images: [
//   "/uploads/plants/image.png"
// ]
//
// FORMAT 2 :
// images: [
//   {
//     url: "/uploads/plants/image.png",
//     vue: "front",
//     _id: "..."
//   }
// ]
//
// ============================================================

import { Injectable } from '@angular/core';

import {
  HttpClient,
  HttpParams
} from '@angular/common/http';

import {
  Observable,
  from
} from 'rxjs';

import {
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
  // 🌿 IDENTITÉ
  // ----------------------------------------------------------

  nomCommun: string;

  nomScientifique: string;

  famille?: string;

  genre?: string;

  espece?: string;

  categorie: string;

  sousCategorie?: string;

  // ----------------------------------------------------------
  // 📝 DESCRIPTION
  // ----------------------------------------------------------

  description?: string;

  // ----------------------------------------------------------
  // 📸 IMAGES
  //
  // Compatible :
  //
  // string[]
  //
  // ET
  //
  // PlantImage[]
  // ----------------------------------------------------------

  imageUrl?: string;

  images?: Array<
    string | PlantImage
  >;

  // ----------------------------------------------------------
  // 🌍 ORIGINE / HABITAT
  // ----------------------------------------------------------

  origine?: string;

  habitat?: string;

  // ----------------------------------------------------------
  // 🌱 ENTRETIEN
  // ----------------------------------------------------------

  exposition?: string;

  arrosage?: string;

  sol?: string;

  humidite?: string;

  engrais?: string;

  taille?: string;

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
  // 🌸 ÉLÉMENTS
  // ----------------------------------------------------------

  fruits?: string[];

  fleurs?: string[];

  conseils?: string[];

  // ----------------------------------------------------------
  // 📅 DATES
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

  plant?: Plant;

  plants?: Plant[];

  data?: Plant | Plant[];

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
// 🌱 SERVICE PLANT
// ============================================================

@Injectable({
  providedIn: 'root'
})
export class PlantService {

  // ==========================================================
  // ⚙️ CONFIGURATION
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
  // 💉 CONSTRUCTOR
  // ==========================================================

  constructor(
    private readonly http: HttpClient
  ) {}


  // ==========================================================
  // 🌿 GET — TOUTES LES PLANTES
  // ==========================================================

  getPlants():
    Observable<Plant[] | PlantApiResponse> {

    

    return this.http.get<
      Plant[] | PlantApiResponse
    >(this.apiUrl);
  }


  // ==========================================================
  // 🌱 GET — UNE PLANTE
  // ==========================================================

  getPlantById(
    id: string
  ): Observable<Plant> {

    if (!id?.trim()) {

      console.error(
        '❌ [GET PLANT] ID manquant'
      );

      throw new Error(
        'ID de plante manquant'
      );
    }

    const cleanId =
      id.trim();

    const url =
      `${this.apiUrl}/${encodeURIComponent(cleanId)}`;

    

    return this.http.get<Plant>(url);
  }


  // ==========================================================
  // 🔎 RECHERCHE
  // ==========================================================

  searchPlants(
    search: string
  ): Observable<Plant[]> {

    const value =
      search?.trim() || '';

    const params =
      new HttpParams()
        .set(
          'search',
          value
        );

    const url =
      `${this.apiUrl}/search`;

    

    return this.http.get<Plant[]>(
      url,
      {
        params
      }
    );
  }


  // ==========================================================
  // 🏷️ PLANTES PAR CATÉGORIE
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

    

    return this.http.get<Plant[]>(url);
  }


  // ==========================================================
  // 🌳 PLANTES PAR FAMILLE
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

    

    return this.http.get<Plant[]>(url);
  }


  // ==========================================================
  // 🖼️ EXTRAIRE LE CHEMIN D'UNE IMAGE
  //
  // Accepte :
  //
  // "/uploads/plants/image.png"
  //
  // OU
  //
  // {
  //   url: "/uploads/plants/image.png",
  //   vue: "front"
  // }
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


    // --------------------------------------------------------
    // INVALIDE
    // --------------------------------------------------------

    console.warn(
      '⚠️ [IMAGE] Format image inconnu :',
      image
    );

    return '';
  }


  // ==========================================================
  // 🖼️ CONSTRUIRE URL IMAGE
  //
  // ⚠️ JAMAIS DE PLACEHOLDER
  // ==========================================================

  getImageUrl(
    imagePath?: string
  ): string {

    // --------------------------------------------------------
    // IMAGE ABSENTE
    // --------------------------------------------------------

    if (
      imagePath === undefined ||
      imagePath === null
    ) {

      console.warn(
        '⚠️ [IMAGE] Aucun chemin'
      );

      return '';
    }


    let cleanPath =
      String(imagePath).trim();


    if (!cleanPath) {

      return '';
    }




    // ========================================================
    // 🚫 PLACEHOLDER INTERDIT
    // ========================================================

    if (
      cleanPath
        .toLowerCase()
        .includes('placeholder')
    ) {

      console.warn(
        '🚫 [IMAGE] PLACEHOLDER REFUSÉ :',
        cleanPath
      );

      return '';
    }


    // ========================================================
    // 🚫 ASSETS INTERDITS
    // ========================================================

    if (
      cleanPath
        .replace(/^\/+/, '')
        .toLowerCase()
        .startsWith('assets/')
    ) {

      console.warn(
        '🚫 [IMAGE] ASSET LOCAL REFUSÉ :',
        cleanPath
      );

      return '';
    }


    // ========================================================
    // 🌐 URL ABSOLUE
    // ========================================================

    if (
      cleanPath.startsWith('http://') ||
      cleanPath.startsWith('https://')
    ) {

      

      return cleanPath;
    }


    // ========================================================
    // 💾 DATA URL
    // ========================================================

    if (
      cleanPath.startsWith('data:')
    ) {

      return cleanPath;
    }


    // ========================================================
    // 🧹 SUPPRESSION SLASH
    // ========================================================

    cleanPath =
      cleanPath.replace(/^\/+/, '');


    // ========================================================
    // 📂 /uploads/...
    // ========================================================

    if (
      cleanPath.startsWith('uploads/')
    ) {

      const url =
        `${this.serverUrl}/${cleanPath}`;

     

      return url;
    }


    // ========================================================
    // 🌱 plants/...
    // ========================================================

    if (
      cleanPath.startsWith('plants/')
    ) {

      const url =
        `${this.serverUrl}/uploads/${cleanPath}`;

      

      return url;
    }


    // ========================================================
    // 📸 NOM DE FICHIER
    // ========================================================

    const filename =
      cleanPath
        .split('/')
        .pop() || '';


    if (!filename) {

      return '';
    }


    const url =
      `${this.plantsUploadPath}/${encodeURIComponent(
        filename
      )}`;

    

    return url;
  }


  // ==========================================================
  // 📸 RÉCUPÉRER IMAGE PRINCIPALE
  // ==========================================================

  getMainImage(
    plant: Plant
  ): string {

    if (!plant) {

      console.warn(
        '⚠️ [MAIN IMAGE] Plante absente'
      );

      return '';
    }

    


    // --------------------------------------------------------
    // 1️⃣ IMAGE URL
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
    // 2️⃣ PREMIÈRE IMAGE DU TABLEAU
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
    // 🚫 RIEN
    // --------------------------------------------------------

    console.warn(
      '🚫 Aucune image principale'
    );

    return '';
  }


  // ==========================================================
  // 📸 TOUTES LES IMAGES
  //
  // Compatible STRING + OBJECT
  // ==========================================================

  getPlantImages(
    plant: Plant
  ): string[] {

    if (!plant) {

      return [];
    }

    

    const result: string[] = [];


    // ========================================================
    // 📸 images[]
    // ========================================================

    if (
      Array.isArray(plant.images)
    ) {

      


      for (
        let index = 0;
        index < plant.images.length;
        index++
      ) {

        const rawImage =
          plant.images[index];


       


        // ----------------------------------------------------
        // EXTRACTION
        // ----------------------------------------------------

        const path =
          this.extractImagePath(
            rawImage
          );


        if (!path) {

          console.warn(
            `⚠️ Image [${index}] ignorée : chemin introuvable`
          );

          continue;
        }


        // ----------------------------------------------------
        // URL
        // ----------------------------------------------------

        const image =
          this.getImageUrl(path);


        if (!image) {

          console.warn(
            `🚫 Image [${index}] refusée :`,
            path
          );

          continue;
        }


        // ----------------------------------------------------
        // DOUBLON
        // ----------------------------------------------------

        if (
          result.includes(image)
        ) {

          console.warn(
            `⚠️ Image [${index}] doublon :`,
            image
          );

          continue;
        }


        result.push(image);


        
      }
    }


    // ========================================================
    // 📸 imageUrl
    //
    // Seulement si images[] n'a rien donné.
    // ========================================================

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
  // 🌱 NOM AFFICHAGE
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
  // 📐 REDIMENSIONNEMENT 800x800
  // ==========================================================

  resizeImageTo800x800(
    image: Blob
  ): Promise<Blob> {

    return new Promise(
      (resolve, reject) => {

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
              document.createElement('canvas');


            canvas.width =
              this.IMAGE_WIDTH;

            canvas.height =
              this.IMAGE_HEIGHT;


            const context =
              canvas.getContext('2d');


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


            const sourceRatio =
              sourceWidth /
              sourceHeight;


            const targetRatio =
              this.IMAGE_WIDTH /
              this.IMAGE_HEIGHT;


            let drawWidth =
              this.IMAGE_WIDTH;

            let drawHeight =
              this.IMAGE_HEIGHT;

            let offsetX =
              0;

            let offsetY =
              0;


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


            context.imageSmoothingEnabled =
              true;

            context.imageSmoothingQuality =
              'high';


            context.drawImage(
              img,
              offsetX,
              offsetY,
              drawWidth,
              drawHeight
            );


            canvas.toBlob(
              blob => {

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

          console.error(
            '❌ Impossible de charger l’image'
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


    console.log('');
    
    

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
  // 🤖 IDENTIFICATION + RESIZE
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
      this.resizeImageTo800x800(image)
    ).pipe(

      switchMap(
        resizedImage => {

          

         


          return this.identifyPlant(
            resizedImage
          );
        }
      )
    );
  }
}