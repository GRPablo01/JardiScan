import { Injectable } from '@angular/core';

import {
    HttpClient,
    HttpHeaders
} from '@angular/common/http';

import {
    Observable
} from 'rxjs';


/* ============================================================
   🔔 INTERFACE RAPPEL
   ============================================================ */

export interface Rappel {

    _id: string;

    utilisateur: string;
     // 👇 AJOUTE CETTE LIGNE
  reouvertureVisible?: boolean;


    // ============================================================
    // 👤 INFORMATIONS UTILISATEUR
    // ============================================================

    prenom?: string;

    nom?: string;


    // ============================================================
    // 🌱 PLANTE
    // ============================================================

    plante?: {

        _id: string;

        nom?: string;

        espece?: string;

        image?: string;

        images?: any[];

    } | null;


    // ============================================================
    // 📝 RAPPEL
    // ============================================================

    titre: string;

    description?: string;


    // ============================================================
    // 🏷️ TYPE
    // ============================================================

    type:
        | 'arrosage'
        | 'exposition'
        | 'engrais'
        | 'rempotage'
        | 'taille'
        | 'traitement'
        | 'observation'
        | 'autre';


    // ============================================================
    // 📅 DATE
    // ============================================================

    date: string;


    // ============================================================
    // 🔁 FRÉQUENCE
    // ============================================================

    frequence:
        | 'unique'
        | 'quotidien'
        | 'hebdomadaire'
        | 'mensuel';


    // ============================================================
    // ✅ STATUT
    // ============================================================

    termine: boolean;

    actif: boolean;


    // ============================================================
    // 🕐 DATES MONGOOSE
    // ============================================================

    createdAt?: string;

    updatedAt?: string;

}



/* ============================================================
   ➕ INTERFACE CRÉATION RAPPEL
   ============================================================ */

/*

   ⚠️ Le prénom et le nom ne sont volontairement pas présents.

   Le backend récupère automatiquement :

   - prenom
   - nom

   depuis l'utilisateur connecté grâce au header x-user.

*/

export interface CreerRappel {

    plante?: string | null;

    titre: string;

    description?: string;

    type?:
        | 'arrosage'
        | 'exposition'
        | 'engrais'
        | 'rempotage'
        | 'taille'
        | 'traitement'
        | 'observation'
        | 'autre';

    date: string;

    frequence?:
        | 'unique'
        | 'quotidien'
        | 'hebdomadaire'
        | 'mensuel';

}



/* ============================================================
   ✏️ INTERFACE MODIFICATION
   ============================================================ */

export type ModifierRappel =
    Partial<CreerRappel>;



/* ============================================================
   🔔 SERVICE RAPPEL
   ============================================================ */

@Injectable({
    providedIn: 'root'
})

export class RappelService {


    // ============================================================
    // 🌐 API
    // ============================================================

    private readonly apiUrl =
        'http://localhost:3000/api/rappels';


    // ============================================================
    // 🚀 CONSTRUCTEUR
    // ============================================================

    constructor(
        private http: HttpClient
    ) {}


    /* ============================================================
       👤 UTILISATEUR CONNECTÉ
       ============================================================ */

    private getUtilisateur(): any {

        const utilisateur =
            localStorage.getItem(
                'utilisateur'
            );


        // ==========================================================
        // ❌ AUCUN UTILISATEUR
        // ==========================================================

        if (!utilisateur) {

            console.warn(
                'Aucun utilisateur trouvé dans le localStorage.'
            );

            return null;

        }


        // ==========================================================
        // 🔄 LECTURE UTILISATEUR
        // ==========================================================

        try {

            return JSON.parse(
                utilisateur
            );

        } catch (error) {

            console.error(
                'Impossible de lire utilisateur :',
                error
            );

            return null;

        }

    }

    



    /* ============================================================
       🔐 HEADERS
       ============================================================ */

    private getHeaders(): HttpHeaders {

        const utilisateur =
            this.getUtilisateur();


        const utilisateurId =
            utilisateur?._id ||
            utilisateur?.id;


        let headers =
            new HttpHeaders({

                'Content-Type':
                    'application/json'

            });


        // ==========================================================
        // 🔐 AJOUT DE L'UTILISATEUR
        // ==========================================================

        if (utilisateurId) {

            headers =
                headers.set(
                    'x-user',
                    utilisateurId
                );

        } else {

            console.warn(
                'Impossible d’ajouter x-user : ID utilisateur introuvable.'
            );

        }


        return headers;

    }



    /* ============================================================
       📋 TOUS LES RAPPELS
       ============================================================ */

    getRappels(): Observable<Rappel[]> {

        return this.http.get<Rappel[]>(
            this.apiUrl,
            {
                headers:
                    this.getHeaders()
            }
        );

    }



    /* ============================================================
       📅 RAPPELS DU JOUR
       ============================================================ */

    getRappelsDuJour(): Observable<Rappel[]> {

        return this.http.get<Rappel[]>(
            `${this.apiUrl}/today`,
            {
                headers:
                    this.getHeaders()
            }
        );

    }



    /* ============================================================
       🔎 RÉCUPÉRER UN RAPPEL
       ============================================================ */

    getRappel(
        id: string
    ): Observable<Rappel> {

        return this.http.get<Rappel>(
            `${this.apiUrl}/${id}`,
            {
                headers:
                    this.getHeaders()
            }
        );

    }



    /* ============================================================
       ➕ CRÉER UN RAPPEL
       ============================================================ */

    createRappel(
        rappel: CreerRappel
    ): Observable<any> {

        return this.http.post(
            this.apiUrl,
            rappel,
            {
                headers:
                    this.getHeaders()
            }
        );

    }



    /* ============================================================
       ✏️ MODIFIER UN RAPPEL
       ============================================================ */

    updateRappel(
        id: string,
        rappel: ModifierRappel
    ): Observable<any> {

        return this.http.put(
            `${this.apiUrl}/${id}`,
            rappel,
            {
                headers:
                    this.getHeaders()
            }
        );

    }



    /* ============================================================
       ✅ TERMINER UN RAPPEL
       ============================================================ */

    terminerRappel(
        id: string
    ): Observable<any> {

        if (!id) {

            throw new Error(
                'Impossible de terminer le rappel : ID manquant.'
            );

        }


        return this.http.patch(
            `${this.apiUrl}/${id}/terminer`,
            {},
            {
                headers:
                    this.getHeaders()
            }
        );

    }



    /* ============================================================
       ↩️ ANNULER LA TERMINAISON
       ============================================================ */

    annulerTerminaisonRappel(
        id: string
    ): Observable<any> {

        if (!id) {

            throw new Error(
                'Impossible de rouvrir le rappel : ID manquant.'
            );

        }


        return this.http.patch(
            `${this.apiUrl}/${id}/annuler`,
            {},
            {
                headers:
                    this.getHeaders()
            }
        );

    }



    /* ============================================================
       🔄 TOGGLE RAPPEL
       ============================================================ */

    /*
       Cette méthode est conservée pour éviter de casser
       d'autres pages de JardiScan qui utiliseraient encore
       toggleRappel().

       Elle n'est PAS utilisée par la nouvelle logique
       terminerRappel() / annulerTerminaisonRappel().
    */

    toggleRappel(
        id: string
    ): Observable<any> {

        if (!id) {

            throw new Error(
                'Impossible de modifier le rappel : ID manquant.'
            );

        }


        return this.http.patch(
            `${this.apiUrl}/${id}/toggle`,
            {},
            {
                headers:
                    this.getHeaders()
            }
        );

    }



    /* ============================================================
       🗑️ SUPPRIMER UN RAPPEL
       ============================================================ */

    deleteRappel(
        id: string
    ): Observable<any> {

        if (!id) {

            throw new Error(
                'Impossible de supprimer le rappel : ID manquant.'
            );

        }


        return this.http.delete(
            `${this.apiUrl}/${id}`,
            {
                headers:
                    this.getHeaders()
            }
        );

    }

}
