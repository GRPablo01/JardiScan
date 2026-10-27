// ============================================================
// ARBORIA — SECTION FONCTIONNALITÉS PREMIUM
// Fichier : fonctionnalite.ts
//
// Angular Standalone + Tailwind CSS + Font Awesome
// • Catégorie « Découverte » sélectionnée par défaut
// • Affichage immédiat des fonctionnalités de découverte
// • Aucun bouton ni catégorie « Tout »
// • Filtrage instantané par catégorie
// • Recherche de plantes sans caméra ni scanner
// • Aperçus interactifs
// • Thème clair/sombre via ThemeService
// • Traductions FR/EN via LanguageService
// • Aucun service supplémentaire requis
// ============================================================

import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';

import { ThemeService } from '../../../../../Backend/Services/theme.service';
import { LanguageService } from '../../../../../Backend/Services/language.service';

// ============================================================
// TYPES
// ============================================================

interface FeatureCategory {
  id: string;
  labelKey: string;
  icon: string;
  isNew?: boolean;
}

type FeaturePreview =
  | 'search'
  | 'care'
  | 'diagnostic'
  | 'collection'
  | 'favorites'
  | 'calendar'
  | 'weather'
  | 'assistant'
  | 'botanical'
  | 'tracking'
  | 'sharing'
  | 'lists'
  | 'reminders'
  | 'history';

interface Feature {
  id: string;
  titleKey: string;
  descriptionKey: string;
  category: string;
  categoryLabelKey: string;
  icon: string;
  color?: string;
  iconBackground?: string;
  preview: FeaturePreview;
  isNew?: boolean;
  route?: string;
}

interface PreviewItem {
  icon: string;
  labelKey: string;
}

interface CarePreviewItem {
  icon: string;
  color: string;
  titleKey: string;
  valueKey: string;
}

interface DiagnosticAnswer {
  id: string;
  icon: string;
  labelKey: string;
}

interface FavoritePreviewItem {
  labelKey: string;
  descriptionKey: string;
}

interface SeasonalTask {
  icon: string;
  labelKey: string;
}

interface BotanicalDetail {
  icon: string;
  titleKey: string;
  valueKey: string;
}

interface TrackingPreviewItem {
  labelKey: string;
  statusKey: string;
  value: number;
}

interface PlantListPreviewItem {
  icon: string;
  titleKey: string;
  descriptionKey: string;
  count: number;
}

interface GardenHistoryPreviewItem {
  icon: string;
  titleKey: string;
  descriptionKey: string;
  dateKey: string;
}

// ============================================================
// COMPOSANT
// ============================================================

@Component({
  selector: 'app-fonctionnalite',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './fonctionnalite.html',
})
export class Fonctionnalite {
  // ------------------------------------------------------------
  // CATÉGORIES
  // « Découverte » est sélectionnée par défaut.
  // Aucun élément « Tout ».
  // ------------------------------------------------------------

  readonly categories: FeatureCategory[] = [
    {
      id: 'discovery',
      labelKey: 'features.categoryDiscovery',
      icon: 'fa-solid fa-magnifying-glass',
    },
    {
      id: 'care',
      labelKey: 'features.categoryCare',
      icon: 'fa-solid fa-droplet',
    },
    {
      id: 'collection',
      labelKey: 'features.categoryCollection',
      icon: 'fa-solid fa-book-open',
    },
    {
      id: 'planning',
      labelKey: 'features.categoryPlanning',
      icon: 'fa-solid fa-calendar-days',
    },
    {
      id: 'intelligence',
      labelKey: 'features.categoryIntelligence',
      icon: 'fa-solid fa-wand-magic-sparkles',
      isNew: true,
    },
  ];

  /**
   * La catégorie « Découverte » est sélectionnée au chargement.
   * Les fonctionnalités affichées initialement sont donc :
   * - Recherche de plantes
   * - Fiches botaniques
   *
   * Cliquer sur une autre catégorie applique son filtre.
   * Cliquer à nouveau sur la catégorie active réinitialise
   * le filtre sur « Découverte ».
   */
  selectedCategory = 'discovery';

  // ------------------------------------------------------------
  // FONCTIONNALITÉS
  // ------------------------------------------------------------

  readonly features: Feature[] = [
    {
      id: 'plant-search',
      titleKey: 'features.plantSearch.title',
      descriptionKey: 'features.plantSearch.description',
      category: 'discovery',
      categoryLabelKey: 'features.categoryDiscovery',
      icon: 'fa-solid fa-magnifying-glass',
      preview: 'search',
      route: '/recherche',
    },
    {
      id: 'botanical-sheets',
      titleKey: 'features.botanical.title',
      descriptionKey: 'features.botanical.description',
      category: 'discovery',
      categoryLabelKey: 'features.categoryDiscovery',
      icon: 'fa-solid fa-book-open',
      preview: 'botanical',
      route: '/recherche',
    },
    {
      id: 'plant-care',
      titleKey: 'features.care.title',
      descriptionKey: 'features.care.description',
      category: 'care',
      categoryLabelKey: 'features.categoryCare',
      icon: 'fa-solid fa-droplet',
      preview: 'care',
      route: '/recherche',
    },
    {
      id: 'plant-diagnostic',
      titleKey: 'features.diagnostic.title',
      descriptionKey: 'features.diagnostic.description',
      category: 'care',
      categoryLabelKey: 'features.categoryCare',
      icon: 'fa-solid fa-stethoscope',
      preview: 'diagnostic',
      route: '/diagnostique',
    },
    {
      id: 'jardidex',
      titleKey: 'features.collection.title',
      descriptionKey: 'features.collection.description',
      category: 'collection',
      categoryLabelKey: 'features.categoryCollection',
      icon: 'fa-solid fa-book-bookmark',
      preview: 'collection',
      route: '/jardidex',
    },
    {
      id: 'favorites',
      titleKey: 'features.favorites.title',
      descriptionKey: 'features.favorites.description',
      category: 'collection',
      categoryLabelKey: 'features.categoryCollection',
      icon: 'fa-solid fa-heart',
      preview: 'favorites',
      route: '/favoris',
    },
    {
      id: 'plant-lists',
      titleKey: 'features.lists.title',
      descriptionKey: 'features.lists.description',
      category: 'collection',
      categoryLabelKey: 'features.categoryCollection',
      icon: 'fa-solid fa-list-check',
      preview: 'lists',
      isNew: true,
      route: '/jardidex',
    },
    {
      id: 'garden-sharing',
      titleKey: 'features.sharing.title',
      descriptionKey: 'features.sharing.description',
      category: 'collection',
      categoryLabelKey: 'features.categoryCollection',
      icon: 'fa-solid fa-share-nodes',
      preview: 'sharing',
      isNew: true,
      route: '/jardidex',
    },
    {
      id: 'seasonal-calendar',
      titleKey: 'features.calendar.title',
      descriptionKey: 'features.calendar.description',
      category: 'planning',
      categoryLabelKey: 'features.categoryPlanning',
      icon: 'fa-solid fa-calendar-days',
      preview: 'calendar',
      route: '/saison',
    },
    {
      id: 'garden-weather',
      titleKey: 'features.weather.title',
      descriptionKey: 'features.weather.description',
      category: 'planning',
      categoryLabelKey: 'features.categoryPlanning',
      icon: 'fa-solid fa-cloud-sun',
      preview: 'weather',
      isNew: true,
      route: '/saison',
    },
    {
      id: 'care-reminders',
      titleKey: 'features.reminders.title',
      descriptionKey: 'features.reminders.description',
      category: 'planning',
      categoryLabelKey: 'features.categoryPlanning',
      icon: 'fa-solid fa-bell',
      preview: 'reminders',
      isNew: true,
      route: '/saison',
    },
    {
      id: 'garden-history',
      titleKey: 'features.history.title',
      descriptionKey: 'features.history.description',
      category: 'planning',
      categoryLabelKey: 'features.categoryPlanning',
      icon: 'fa-solid fa-clock-rotate-left',
      preview: 'history',
      isNew: true,
      route: '/jardidex',
    },
    {
      id: 'garden-assistant',
      titleKey: 'features.assistant.title',
      descriptionKey: 'features.assistant.description',
      category: 'intelligence',
      categoryLabelKey: 'features.categoryIntelligence',
      icon: 'fa-solid fa-comments',
      preview: 'assistant',
      route: '/assistant',
    },
    {
      id: 'culture-tracking',
      titleKey: 'features.tracking.title',
      descriptionKey: 'features.tracking.description',
      category: 'intelligence',
      categoryLabelKey: 'features.categoryIntelligence',
      icon: 'fa-solid fa-chart-line',
      preview: 'tracking',
      isNew: true,
      route: '/jardidex',
    },
  ];

  // ------------------------------------------------------------
  // RECHERCHE DE PLANTES
  // ------------------------------------------------------------

  plantSearch = '';

  readonly suggestedPlants: string[] = [
    'Monstera',
    'Lavande',
    'Basilic',
    'Hortensia',
  ];

  // ------------------------------------------------------------
  // APERÇU : CONSEILS D'ENTRETIEN
  // ------------------------------------------------------------

  readonly carePreview: CarePreviewItem[] = [
    {
      icon: 'fa-solid fa-droplet',
      color: '#4385F5',
      titleKey: 'features.carePreview.water',
      valueKey: 'features.carePreview.waterValue',
    },
    {
      icon: 'fa-solid fa-sun',
      color: '#DCA735',
      titleKey: 'features.carePreview.light',
      valueKey: 'features.carePreview.lightValue',
    },
    {
      icon: 'fa-solid fa-mountain',
      color: '#A87850',
      titleKey: 'features.carePreview.soil',
      valueKey: 'features.carePreview.soilValue',
    },
    {
      icon: 'fa-solid fa-seedling',
      color: '#438F60',
      titleKey: 'features.carePreview.growth',
      valueKey: 'features.carePreview.growthValue',
    },
  ];

  // ------------------------------------------------------------
  // APERÇU : DIAGNOSTIC GUIDÉ
  // ------------------------------------------------------------

  readonly diagnosticAnswers: DiagnosticAnswer[] = [
    {
      id: 'leaves',
      icon: 'fa-solid fa-leaf',
      labelKey: 'features.diagnosticPreview.leaves',
    },
    {
      id: 'watering',
      icon: 'fa-solid fa-droplet',
      labelKey: 'features.diagnosticPreview.watering',
    },
    {
      id: 'growth',
      icon: 'fa-solid fa-seedling',
      labelKey: 'features.diagnosticPreview.growth',
    },
  ];

  selectedDiagnosticAnswer = '';

  // ------------------------------------------------------------
  // APERÇU : JARDIDEX
  // ------------------------------------------------------------

  readonly collectionPreview: PreviewItem[] = [
    {
      icon: 'fa-solid fa-leaf',
      labelKey: 'features.collectionPreview.plantOne',
    },
    {
      icon: 'fa-solid fa-spa',
      labelKey: 'features.collectionPreview.plantTwo',
    },
    {
      icon: 'fa-solid fa-seedling',
      labelKey: 'features.collectionPreview.plantThree',
    },
  ];

  // ------------------------------------------------------------
  // APERÇU : FAVORIS
  // ------------------------------------------------------------

  readonly favoritesPreview: FavoritePreviewItem[] = [
    {
      labelKey: 'features.favoritesPreview.plantOne',
      descriptionKey: 'features.favoritesPreview.descriptionOne',
    },
    {
      labelKey: 'features.favoritesPreview.plantTwo',
      descriptionKey: 'features.favoritesPreview.descriptionTwo',
    },
  ];

  // ------------------------------------------------------------
  // APERÇU : CALENDRIER SAISONNIER
  // ------------------------------------------------------------

  readonly seasonalTasks: SeasonalTask[] = [
    {
      icon: 'fa-solid fa-seedling',
      labelKey: 'features.calendarPreview.taskOne',
    },
    {
      icon: 'fa-solid fa-scissors',
      labelKey: 'features.calendarPreview.taskTwo',
    },
    {
      icon: 'fa-solid fa-shovel',
      labelKey: 'features.calendarPreview.taskThree',
    },
  ];

  // ------------------------------------------------------------
  // APERÇU : FICHES BOTANIQUES
  // ------------------------------------------------------------

  readonly botanicalDetails: BotanicalDetail[] = [
    {
      icon: 'fa-solid fa-sun',
      titleKey: 'features.botanicalPreview.light',
      valueKey: 'features.botanicalPreview.lightValue',
    },
    {
      icon: 'fa-solid fa-droplet',
      titleKey: 'features.botanicalPreview.water',
      valueKey: 'features.botanicalPreview.waterValue',
    },
    {
      icon: 'fa-solid fa-ruler-vertical',
      titleKey: 'features.botanicalPreview.size',
      valueKey: 'features.botanicalPreview.sizeValue',
    },
    {
      icon: 'fa-solid fa-temperature-half',
      titleKey: 'features.botanicalPreview.climate',
      valueKey: 'features.botanicalPreview.climateValue',
    },
  ];

  // ------------------------------------------------------------
  // APERÇU : SUIVI DE CULTURE
  // ------------------------------------------------------------

  readonly trackingPreview: TrackingPreviewItem[] = [
    {
      labelKey: 'features.trackingPreview.watering',
      statusKey: 'features.trackingPreview.wateringStatus',
      value: 75,
    },
    {
      labelKey: 'features.trackingPreview.growth',
      statusKey: 'features.trackingPreview.growthStatus',
      value: 60,
    },
    {
      labelKey: 'features.trackingPreview.care',
      statusKey: 'features.trackingPreview.careStatus',
      value: 90,
    },
  ];

  // ------------------------------------------------------------
  // APERÇU : PARTAGE DE COLLECTION
  // ------------------------------------------------------------

  readonly sharingAvatars: string[] = [
    'fa-solid fa-user',
    'fa-solid fa-leaf',
    'fa-solid fa-seedling',
  ];

  // ------------------------------------------------------------
  // APERÇU : LISTES PERSONNALISÉES
  // ------------------------------------------------------------

  readonly plantListsPreview: PlantListPreviewItem[] = [
    {
      icon: 'fa-solid fa-seedling',
      titleKey: 'features.listsPreview.toPlant',
      descriptionKey: 'features.listsPreview.toPlantDescription',
      count: 4,
    },
    {
      icon: 'fa-solid fa-droplet',
      titleKey: 'features.listsPreview.toWater',
      descriptionKey: 'features.listsPreview.toWaterDescription',
      count: 3,
    },
    {
      icon: 'fa-solid fa-heart',
      titleKey: 'features.listsPreview.favorites',
      descriptionKey: 'features.listsPreview.favoritesDescription',
      count: 6,
    },
  ];

  // ------------------------------------------------------------
  // APERÇU : HISTORIQUE DU JARDIN
  // ------------------------------------------------------------

  readonly gardenHistoryPreview: GardenHistoryPreviewItem[] = [
    {
      icon: 'fa-solid fa-droplet',
      titleKey: 'features.historyPreview.eventOne',
      descriptionKey: 'features.historyPreview.descriptionOne',
      dateKey: 'features.historyPreview.dateOne',
    },
    {
      icon: 'fa-solid fa-seedling',
      titleKey: 'features.historyPreview.eventTwo',
      descriptionKey: 'features.historyPreview.descriptionTwo',
      dateKey: 'features.historyPreview.dateTwo',
    },
    {
      icon: 'fa-solid fa-scissors',
      titleKey: 'features.historyPreview.eventThree',
      descriptionKey: 'features.historyPreview.descriptionThree',
      dateKey: 'features.historyPreview.dateThree',
    },
  ];

  // ------------------------------------------------------------
  // CONSTRUCTEUR
  // ------------------------------------------------------------

  constructor(
    public themeService: ThemeService,
    private languageService: LanguageService,
    private router: Router,
  ) {}

  // ------------------------------------------------------------
  // TRADUCTIONS
  // Compatible avec plusieurs API courantes du LanguageService.
  // ------------------------------------------------------------

  t(key: string): string {
    const service = this.languageService as unknown as {
      translate?: (key: string) => string;
      instant?: (key: string) => string;
      getTranslation?: (key: string) => string;
      traduire?: (key: string) => string;
    };

    const candidates = [
      service.translate?.(key),
      service.instant?.(key),
      service.getTranslation?.(key),
      service.traduire?.(key),
    ];

    const result = candidates.find(
      (value): value is string =>
        typeof value === 'string' &&
        value.trim().length > 0 &&
        value !== key,
    );

    return result ?? this.fallbackTranslation(key);
  }

  private fallbackTranslation(key: string): string {
    const translations: Record<string, { fr: string; en: string }> = {
      'features.eyebrow': {
        fr: 'L’univers Arboria',
        en: 'The world of Arboria',
      },
      'features.titleStart': {
        fr: 'Tout pour faire',
        en: 'Everything to help',
      },
      'features.titleAccent': {
        fr: 'grandir',
        en: 'grow',
      },
      'features.titleEnd': {
        fr: 'votre jardin.',
        en: 'your garden.',
      },
      'features.description': {
        fr: 'Recherchez des plantes, découvrez leurs besoins, obtenez des conseils et composez votre propre collection végétale.',
        en: 'Search for plants, discover their needs, get advice and build your own plant collection.',
      },
      'features.benefitSearch': {
        fr: 'Recherche de plantes',
        en: 'Plant search',
      },
      'features.benefitCare': {
        fr: 'Conseils d’entretien',
        en: 'Plant care advice',
      },
      'features.benefitCollection': {
        fr: 'Collection personnelle',
        en: 'Personal collection',
      },
      'features.newFeaturesAvailable': {
        fr: 'De nouvelles fonctionnalités à découvrir',
        en: 'New features to discover',
      },
      'features.categoriesLabel': {
        fr: 'Catégories de fonctionnalités',
        en: 'Feature categories',
      },
      'features.categoryHint': {
        fr: 'Sélectionnez une catégorie pour affiner l’affichage.',
        en: 'Select a category to refine the results.',
      },
      'features.categoryDiscovery': {
        fr: 'Découverte',
        en: 'Discover',
      },
      'features.categoryCare': {
        fr: 'Entretien',
        en: 'Plant care',
      },
      'features.categoryCollection': {
        fr: 'Collection',
        en: 'Collection',
      },
      'features.categoryPlanning': {
        fr: 'Organisation',
        en: 'Planning',
      },
      'features.categoryIntelligence': {
        fr: 'Assistant',
        en: 'Assistant',
      },
      'features.new': {
        fr: 'Nouveau',
        en: 'New',
      },
      'features.recentlyAdded': {
        fr: 'Récemment ajouté',
        en: 'Recently added',
      },
      'features.available': {
        fr: 'fonctionnalités',
        en: 'features',
      },
      'features.search': {
        fr: 'Rechercher',
        en: 'Search',
      },
      'features.searchPlaceholder': {
        fr: 'Nom d’une plante…',
        en: 'Plant name…',
      },
      'features.emptyTitle': {
        fr: 'Aucune fonctionnalité dans cette catégorie.',
        en: 'No features in this category.',
      },
      'features.emptyDescription': {
        fr: 'Choisissez une autre catégorie pour continuer à explorer Arboria.',
        en: 'Choose another category to keep exploring Arboria.',
      },

      'features.plantSearch.title': {
        fr: 'Recherche de plantes',
        en: 'Plant search',
      },
      'features.plantSearch.description': {
        fr: 'Explorez les plantes disponibles, recherchez par nom et trouvez facilement les informations dont vous avez besoin.',
        en: 'Explore available plants, search by name and quickly find the information you need.',
      },
      'features.botanical.title': {
        fr: 'Fiches botaniques',
        en: 'Botanical profiles',
      },
      'features.botanical.description': {
        fr: 'Consultez les caractéristiques, les besoins et les informations utiles de chaque plante.',
        en: 'Explore the characteristics, needs and useful information for each plant.',
      },
      'features.care.title': {
        fr: 'Conseils d’entretien',
        en: 'Plant care advice',
      },
      'features.care.description': {
        fr: 'Comprenez les besoins en eau, lumière, substrat et entretien pour accompagner vos plantes.',
        en: 'Understand watering, light, soil and care needs to help your plants thrive.',
      },
      'features.diagnostic.title': {
        fr: 'Diagnostic guidé',
        en: 'Guided diagnosis',
      },
      'features.diagnostic.description': {
        fr: 'Répondez à des questions simples pour mieux comprendre les problèmes rencontrés au jardin.',
        en: 'Answer simple questions to better understand problems in your garden.',
      },
      'features.collection.title': {
        fr: 'JardiDex personnel',
        en: 'Personal JardiDex',
      },
      'features.collection.description': {
        fr: 'Constituez votre collection, retrouvez vos plantes et gardez une trace de vos découvertes.',
        en: 'Build your collection, find your plants and keep track of your discoveries.',
      },
      'features.favorites.title': {
        fr: 'Mes favoris',
        en: 'My favorites',
      },
      'features.favorites.description': {
        fr: 'Enregistrez les plantes que vous aimez pour retrouver leurs fiches rapidement.',
        en: 'Save the plants you love and quickly return to their profiles.',
      },
      'features.calendar.title': {
        fr: 'Calendrier saisonnier',
        en: 'Seasonal calendar',
      },
      'features.calendar.description': {
        fr: 'Découvrez les travaux et les bons gestes à envisager selon les saisons.',
        en: 'Discover gardening tasks and good practices for each season.',
      },
      'features.weather.title': {
        fr: 'Repères météo',
        en: 'Weather insights',
      },
      'features.weather.description': {
        fr: 'Un aperçu conçu pour accueillir les conditions météo locales et des conseils adaptés.',
        en: 'A preview designed for local weather conditions and tailored advice.',
      },
      'features.assistant.title': {
        fr: 'Assistant jardin',
        en: 'Garden assistant',
      },
      'features.assistant.description': {
        fr: 'Posez vos questions sur l’entretien, les saisons et la vie de vos plantes.',
        en: 'Ask questions about plant care, seasons and the life of your plants.',
      },
      'features.tracking.title': {
        fr: 'Suivi de culture',
        en: 'Plant progress tracking',
      },
      'features.tracking.description': {
        fr: 'Suivez les étapes d’entretien et l’évolution de vos plantes au fil du temps.',
        en: 'Track care tasks and observe how your plants change over time.',
      },
      'features.sharing.title': {
        fr: 'Partage de collection',
        en: 'Collection sharing',
      },
      'features.sharing.description': {
        fr: 'Préparez le partage de vos collections végétales avec d’autres passionnés.',
        en: 'Prepare to share your plant collections with other enthusiasts.',
      },
      'features.lists.title': {
        fr: 'Listes personnalisées',
        en: 'Custom lists',
      },
      'features.lists.description': {
        fr: 'Organisez vos plantes selon vos projets, vos envies ou les tâches à réaliser.',
        en: 'Organize plants around your projects, interests or upcoming tasks.',
      },
      'features.reminders.title': {
        fr: 'Rappels d’entretien',
        en: 'Care reminders',
      },
      'features.reminders.description': {
        fr: 'Gardez en tête les gestes importants à effectuer pour vos plantes.',
        en: 'Keep track of important care tasks for your plants.',
      },
      'features.history.title': {
        fr: 'Historique du jardin',
        en: 'Garden history',
      },
      'features.history.description': {
        fr: 'Retrouvez les événements et les soins consignés dans votre suivi de jardin.',
        en: 'Review recorded events and care activities from your garden.',
      },

      'features.previewSearchTitle': {
        fr: 'Explorer les plantes',
        en: 'Explore plants',
      },
      'features.previewSearchSubtitle': {
        fr: 'Trouvez votre prochaine plante',
        en: 'Find your next plant',
      },
      'features.previewSearchFootnote': {
        fr: 'Une recherche simple, sans scanner.',
        en: 'Simple search, no scanner required.',
      },

      'features.previewCareTitle': {
        fr: 'Guide d’entretien',
        en: 'Plant care guide',
      },
      'features.previewCareSubtitle': {
        fr: 'Les besoins de vos plantes',
        en: 'Your plants’ needs',
      },
      'features.previewCareTip': {
        fr: 'Adaptez toujours les soins à l’espèce et aux conditions de culture.',
        en: 'Always adapt care to the species and growing conditions.',
      },
      'features.carePreview.water': {
        fr: 'Arrosage',
        en: 'Watering',
      },
      'features.carePreview.waterValue': {
        fr: 'Selon le substrat',
        en: 'Based on the soil',
      },
      'features.carePreview.light': {
        fr: 'Lumière',
        en: 'Light',
      },
      'features.carePreview.lightValue': {
        fr: 'Exposition adaptée',
        en: 'Suitable exposure',
      },
      'features.carePreview.soil': {
        fr: 'Substrat',
        en: 'Soil',
      },
      'features.carePreview.soilValue': {
        fr: 'Drainage essentiel',
        en: 'Good drainage matters',
      },
      'features.carePreview.growth': {
        fr: 'Croissance',
        en: 'Growth',
      },
      'features.carePreview.growthValue': {
        fr: 'Suivi régulier',
        en: 'Regular monitoring',
      },

      'features.previewDiagnosticTitle': {
        fr: 'Diagnostic végétal',
        en: 'Plant diagnosis',
      },
      'features.previewDiagnosticSubtitle': {
        fr: 'Décrivez le problème observé',
        en: 'Describe the issue you noticed',
      },
      'features.previewGuided': {
        fr: 'Guidé',
        en: 'Guided',
      },
      'features.previewDiagnosticFootnote': {
        fr: 'Un questionnaire guidé, étape par étape.',
        en: 'A guided questionnaire, one step at a time.',
      },
      'features.diagnosticPreview.leaves': {
        fr: 'Feuilles abîmées ou jaunissantes',
        en: 'Damaged or yellowing leaves',
      },
      'features.diagnosticPreview.watering': {
        fr: 'Problème d’arrosage',
        en: 'Watering issue',
      },
      'features.diagnosticPreview.growth': {
        fr: 'Croissance inhabituelle',
        en: 'Unusual growth',
      },

      'features.previewCollectionTitle': {
        fr: 'Mon JardiDex',
        en: 'My JardiDex',
      },
      'features.previewCollectionSubtitle': {
        fr: 'Votre collection végétale',
        en: 'Your plant collection',
      },
      'features.previewCollectionCount': {
        fr: 'Ma collection',
        en: 'My collection',
      },
      'features.previewCollectionFootnote': {
        fr: 'Plantes ajoutées à votre JardiDex',
        en: 'Plants added to your JardiDex',
      },
      'features.collectionPreview.plantOne': {
        fr: 'Monstera',
        en: 'Monstera',
      },
      'features.collectionPreview.plantTwo': {
        fr: 'Lavande',
        en: 'Lavender',
      },
      'features.collectionPreview.plantThree': {
        fr: 'Basilic',
        en: 'Basil',
      },

      'features.previewFavoritesTitle': {
        fr: 'Mes favoris',
        en: 'My favorites',
      },
      'features.previewFavoritesSubtitle': {
        fr: 'Vos plantes préférées',
        en: 'Your favorite plants',
      },
      'features.previewFavoritesFootnote': {
        fr: 'Retrouvez rapidement les fiches enregistrées.',
        en: 'Quickly find your saved plant profiles.',
      },
      'features.favoritesPreview.plantOne': {
        fr: 'Monstera deliciosa',
        en: 'Monstera deliciosa',
      },
      'features.favoritesPreview.descriptionOne': {
        fr: 'Plante tropicale',
        en: 'Tropical plant',
      },
      'features.favoritesPreview.plantTwo': {
        fr: 'Lavandula angustifolia',
        en: 'Lavandula angustifolia',
      },
      'features.favoritesPreview.descriptionTwo': {
        fr: 'Plante aromatique',
        en: 'Aromatic plant',
      },

      'features.previewCalendarTitle': {
        fr: 'Au jardin cette saison',
        en: 'In the garden this season',
      },
      'features.previewCalendarSubtitle': {
        fr: 'Quelques idées de travaux',
        en: 'Ideas for seasonal tasks',
      },
      'features.previewCalendarFootnote': {
        fr: 'Des repères saisonniers pour mieux jardiner.',
        en: 'Seasonal guidance for better gardening.',
      },
      'features.calendarPreview.taskOne': {
        fr: 'Préparer les semis',
        en: 'Prepare seedlings',
      },
      'features.calendarPreview.taskTwo': {
        fr: 'Entretenir les arbustes',
        en: 'Maintain shrubs',
      },
      'features.calendarPreview.taskThree': {
        fr: 'Améliorer le sol',
        en: 'Improve the soil',
      },

      'features.previewWeatherTitle': {
        fr: 'Conditions du jardin',
        en: 'Garden conditions',
      },
      'features.previewWeatherSubtitle': {
        fr: 'Exemple de tableau météo',
        en: 'Weather preview',
      },
      'features.previewWeatherGarden': {
        fr: 'Aperçu météo',
        en: 'Weather overview',
      },
      'features.previewHumidity': {
        fr: 'Humidité',
        en: 'Humidity',
      },
      'features.previewWind': {
        fr: 'Vent',
        en: 'Wind',
      },
      'features.previewVariable': {
        fr: 'Variable',
        en: 'Variable',
      },
      'features.previewSky': {
        fr: 'Ciel',
        en: 'Sky',
      },
      'features.previewWeatherFootnote': {
        fr: 'Les données météo réelles nécessitent une source météo connectée.',
        en: 'Live weather data requires a connected weather source.',
      },

      'features.previewAssistantTitle': {
        fr: 'Assistant Arboria',
        en: 'Arboria assistant',
      },
      'features.previewAssistantOnline': {
        fr: 'Conseils jardinage',
        en: 'Gardening advice',
      },
      'features.previewAssistantQuestion': {
        fr: 'Comment prendre soin de mon basilic ?',
        en: 'How should I care for my basil?',
      },
      'features.previewAssistantAnswer': {
        fr: 'Placez-le à la lumière et gardez son substrat légèrement humide.',
        en: 'Place it in a bright spot and keep its soil slightly moist.',
      },
      'features.previewAssistantFootnote': {
        fr: 'Exemple de conversation illustrative.',
        en: 'Illustrative conversation example.',
      },

      'features.previewBotanicalTitle': {
        fr: 'Fiche botanique',
        en: 'Botanical profile',
      },
      'features.previewBotanicalSubtitle': {
        fr: 'Les informations essentielles',
        en: 'Essential information',
      },
      'features.previewBotanicalFootnote': {
        fr: 'Des informations regroupées dans une fiche claire.',
        en: 'Useful information gathered in one clear profile.',
      },
      'features.botanicalPreview.light': {
        fr: 'Lumière',
        en: 'Light',
      },
      'features.botanicalPreview.lightValue': {
        fr: 'Selon l’espèce',
        en: 'Depends on the species',
      },
      'features.botanicalPreview.water': {
        fr: 'Arrosage',
        en: 'Watering',
      },
      'features.botanicalPreview.waterValue': {
        fr: 'Modéré',
        en: 'Moderate',
      },
      'features.botanicalPreview.size': {
        fr: 'Taille',
        en: 'Size',
      },
      'features.botanicalPreview.sizeValue': {
        fr: 'Variable',
        en: 'Variable',
      },
      'features.botanicalPreview.climate': {
        fr: 'Climat',
        en: 'Climate',
      },
      'features.botanicalPreview.climateValue': {
        fr: 'À vérifier',
        en: 'Check requirements',
      },

      'features.previewTrackingTitle': {
        fr: 'Suivi de culture',
        en: 'Plant progress',
      },
      'features.previewTrackingSubtitle': {
        fr: 'Exemple de progression',
        en: 'Progress example',
      },
      'features.previewTrackingFootnote': {
        fr: 'Aperçu illustratif du suivi de vos plantes.',
        en: 'Illustrative preview of plant tracking.',
      },
      'features.trackingPreview.watering': {
        fr: 'Arrosage',
        en: 'Watering',
      },
      'features.trackingPreview.wateringStatus': {
        fr: 'Exemple',
        en: 'Example',
      },
      'features.trackingPreview.growth': {
        fr: 'Croissance',
        en: 'Growth',
      },
      'features.trackingPreview.growthStatus': {
        fr: 'Exemple',
        en: 'Example',
      },
      'features.trackingPreview.care': {
        fr: 'Entretien',
        en: 'Care',
      },
      'features.trackingPreview.careStatus': {
        fr: 'Exemple',
        en: 'Example',
      },

      'features.previewSharingTitle': {
        fr: 'Partager sa collection',
        en: 'Share your collection',
      },
      'features.previewSharingSubtitle': {
        fr: 'Une collection à découvrir',
        en: 'A collection to explore',
      },
      'features.previewSharingCollection': {
        fr: 'Ma collection végétale',
        en: 'My plant collection',
      },
      'features.previewSharingPlants': {
        fr: 'Une collection à découvrir',
        en: 'A collection to explore',
      },
      'features.previewSharingFootnote': {
        fr: 'Aperçu illustratif du partage de collection.',
        en: 'Illustrative collection-sharing preview.',
      },

      'features.previewListsTitle': {
        fr: 'Mes listes',
        en: 'My lists',
      },
      'features.previewListsSubtitle': {
        fr: 'Des plantes bien organisées',
        en: 'Plants, neatly organized',
      },
      'features.previewListsFootnote': {
        fr: 'Un aperçu de listes thématiques personnalisées.',
        en: 'A preview of custom themed lists.',
      },
      'features.listsPreview.toPlant': {
        fr: 'À planter',
        en: 'To plant',
      },
      'features.listsPreview.toPlantDescription': {
        fr: 'Pour vos prochains projets',
        en: 'For your next projects',
      },
      'features.listsPreview.toWater': {
        fr: 'À arroser',
        en: 'To water',
      },
      'features.listsPreview.toWaterDescription': {
        fr: 'À vérifier prochainement',
        en: 'Coming up for review',
      },
      'features.listsPreview.favorites': {
        fr: 'Mes préférées',
        en: 'My favorites',
      },
      'features.listsPreview.favoritesDescription': {
        fr: 'Les plantes à retrouver',
        en: 'Plants to revisit',
      },

      'features.previewRemindersTitle': {
        fr: 'Rappels d’entretien',
        en: 'Care reminders',
      },
      'features.previewRemindersSubtitle': {
        fr: 'Les bons gestes au bon moment',
        en: 'The right care at the right time',
      },
      'features.previewReminderWaterTitle': {
        fr: 'Vérifier l’arrosage',
        en: 'Check watering',
      },
      'features.previewReminderWaterDescription': {
        fr: 'Vérifiez l’humidité du substrat',
        en: 'Check soil moisture',
      },
      'features.previewReminderToday': {
        fr: 'Aujourd’hui',
        en: 'Today',
      },
      'features.previewRemindersFootnote': {
        fr: 'Exemple de rappel illustratif.',
        en: 'Illustrative reminder example.',
      },

      'features.previewHistoryTitle': {
        fr: 'Historique du jardin',
        en: 'Garden history',
      },
      'features.previewHistorySubtitle': {
        fr: 'Les dernières activités',
        en: 'Recent activities',
      },
      'features.previewHistoryFootnote': {
        fr: 'Exemple de chronologie pour le suivi du jardin.',
        en: 'Example timeline for garden tracking.',
      },
      'features.historyPreview.eventOne': {
        fr: 'Arrosage effectué',
        en: 'Watering completed',
      },
      'features.historyPreview.descriptionOne': {
        fr: 'Entretien courant des plantes',
        en: 'Routine plant care',
      },
      'features.historyPreview.dateOne': {
        fr: 'Aujourd’hui',
        en: 'Today',
      },
      'features.historyPreview.eventTwo': {
        fr: 'Nouvelle plante ajoutée',
        en: 'New plant added',
      },
      'features.historyPreview.descriptionTwo': {
        fr: 'Ajout à la collection',
        en: 'Added to the collection',
      },
      'features.historyPreview.dateTwo': {
        fr: 'Hier',
        en: 'Yesterday',
      },
      'features.historyPreview.eventThree': {
        fr: 'Entretien du jardin',
        en: 'Garden maintenance',
      },
      'features.historyPreview.descriptionThree': {
        fr: 'Taille et nettoyage',
        en: 'Pruning and cleaning',
      },
      'features.historyPreview.dateThree': {
        fr: 'Cette semaine',
        en: 'This week',
      },

      'features.ctaTitle': {
        fr: 'Votre jardin commence ici.',
        en: 'Your garden starts here.',
      },
      'features.ctaDescription': {
        fr: 'Découvrez Arboria et construisez votre univers végétal, plante après plante.',
        en: 'Discover Arboria and build your own plant world, one plant at a time.',
      },
      'features.freeApp': {
        fr: 'Application gratuite',
        en: 'Free application',
      },
      'features.ctaButton': {
        fr: 'Découvrir Arboria',
        en: 'Discover Arboria',
      },
    };

    const entry = translations[key];

    if (entry) {
      return this.isEnglish() ? entry.en : entry.fr;
    }

    return this.humanizeKey(key);
  }

  private isEnglish(): boolean {
    const service = this.languageService as unknown as {
      currentLanguage?: string;
      currentLang?: string;
      language?: string;
      langue?: string;
      getCurrentLanguage?: () => string;
      getLanguage?: () => string;
    };

    const possibleLanguages = [
      service.currentLanguage,
      service.currentLang,
      service.language,
      service.langue,
      service.getCurrentLanguage?.(),
      service.getLanguage?.(),
    ];

    return possibleLanguages.some(
      (language) =>
        typeof language === 'string' &&
        language.toLowerCase().startsWith('en'),
    );
  }

  private humanizeKey(key: string): string {
    const lastSegment = key.split('.').pop() ?? key;

    return lastSegment
      .replace(/([a-z0-9])([A-Z])/g, '$1 $2')
      .replace(/[-_]/g, ' ')
      .replace(/^./, (character) => character.toUpperCase());
  }

  // ------------------------------------------------------------
  // FILTRAGE
  // ------------------------------------------------------------

  get visibleFeatures(): Feature[] {
    if (!this.selectedCategory) {
      return this.features;
    }

    return this.features.filter(
      (feature) => feature.category === this.selectedCategory,
    );
  }

  selectCategory(categoryId: string): void {
    const categoryExists = this.categories.some(
      (category) => category.id === categoryId,
    );

    if (!categoryExists) {
      return;
    }

    // Si la catégorie cliquée est déjà active, revenir à Découverte.
    // Cela garantit qu'aucun clic ne laisse une sélection vide.
    this.selectedCategory =
      this.selectedCategory === categoryId
        ? 'discovery'
        : categoryId;
  }

  // ------------------------------------------------------------
  // NAVIGATION
  // ------------------------------------------------------------

  activateFeature(feature: Feature): void {
    if (!feature.route) {
      return;
    }

    void this.router.navigateByUrl(feature.route);
  }

  submitPlantSearch(): void {
    const query = this.plantSearch.trim();

    if (!query) {
      void this.router.navigateByUrl('/recherche');
      return;
    }

    void this.router.navigate(['/recherche'], {
      queryParams: { q: query },
    });
  }

  openPlant(plant: string): void {
    this.plantSearch = plant;

    void this.router.navigate(['/recherche'], {
      queryParams: { q: plant },
    });
  }

  // ------------------------------------------------------------
  // INTERACTIONS DU DIAGNOSTIC
  // ------------------------------------------------------------

  selectDiagnosticAnswer(answerId: string): void {
    const answerExists = this.diagnosticAnswers.some(
      (answer) => answer.id === answerId,
    );

    if (answerExists) {
      this.selectedDiagnosticAnswer = answerId;
    }
  }

  // ------------------------------------------------------------
  // TRACK BY
  // ------------------------------------------------------------

  trackByCategory(
    _index: number,
    category: FeatureCategory,
  ): string {
    return category.id;
  }

  trackByFeature(
    _index: number,
    feature: Feature,
  ): string {
    return feature.id;
  }
}