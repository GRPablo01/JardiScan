import { CommonModule } from '@angular/common';

import {
  Component,
  OnDestroy,
  OnInit
} from '@angular/core';

import { FormsModule } from '@angular/forms';

import { RouterLink } from '@angular/router';

import {
  Subject,
  takeUntil
} from 'rxjs';

import { ThemeService } from '../../../../../Backend/Services/theme.service';

import {
  Plant,
  PlantService
} from '../../../../../Backend/Services/plant.service';

import { UserService } from '../../../../../Backend/Services/user.service';


// ============================================================
// 🏷️ CATÉGORIE DE RECHERCHE
// ============================================================

interface CategorieRecherche {
  nom: string;
  description: string;
  icon: string;
  nombre: number;
}


// ============================================================
// 🌿 ENTRÉE JARDIDEX
// ============================================================

interface JardiDexEntry {
  plante: string;
  numero: number | null;
}


// ============================================================
// 👤 UTILISATEUR
// ============================================================

interface Utilisateur {
  _id?: string;
  id?: string;
  key?: string;

  pseudo?: string;

  nom?: string;
  prenom?: string;

  email?: string;

  role?: string;

  jardiDex?: any[];

  [key: string]: any;
}


// ============================================================
// 🔎 COMPOSANT SEARCH
// ============================================================

@Component({
  selector: 'app-search',

  standalone: true,

  imports: [
    CommonModule,
    FormsModule,
    RouterLink
  ],

  templateUrl: './search.html',

  styleUrl: './search.css'
})
export class Search implements OnInit, OnDestroy {

  // ============================================================
  // 🔎 RECHERCHE
  // ============================================================

  recherche = '';


  // ============================================================
  // 🌱 DONNÉES PLANTES
  // ============================================================

  plantes: Plant[] = [];

  categories: CategorieRecherche[] = [];


  // ============================================================
  // 👥 UTILISATEURS
  // ============================================================

  utilisateurs: Utilisateur[] = [];

  utilisateurConnecte: Utilisateur | null = null;


  // ============================================================
  // 🌿 JARDIDEX UTILISATEUR
  // ============================================================

  jardiDex: any[] = [];

  jardiDexIds: string[] = [];

  jardiDexNumeros: Record<string, number | null> = {};


  // ============================================================
  // ⚙️ ÉTAT
  // ============================================================

  chargement = true;

  erreur = false;

  messageErreur = '';

  chargementJardiDex = false;

  actionJardiDex = false;


  // ============================================================
  // 🧹 DESTROY
  // ============================================================

  private readonly destroy$ = new Subject<void>();


  // ============================================================
  // 💉 CONSTRUCTEUR
  // ============================================================

  constructor(
    public themeService: ThemeService,
    public plantService: PlantService,
    public userService: UserService
  ) {}


  // ============================================================
  // 🚀 INIT
  // ============================================================

  ngOnInit(): void {

    this.chargerUtilisateurEtJardiDex();

    this.chargerPlantes();

  }


  // ============================================================
  // 👤 RÉCUPÉRER UTILISATEUR LOCAL
  // ============================================================

  private recupererUtilisateurLocal(): Utilisateur | null {

    try {

      const utilisateurStocke =
        localStorage.getItem('utilisateur');

      if (utilisateurStocke) {

        const utilisateur =
          JSON.parse(utilisateurStocke);

        if (utilisateur) {
          return utilisateur;
        }
      }


      const userStocke =
        localStorage.getItem('user');

      if (userStocke) {

        const user =
          JSON.parse(userStocke);

        if (user) {
          return user;
        }
      }


      return null;

    } catch {

      return null;
    }
  }


  // ============================================================
  // 🔑 RÉCUPÉRER IDENTIFIANT UTILISATEUR
  // ============================================================

  private getUtilisateurIdentifiant(
    utilisateur: Utilisateur
  ): string {

    return String(
      utilisateur?._id ??
      utilisateur?.id ??
      utilisateur?.key ??
      ''
    );
  }


  // ============================================================
  // 🔑 RÉCUPÉRER EMAIL UTILISATEUR
  // ============================================================

  private getUtilisateurEmail(
    utilisateur: Utilisateur
  ): string {

    return String(
      utilisateur?.email ??
      ''
    )
      .trim()
      .toLowerCase();
  }


  // ============================================================
  // 🔎 TROUVER UTILISATEUR CONNECTÉ
  // ============================================================

  private trouverUtilisateurConnecte(
    utilisateurs: Utilisateur[]
  ): Utilisateur | null {

    const utilisateurLocal =
      this.recupererUtilisateurLocal();

    if (!utilisateurLocal) {
      return null;
    }


    const idLocal =
      this.getUtilisateurIdentifiant(
        utilisateurLocal
      );


    const emailLocal =
      this.getUtilisateurEmail(
        utilisateurLocal
      );


    // ----------------------------------------------------------
    // Recherche par ID / KEY
    // ----------------------------------------------------------

    if (idLocal) {

      const utilisateurParId =
        utilisateurs.find(
          utilisateur => {

            const id =
              this.getUtilisateurIdentifiant(
                utilisateur
              );

            return id === idLocal;
          }
        );

      if (utilisateurParId) {
        return utilisateurParId;
      }
    }


    // ----------------------------------------------------------
    // Recherche par email
    // ----------------------------------------------------------

    if (emailLocal) {

      const utilisateurParEmail =
        utilisateurs.find(
          utilisateur =>
            this.getUtilisateurEmail(
              utilisateur
            ) === emailLocal
        );

      if (utilisateurParEmail) {
        return utilisateurParEmail;
      }
    }


    return null;
  }


  // ============================================================
  // 👥 CHARGER TOUS LES UTILISATEURS
  // ============================================================

  private chargerUtilisateurs(): void {

    this.userService
      .getAllUsers()
      .pipe(
        takeUntil(this.destroy$)
      )
      .subscribe({

        next: (response: any) => {

          let utilisateurs: Utilisateur[] = [];


          // ----------------------------------------------------
          // API retournant directement un tableau
          // ----------------------------------------------------

          if (Array.isArray(response)) {

            utilisateurs = response;
          }


          // ----------------------------------------------------
          // API retournant { utilisateurs: [] }
          // ----------------------------------------------------

          else if (
            Array.isArray(response?.utilisateurs)
          ) {

            utilisateurs =
              response.utilisateurs;
          }


          // ----------------------------------------------------
          // API retournant { users: [] }
          // ----------------------------------------------------

          else if (
            Array.isArray(response?.users)
          ) {

            utilisateurs =
              response.users;
          }


          this.utilisateurs =
            utilisateurs;


          // ----------------------------------------------------
          // Trouver le user connecté
          // ----------------------------------------------------

          const utilisateur =
            this.trouverUtilisateurConnecte(
              utilisateurs
            );


          if (!utilisateur) {

            this.utilisateurConnecte = null;

            this.jardiDex = [];

            this.jardiDexIds = [];

            this.jardiDexNumeros = {};

            return;
          }


          // ----------------------------------------------------
          // Sauvegarder le user trouvé
          // ----------------------------------------------------

          this.utilisateurConnecte =
            utilisateur;


          // ----------------------------------------------------
          // Charger son JardiDex MongoDB
          // ----------------------------------------------------

          this.normaliserJardiDex(
            utilisateur.jardiDex
          );


          // ----------------------------------------------------
          // Synchroniser localStorage
          // ----------------------------------------------------

          this.synchroniserUtilisateurLocal(
            utilisateur
          );
        },

        error: () => {

          this.utilisateurs = [];

          this.utilisateurConnecte = null;

          this.jardiDex = [];

          this.jardiDexIds = [];

          this.jardiDexNumeros = {};

        }
      });
  }


  // ============================================================
  // 🌿 CHARGER UTILISATEUR + JARDIDEX
  // ============================================================

  private chargerUtilisateurEtJardiDex(): void {

    this.chargementJardiDex = true;

    this.chargerUtilisateurs();

    this.chargementJardiDex = false;
  }


  // ============================================================
  // 🌿 NORMALISER LE JARDIDEX
  // ============================================================

  private normaliserJardiDex(
    jardiDexSource: any
  ): void {

    this.jardiDex =
      Array.isArray(jardiDexSource)
        ? jardiDexSource
        : [];


    this.jardiDexIds = [];

    this.jardiDexNumeros = {};


    // ----------------------------------------------------------
    // Parcourir les entrées
    // ----------------------------------------------------------

    for (
      const entree of this.jardiDex
    ) {

      let id = '';

      let numero: number | null = null;


      // --------------------------------------------------------
      // Ancien format :
      // "665abc..."
      // --------------------------------------------------------

      if (
        typeof entree === 'string'
      ) {

        id = entree;
      }


      // --------------------------------------------------------
      // Format objet
      // --------------------------------------------------------

      else if (
        entree &&
        typeof entree === 'object'
      ) {

        id = String(
          entree?.plante ??
          entree?._id ??
          entree?.id ??
          entree?.key ??
          ''
        );


        if (
          entree.numero !== undefined &&
          entree.numero !== null &&
          !Number.isNaN(
            Number(entree.numero)
          )
        ) {

          numero =
            Number(entree.numero);
        }
      }


      // --------------------------------------------------------
      // ID invalide
      // --------------------------------------------------------

      if (!id) {
        continue;
      }


      id = String(id);


      // --------------------------------------------------------
      // Éviter les doublons
      // --------------------------------------------------------

      if (
        !this.jardiDexIds.includes(id)
      ) {

        this.jardiDexIds.push(id);
      }


      // --------------------------------------------------------
      // Numéro
      // --------------------------------------------------------

      this.jardiDexNumeros[id] =
        numero;
    }
  }


  // ============================================================
  // 💾 SYNCHRONISER LOCALSTORAGE
  // ============================================================

  private synchroniserUtilisateurLocal(
    utilisateur: Utilisateur
  ): void {

    try {

      const utilisateurLocal =
        this.recupererUtilisateurLocal();


      if (!utilisateurLocal) {
        return;
      }


      const utilisateurSynchronise = {
        ...utilisateurLocal,
        ...utilisateur,
        jardiDex:
          Array.isArray(utilisateur.jardiDex)
            ? utilisateur.jardiDex
            : []
      };


      localStorage.setItem(
        'utilisateur',
        JSON.stringify(
          utilisateurSynchronise
        )
      );


      localStorage.setItem(
        'user',
        JSON.stringify(
          utilisateurSynchronise
        )
      );

    } catch {
      // Ne pas bloquer la page.
    }
  }


  // ============================================================
  // 🌿 NOMBRE DE PLANTES JARDIDEX
  // ============================================================

  get nombrePlantesJardiDex(): number {

    return this.jardiDexIds.length;
  }


  // ============================================================
  // 🌿 RÉCUPÉRER ID PLANTE
  // ============================================================

  private getPlantId(
    plante: Plant
  ): string {

    const planteAny =
      plante as any;


    return String(
      planteAny?._id ??
      planteAny?.id ??
      planteAny?.key ??
      ''
    );
  }


  // ============================================================
  // 🔢 RÉCUPÉRER NUMÉRO PLANTE
  // ============================================================

  getNumero(
    plante: Plant
  ): number | null {

    return this.plantService.getPlantNumber(
      plante
    );
  }


  // ============================================================
  // 🌿 PLANTE DANS JARDIDEX
  // ============================================================

  estDansJardiDex(
    plante: Plant
  ): boolean {

    const id =
      this.getPlantId(plante);


    if (!id) {
      return false;
    }


    return this.jardiDexIds.includes(id);
  }


  // ============================================================
  // 🔢 NUMÉRO JARDIDEX
  // ============================================================

  getNumeroJardiDex(
    plante: Plant
  ): number | null {

    const id =
      this.getPlantId(plante);


    if (!id) {
      return null;
    }


    return this.jardiDexNumeros[id] ?? null;
  }


  // ============================================================
  // 🌿 AJOUTER PLANTE AU JARDIDEX
  // ============================================================

  ajouterAuJardiDex(
    plante: Plant
  ): void {

    if (this.actionJardiDex) {
      return;
    }


    const utilisateurLocal =
      this.recupererUtilisateurLocal();


    if (!utilisateurLocal) {
      return;
    }


    const utilisateur =
      this.utilisateurConnecte;


    if (!utilisateur) {

      this.chargerUtilisateurs();

      return;
    }


    const id =
      this.getPlantId(plante);


    if (!id) {
      return;
    }


    // ----------------------------------------------------------
    // Vérifier si déjà présente
    // ----------------------------------------------------------

    const dejaPresente =
      this.jardiDexIds.includes(id);


    if (dejaPresente) {
      return;
    }


    // ----------------------------------------------------------
    // Récupérer numéro
    // ----------------------------------------------------------

    const numero =
      this.getNumero(plante);


    // ----------------------------------------------------------
    // Récupérer JardiDex MongoDB
    // ----------------------------------------------------------

    const jardiDexActuel =
      Array.isArray(
        utilisateur.jardiDex
      )
        ? [
            ...utilisateur.jardiDex
          ]
        : [];


    // ----------------------------------------------------------
    // Vérification supplémentaire contre MongoDB
    // ----------------------------------------------------------

    const existeDansBase =
      jardiDexActuel.some(
        (entree: any) => {

          if (
            typeof entree === 'string'
          ) {

            return String(entree) === id;
          }


          if (
            entree &&
            typeof entree === 'object'
          ) {

            const entreeId =
              entree?.plante ??
              entree?._id ??
              entree?.id ??
              entree?.key ??
              '';

            return String(entreeId) === id;
          }


          return false;
        }
      );


    if (existeDansBase) {

      this.normaliserJardiDex(
        jardiDexActuel
      );

      return;
    }


    // ----------------------------------------------------------
    // Nouvelle entrée
    // ----------------------------------------------------------

    const nouvelleEntree:
      JardiDexEntry = {

      plante: id,

      numero: numero
    };


    jardiDexActuel.push(
      nouvelleEntree
    );


    // ----------------------------------------------------------
    // Identifier le user pour le PUT
    // ----------------------------------------------------------

    const idUtilisateur =
      this.getUtilisateurIdentifiant(
        utilisateur
      );


    if (!idUtilisateur) {
      return;
    }


    // ----------------------------------------------------------
    // Activer état
    // ----------------------------------------------------------

    this.actionJardiDex = true;


    // ----------------------------------------------------------
    // UPDATE MONGODB
    // ----------------------------------------------------------

    this.userService
      .updateUser(
        idUtilisateur,
        {
          jardiDex: jardiDexActuel
        }
      )
      .pipe(
        takeUntil(this.destroy$)
      )
      .subscribe({

        // ======================================================
        // SUCCESS
        // ======================================================

        next: (response: any) => {

          let utilisateurMisAJour:
            Utilisateur;


          // ----------------------------------------------------
          // API retournant directement le user
          // ----------------------------------------------------

          if (
            response &&
            typeof response === 'object' &&
            (
              response._id ||
              response.id ||
              response.key ||
              response.email
            )
          ) {

            utilisateurMisAJour =
              response;
          }


          // ----------------------------------------------------
          // API retournant { utilisateur }
          // ----------------------------------------------------

          else if (
            response?.utilisateur
          ) {

            utilisateurMisAJour =
              response.utilisateur;
          }


          // ----------------------------------------------------
          // Si l'API ne retourne pas le user,
          // on conserve celui que nous avions
          // ----------------------------------------------------

          else {

            utilisateurMisAJour = {
              ...utilisateur,
              jardiDex: jardiDexActuel
            };
          }


          // ----------------------------------------------------
          // Garantir le JardiDex
          // ----------------------------------------------------

          utilisateurMisAJour.jardiDex =
            Array.isArray(
              utilisateurMisAJour.jardiDex
            )
              ? utilisateurMisAJour.jardiDex
              : jardiDexActuel;


          // ----------------------------------------------------
          // Mettre à jour l'utilisateur courant
          // ----------------------------------------------------

          this.utilisateurConnecte =
            utilisateurMisAJour;


          // ----------------------------------------------------
          // Mettre à jour les données locales
          // ----------------------------------------------------

          this.normaliserJardiDex(
            utilisateurMisAJour.jardiDex
          );


          // ----------------------------------------------------
          // Synchroniser localStorage
          // ----------------------------------------------------

          this.synchroniserUtilisateurLocal(
            utilisateurMisAJour
          );


          // ----------------------------------------------------
          // Fin action
          // ----------------------------------------------------

          this.actionJardiDex = false;
        },


        // ======================================================
        // ERROR
        // ======================================================

        error: () => {

          this.actionJardiDex = false;
        }
      });
  }


  // ============================================================
  // 🌿 RETIRER PLANTE DU JARDIDEX
  // ============================================================

  retirerDuJardiDex(
    plante: Plant
  ): void {

    if (this.actionJardiDex) {
      return;
    }


    const utilisateur =
      this.utilisateurConnecte;


    if (!utilisateur) {
      return;
    }


    const id =
      this.getPlantId(plante);


    if (!id) {
      return;
    }


    if (
      !Array.isArray(
        utilisateur.jardiDex
      )
    ) {

      return;
    }


    // ----------------------------------------------------------
    // Retirer la plante
    // ----------------------------------------------------------

    const nouveauJardiDex =
      utilisateur.jardiDex.filter(
        (entree: any) => {

          if (
            typeof entree === 'string'
          ) {

            return String(entree) !== id;
          }


          if (
            entree &&
            typeof entree === 'object'
          ) {

            const entreeId =
              entree?.plante ??
              entree?._id ??
              entree?.id ??
              entree?.key ??
              '';

            return String(entreeId) !== id;
          }


          return true;
        }
      );


    // ----------------------------------------------------------
    // ID utilisateur
    // ----------------------------------------------------------

    const idUtilisateur =
      this.getUtilisateurIdentifiant(
        utilisateur
      );


    if (!idUtilisateur) {
      return;
    }


    this.actionJardiDex = true;


    // ----------------------------------------------------------
    // UPDATE MONGODB
    // ----------------------------------------------------------

    this.userService
      .updateUser(
        idUtilisateur,
        {
          jardiDex: nouveauJardiDex
        }
      )
      .pipe(
        takeUntil(this.destroy$)
      )
      .subscribe({

        // ======================================================
        // SUCCESS
        // ======================================================

        next: (response: any) => {

          let utilisateurMisAJour:
            Utilisateur;


          if (
            response &&
            typeof response === 'object' &&
            (
              response._id ||
              response.id ||
              response.key ||
              response.email
            )
          ) {

            utilisateurMisAJour =
              response;
          }

          else if (
            response?.utilisateur
          ) {

            utilisateurMisAJour =
              response.utilisateur;
          }

          else {

            utilisateurMisAJour = {
              ...utilisateur,
              jardiDex:
                nouveauJardiDex
            };
          }


          // ----------------------------------------------------
          // Garantir le JardiDex
          // ----------------------------------------------------

          utilisateurMisAJour.jardiDex =
            Array.isArray(
              utilisateurMisAJour.jardiDex
            )
              ? utilisateurMisAJour.jardiDex
              : nouveauJardiDex;


          // ----------------------------------------------------
          // Mettre à jour user courant
          // ----------------------------------------------------

          this.utilisateurConnecte =
            utilisateurMisAJour;


          // ----------------------------------------------------
          // Mettre à jour affichage
          // ----------------------------------------------------

          this.normaliserJardiDex(
            utilisateurMisAJour.jardiDex
          );


          // ----------------------------------------------------
          // Synchroniser localStorage
          // ----------------------------------------------------

          this.synchroniserUtilisateurLocal(
            utilisateurMisAJour
          );


          this.actionJardiDex = false;
        },


        // ======================================================
        // ERROR
        // ======================================================

        error: () => {

          this.actionJardiDex = false;
        }
      });
  }


  // ============================================================
  // 🌱 CHARGER TOUTES LES PLANTES
  // ============================================================

  chargerPlantes(): void {

    this.chargement = true;

    this.erreur = false;

    this.messageErreur = '';


    this.plantService
      .getAllPlants()
      .pipe(
        takeUntil(
          this.destroy$
        )
      )
      .subscribe({

        // ======================================================
        // SUCCESS
        // ======================================================

        next: (
          plantes: Plant[]
        ) => {

          this.plantes =
            Array.isArray(plantes)
              ? plantes
              : [];


          this.genererCategories();


          this.chargement = false;
        },


        // ======================================================
        // ERROR
        // ======================================================

        error: () => {

          this.plantes = [];

          this.categories = [];

          this.chargement = false;

          this.erreur = true;

          this.messageErreur =
            'Impossible de charger les plantes pour le moment.';
        }
      });
  }


  // ============================================================
  // 🏷️ GÉNÉRER CATÉGORIES
  // ============================================================

  private genererCategories(): void {

    const compteur =
      new Map<string, number>();


    for (
      const plante of this.plantes
    ) {

      const categorie =
        plante.categorie?.trim();


      if (!categorie) {
        continue;
      }


      const categorieNormalisee =
        categorie
          .toLowerCase()
          .normalize('NFD')
          .replace(
            /[\u0300-\u036f]/g,
            ''
          );


      const actuel =
        compteur.get(
          categorieNormalisee
        ) ?? 0;


      compteur.set(
        categorieNormalisee,
        actuel + 1
      );
    }


    const categoriesTriees =
      Array.from(
        compteur.entries()
      )
      .sort(
        (a, b) =>
          b[1] - a[1]
      );


    this.categories =
      categoriesTriees.map(
        ([nomNormalise, nombre]) => {

          const nomOriginal =
            this.plantes.find(
              plante =>
                plante.categorie
                  ?.trim()
                  .toLowerCase()
                  .normalize('NFD')
                  .replace(
                    /[\u0300-\u036f]/g,
                    ''
                  ) === nomNormalise
            )
            ?.categorie
            ?.trim()
            ?? nomNormalise;


          return {

            nom: nomOriginal,

            description:
              `${nombre} plante${nombre > 1 ? 's' : ''} disponible${nombre > 1 ? 's' : ''}`,

            icon:
              this.getCategoryIcon(
                nomOriginal
              ),

            nombre
          };
        }
      );
  }


  // ============================================================
  // 🎨 ICÔNE CATÉGORIE
  // ============================================================

  private getCategoryIcon(
    categorie: string
  ): string {

    const value =
      categorie
        .toLowerCase()
        .normalize('NFD')
        .replace(
          /[\u0300-\u036f]/g,
          ''
        );


    if (
      value.includes('interieur') ||
      value.includes('maison')
    ) {

      return 'fa-solid fa-house';
    }


    if (
      value.includes('jardin') ||
      value.includes('exterieur')
    ) {

      return 'fa-solid fa-seedling';
    }


    if (
      value.includes('fleur')
    ) {

      return 'fa-solid fa-flower';
    }


    if (
      value.includes('aromatique') ||
      value.includes('culinaire')
    ) {

      return 'fa-solid fa-spa';
    }


    if (
      value.includes('tropical') ||
      value.includes('exotique')
    ) {

      return 'fa-solid fa-tree';
    }


    if (
      value.includes('fruit')
    ) {

      return 'fa-solid fa-apple-whole';
    }


    if (
      value.includes('legume') ||
      value.includes('potager')
    ) {

      return 'fa-solid fa-carrot';
    }


    if (
      value.includes('grimp')
    ) {

      return 'fa-solid fa-leaf';
    }


    return 'fa-solid fa-leaf';
  }


  // ============================================================
  // 🔤 NORMALISER TEXTE
  // ============================================================

  private normaliserTexte(
    valeur: string | null | undefined
  ): string {

    return (valeur ?? '')
      .toString()
      .trim()
      .toLowerCase()
      .normalize('NFD')
      .replace(
        /[\u0300-\u036f]/g,
        ''
      );
  }


  // ============================================================
  // 🔎 PLANTES FILTRÉES
  // ============================================================

  get suggestionsFiltrees(): Plant[] {

    const terme =
      this.normaliserTexte(
        this.recherche
      );


    if (!terme) {
      return this.plantes;
    }


    return this.plantes.filter(
      (plante: Plant) => {

        const valeurs = [

          plante.nomCommun,

          plante.nomScientifique,

          plante.famille,

          plante.genre,

          plante.espece,

          plante.categorie,

          plante.sousCategorie,

          plante.origine,

          plante.habitat

        ];


        return valeurs.some(
          valeur => {

            const texte =
              this.normaliserTexte(
                valeur
              );


            return texte.startsWith(
              terme
            );
          }
        );
      }
    );
  }


  // ============================================================
  // 🌿 PLANTES À AFFICHER
  // ============================================================

  get plantesAffichees(): Plant[] {

    return this.suggestionsFiltrees;
  }


  // ============================================================
  // 📊 NOMBRE RÉSULTATS
  // ============================================================

  get nombreResultats(): number {

    return this.suggestionsFiltrees.length;
  }


  // ============================================================
  // 🔥 RECHERCHES POPULAIRES
  // ============================================================

  get recherchesPopulaires(): string[] {

    const valeurs: string[] = [];


    for (
      const plante of this.plantes
    ) {

      if (
        plante.nomCommun?.trim()
      ) {

        valeurs.push(
          plante.nomCommun.trim()
        );
      }


      if (
        plante.nomScientifique?.trim()
      ) {

        valeurs.push(
          plante.nomScientifique.trim()
        );
      }
    }


    const uniques =
      Array.from(
        new Set(
          valeurs.map(
            valeur =>
              this.normaliserTexte(
                valeur
              )
          )
        )
      );


    return uniques

      .map(
        valeur =>
          valeurs.find(
            original =>
              this.normaliserTexte(
                original
              ) === valeur
          ) ?? valeur
      )

      .slice(0, 8);
  }


  // ============================================================
  // 🔎 RECHERCHER
  // ============================================================

  rechercher(
    terme: string
  ): void {

    this.recherche =
      terme?.trim() ?? '';
  }


  // ============================================================
  // 🧹 EFFACER RECHERCHE
  // ============================================================

  effacerRecherche(): void {

    this.recherche = '';
  }


  // ============================================================
  // 🏷️ RECHERCHER CATÉGORIE
  // ============================================================

  rechercherCategorie(
    categorie: string
  ): void {

    this.recherche =
      categorie?.trim() ?? '';
  }


  // ============================================================
  // 🖼️ IMAGE
  // ============================================================

  getImage(
    plante: Plant
  ): string {

    return this.plantService.getMainImage(
      plante
    );
  }


  // ============================================================
  // 🌱 NOM
  // ============================================================

  getNom(
    plante: Plant
  ): string {

    return this.plantService.getPlantDisplayName(
      plante
    );
  }


  // ============================================================
  // 🔬 NOM SCIENTIFIQUE
  // ============================================================

  getNomScientifique(
    plante: Plant
  ): string {

    return this.plantService.getScientificName(
      plante
    );
  }


  // ============================================================
  // 🏷️ CATÉGORIE
  // ============================================================

  getCategorie(
    plante: Plant
  ): string {

    return this.plantService.getCategory(
      plante
    );
  }


  // ============================================================
  // 🌳 FAMILLE
  // ============================================================

  getFamille(
    plante: Plant
  ): string {

    return this.plantService.getFamily(
      plante
    );
  }


  // ============================================================
  // 🔄 RECHARGER
  // ============================================================

  rechargerPlantes(): void {

    this.chargerUtilisateurEtJardiDex();

    this.chargerPlantes();
  }


  // ============================================================
  // 📅 DESTROY
  // ============================================================

  ngOnDestroy(): void {

    this.destroy$.next();

    this.destroy$.complete();
  }
}