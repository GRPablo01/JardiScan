import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';

import {
  PlantService,
  Plant,
} from '../../../../../Backend/Services/plant.service';
import { ThemeService } from '../../../../../Backend/Services/theme.service';

/* ============================================================
   🌿 JARDISCAN — WIDGET CARTE / JARDIDEX

   • Les plantes viennent de MongoDB
   • Aucun XP
   • Aucun niveau
   • Aucun système de progression XP
   • Nombre de cartes du pack selon le nombre de plantes
   • Maximum 5 cartes par pack
   ============================================================ */

type Rarete =
  | 'commune'
  | 'rare'
  | 'epique'
  | 'legendaire';

interface CartePlante {

  /* ----------------------------------------------------------
     🆔 IDENTIFIANT
     ---------------------------------------------------------- */

  id: string;

  /* ----------------------------------------------------------
     🔢 NUMÉRO MONGODB
     ---------------------------------------------------------- */

  nombre?: number;

  /* ----------------------------------------------------------
     🌿 IDENTITÉ
     ---------------------------------------------------------- */

  nom: string;

  espece: string;

  famille?: string;

  categorie?: string;

  /* ----------------------------------------------------------
     📸 IMAGE
     ---------------------------------------------------------- */

  image: string;

  /* ----------------------------------------------------------
     ⭐ JEU
     ---------------------------------------------------------- */

  rarete: Rarete;

  fragments: number;

  description: string;

  decouverte: boolean;

  /* ----------------------------------------------------------
     🌱 PLANTE ORIGINALE
     ---------------------------------------------------------- */

  plant: Plant;
}

@Component({
  selector: 'app-widget-carte',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './widget-carte.html',
  styleUrl: './widget-carte.css',
})
export class WidgetCarte implements OnInit {

  /* ============================================================
     🌿 ÉTAT CHARGEMENT
     ============================================================ */

  chargement = false;

  erreur = '';

  /* ============================================================
     🎁 ÉTAT DU PACK
     ============================================================ */

  packOuvert = false;

  revelationEnCours = false;

  cartesRevelees = false;

  carteActiveIndex = 0;

  /* ============================================================
     🌿 PROGRESSION COLLECTION
     ============================================================ */

  plantesDecouvertes = 0;

  plantesTotal = 0;

  fragments = 124;

  /* ============================================================
     🃏 CARTES DU PACK ACTUEL
     ============================================================ */

  cartesDuPack: CartePlante[] = [];

  /* ============================================================
     🌿 TOUTES LES PLANTES MONGODB
     ============================================================ */

  toutesLesPlantes: Plant[] = [];

  /* ============================================================
     🌿 COLLECTION
     ============================================================ */

  collection: CartePlante[] = [];

  /* ============================================================
     💉 CONSTRUCTEUR
     ============================================================ */

  constructor(
    private readonly plantService: PlantService,
    public themeService:ThemeService
  ) {}

  /* ============================================================
     🚀 INITIALISATION
     ============================================================ */

  ngOnInit(): void {
    this.chargerToutesLesPlantes();
  }

  /* ============================================================
     🌱 RÉCUPÉRER TOUTES LES PLANTES MONGODB
     ============================================================ */

  chargerToutesLesPlantes(): void {

    this.chargement = true;
    this.erreur = '';

    console.log(
      '🌿 [WIDGET CARTE] Chargement de toutes les plantes MongoDB...'
    );

    this.plantService.getAllPlants().subscribe({

      next: (plantes: Plant[]) => {

        console.log(
          '✅ [WIDGET CARTE] Plantes reçues :',
          plantes
        );

        console.log(
          '🌱 Nombre total de plantes :',
          plantes.length
        );

        this.toutesLesPlantes = plantes;

        this.plantesTotal = plantes.length;

        /* ------------------------------------------------------
           Construction de la collection
           ------------------------------------------------------ */

        this.collection = plantes
          .filter((plant) => this.estPlanteDecouverte(plant))
          .map((plant) => this.transformerEnCarte(plant));

        this.plantesDecouvertes =
          this.collection.length;

        this.chargement = false;
      },

      error: (error) => {

        console.error(
          '❌ [WIDGET CARTE] Impossible de récupérer les plantes :',
          error
        );

        this.erreur =
          'Impossible de récupérer les plantes.';

        this.chargement = false;
      }
    });
  }

  /* ============================================================
     🎴 NOMBRE DE CARTES PAR PACK
     
     1 → 3 plantes   = 1 carte
     4 → 6 plantes   = 2 cartes
     7 → 10 plantes  = 3 cartes
     11+             = 5 cartes

     Maximum absolu : 5
     ============================================================ */

  get nombreCartesParPack(): number {

    const nombrePlantes =
      this.toutesLesPlantes.length;

    if (nombrePlantes <= 0) {
      return 0;
    }

    if (nombrePlantes <= 3) {
      return 1;
    }

    if (nombrePlantes <= 6) {
      return 2;
    }

    if (nombrePlantes <= 10) {
      return 3;
    }

    return 5;
  }

  /* ============================================================
     🏷️ TEXTE DU NOMBRE DE CARTES
     ============================================================ */

  get texteNombreCartes(): string {

    const nombre =
      this.nombreCartesParPack;

    if (nombre === 0) {
      return 'Aucune carte';
    }

    if (nombre === 1) {
      return '1 carte';
    }

    return `${nombre} cartes`;
  }

  /* ============================================================
     🌿 TRANSFORMER UNE PLANTE MONGODB EN CARTE
     ============================================================ */

  private transformerEnCarte(
    plant: Plant
  ): CartePlante {

    const rarete =
      this.determinerRarete(plant);

    const fragments =
      this.calculerFragments(rarete);

    return {

      id:
        plant._id ??
        String(
          plant.nombre ??
          Math.random()
        ),

      nombre:
        plant.nombre,

      nom:
        plant.nomCommun ||
        plant.nomScientifique ||
        'Plante inconnue',

      espece:
        plant.nomScientifique ||
        plant.espece ||
        '',

      famille:
        plant.famille,

      categorie:
        plant.categorie,

      image:
        this.plantService.getMainImage(plant),

      rarete,

      fragments,

      description:
        plant.description ||
        'Aucune description disponible.',

      decouverte:
        this.estPlanteDecouverte(plant),

      plant
    };
  }

  /* ============================================================
     ⭐ DÉTERMINER LA RARETÉ
     ============================================================ */

  private determinerRarete(
    plant: Plant
  ): Rarete {

    const nombre =
      plant.nombre ?? 0;

    const valeur =
      Math.abs(
        nombre ||
        this.hashPlant(
          plant._id ||
          plant.nomCommun ||
          plant.nomScientifique ||
          ''
        )
      ) % 100;

    if (valeur < 60) {
      return 'commune';
    }

    if (valeur < 87) {
      return 'rare';
    }

    if (valeur < 98) {
      return 'epique';
    }

    return 'legendaire';
  }

  /* ============================================================
     🔢 HASH SIMPLE
     ============================================================ */

  private hashPlant(
    value: string
  ): number {

    let hash = 0;

    for (
      let i = 0;
      i < value.length;
      i++
    ) {

      hash =
        (
          (hash << 5) -
          hash +
          value.charCodeAt(i)
        ) |
        0;
    }

    return Math.abs(hash);
  }

  /* ============================================================
     🧩 FRAGMENTS SELON RARETÉ
     ============================================================ */

  private calculerFragments(
    rarete: Rarete
  ): number {

    switch (rarete) {

      case 'commune':
        return 5;

      case 'rare':
        return 8;

      case 'epique':
        return 12;

      case 'legendaire':
        return 25;

      default:
        return 5;
    }
  }

  /* ============================================================
     🌱 DÉTERMINER SI LA PLANTE EST DÉJÀ DÉCOUVERTE

     Pour l'instant false.

     Plus tard :
     utilisateur.jardiDex.includes(plant._id)
     ============================================================ */

  private estPlanteDecouverte(
    plant: Plant
  ): boolean {

    return false;
  }

  /* ============================================================
     🎁 OUVRIR LE PACK
     ============================================================ */

  ouvrirPack(): void {

    if (
      this.revelationEnCours ||
      this.chargement
    ) {
      return;
    }

    if (
      this.toutesLesPlantes.length === 0
    ) {

      console.warn(
        '⚠️ Aucune plante disponible.'
      );

      return;
    }

    const nombreCartes =
      this.nombreCartesParPack;

    if (nombreCartes <= 0) {
      return;
    }

    this.packOuvert = true;

    this.revelationEnCours = true;

    this.cartesRevelees = false;

    this.carteActiveIndex = 0;

    this.cartesDuPack =
      this.genererPack();

    console.log(
      `🎁 Pack généré avec ${this.cartesDuPack.length} carte(s)`
    );

    setTimeout(() => {

      this.revelationEnCours = false;

      this.cartesRevelees = true;

    }, 1200);
  }

  /* ============================================================
     🃏 GÉNÉRER LE PACK
     
     Le nombre de cartes dépend automatiquement
     du nombre total de plantes MongoDB.
     ============================================================ */

  private genererPack(): CartePlante[] {

    const resultat: CartePlante[] = [];

    const nombreCartes =
      this.nombreCartesParPack;

    if (nombreCartes <= 0) {
      return resultat;
    }

    /*
     * Copie du tableau afin de pouvoir retirer
     * les plantes déjà sélectionnées.
     */
    const disponibles = [
      ...this.toutesLesPlantes
    ];

    /*
     * Sécurité :
     * impossible d'avoir plus de cartes différentes
     * que de plantes disponibles.
     */
    const nombreMaximum =
      Math.min(
        nombreCartes,
        disponibles.length,
        5
      );

    while (
      resultat.length < nombreMaximum &&
      disponibles.length > 0
    ) {

      const index =
        Math.floor(
          Math.random() *
          disponibles.length
        );

      const plant =
        disponibles.splice(
          index,
          1
        )[0];

      if (!plant) {
        continue;
      }

      resultat.push(
        this.transformerEnCarte(
          plant
        )
      );
    }

    return resultat;
  }

  /* ============================================================
     🎲 TIRER UNE CARTE
     ============================================================ */

  private tirerCarte(): CartePlante {

    const plant =
      this.toutesLesPlantes[
        Math.floor(
          Math.random() *
          this.toutesLesPlantes.length
        )
      ];

    if (!plant) {

      throw new Error(
        'Aucune plante disponible'
      );
    }

    return this.transformerEnCarte(
      plant
    );
  }

  /* ============================================================
     🔄 RÉVÉLER UNE CARTE
     ============================================================ */

  revelerCarte(
    index: number
  ): void {

    if (
      !this.cartesRevelees
    ) {
      return;
    }

    if (
      index < 0 ||
      index >= this.cartesDuPack.length
    ) {
      return;
    }

    this.carteActiveIndex =
      index;
  }

  /* ============================================================
     🌿 RÉCUPÉRER LE STATUT
     ============================================================ */

  estNouvelleCarte(
    carte: CartePlante
  ): boolean {

    return !this.collection.some(
      (plante) =>
        plante.id === carte.id
    );
  }

  /* ============================================================
     ➕ AJOUTER UNE CARTE À LA COLLECTION
     ============================================================ */

  ajouterCarte(
    carte: CartePlante
  ): void {

    const existe =
      this.collection.some(
        (plante) =>
          plante.id === carte.id
      );

    if (existe) {

      /*
       * Carte déjà connue :
       * récupération des fragments.
       */

      this.fragments +=
        carte.fragments;

      return;
    }

    /* ----------------------------------------------------------
       Nouvelle plante
       ---------------------------------------------------------- */

    this.collection.push({

      ...carte,

      decouverte: true

    });

    this.plantesDecouvertes++;
  }

  /* ============================================================
     📊 POURCENTAGE COLLECTION
     ============================================================ */

  get progressionCollection(): number {

    if (
      this.plantesTotal === 0
    ) {
      return 0;
    }

    return Math.min(
      100,
      Math.round(
        (
          this.plantesDecouvertes /
          this.plantesTotal
        ) * 100
      )
    );
  }

  /* ============================================================
     🏷️ NOM RARETÉ
     ============================================================ */

  getNomRarete(
    rarete: Rarete
  ): string {

    switch (rarete) {

      case 'commune':
        return 'Commune';

      case 'rare':
        return 'Rare';

      case 'epique':
        return 'Épique';

      case 'legendaire':
        return 'Légendaire';

      default:
        return '';
    }
  }

  /* ============================================================
     🎨 CLASSE RARETÉ
     ============================================================ */

  getClasseRarete(
    rarete: Rarete
  ): string {

    switch (rarete) {

      case 'commune':
        return 'rarete-commune';

      case 'rare':
        return 'rarete-rare';

      case 'epique':
        return 'rarete-epique';

      case 'legendaire':
        return 'rarete-legendaire';

      default:
        return '';
    }
  }

  /* ============================================================
     🔢 CARTE ACTIVE
     ============================================================ */

  get carteActive(): CartePlante | null {

    return (
      this.cartesDuPack[
        this.carteActiveIndex
      ] ??
      null
    );
  }

  /* ============================================================
     📸 IMAGE CARTE ACTIVE
     ============================================================ */

  get imageCarteActive(): string {

    const carte =
      this.carteActive;

    if (!carte) {
      return '';
    }

    return carte.image;
  }

  /* ============================================================
     🔁 FERMER LE PACK
     ============================================================ */

  fermerPack(): void {

    this.packOuvert = false;

    this.revelationEnCours = false;

    this.cartesRevelees = false;

    this.carteActiveIndex = 0;

    this.cartesDuPack = [];
  }

  /* ============================================================
     🎁 NOUVEAU PACK
     ============================================================ */

  nouveauPack(): void {

    this.fermerPack();

    setTimeout(() => {
      this.ouvrirPack();
    }, 250);
  }

  cartesRetournees: boolean[] = [];

  tournerCarte(index: number): void {
    this.cartesRetournees[index] = !this.cartesRetournees[index];
  }
}