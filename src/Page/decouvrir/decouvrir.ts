// ============================================================
// ARBORIA — PAGE DÉCOUVRIR
// Fichier : decouvrir.ts
//
// Angular Standalone + Tailwind CSS + Font Awesome
// • Présentation complète de l'application
// • Traductions françaises et anglaises
// • Thème clair / sombre via ThemeService
// • Synchronisation avec LanguageService
// • Navigation Angular
// • Compatible avec le template decouvrir.html
// ============================================================

import { Location, NgStyle } from '@angular/common';
import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { Subscription } from 'rxjs';

import { ThemeService } from '../../../Backend/Services/theme.service';
import { LanguageService } from '../../../Backend/Services/language.service';

type Langue = 'fr' | 'en';

@Component({
  selector: 'app-decouvrir',
  standalone: true,
  imports: [NgStyle, RouterLink],
  templateUrl: './decouvrir.html',
  styleUrl: './decouvrir.css',
})
export class Decouvrir implements OnInit, OnDestroy {
  readonly themeService = inject(ThemeService);

  private readonly location = inject(Location);
  private readonly router = inject(Router);
  private readonly languageService = inject(LanguageService);

  private languageSubscription?: Subscription;

  langue: Langue = 'fr';

  private readonly traductions = {
    fr: {
      retour: 'Retour',
      headerBouton: 'Créer un compte',
      headerBoutonCourt: 'S’inscrire',

      badge: 'Le monde végétal à portée de main',
      heroTitre1: 'La nature mérite',
      heroTitre2: 'toute votre attention.',
      heroDescription:
        'Arboria vous accompagne pour découvrir les plantes, comprendre leurs besoins et prendre soin de votre jardin au fil des saisons. Un espace simple, accessible et pensé pour tous les amoureux du végétal.',
      heroBouton: 'Créer mon compte',
      heroSecondaire: 'Découvrir le fonctionnement',
      avantage1: 'Recherche de plantes',
      avantage2: 'Conseils de jardinage',
      avantage3: 'Application gratuite',

      bandeau1Titre: 'Explorez librement',
      bandeau1Description:
        'Recherchez les plantes qui éveillent votre curiosité.',
      bandeau2Titre: 'Apprenez à votre rythme',
      bandeau2Description:
        'Retrouvez des informations utiles et faciles à consulter.',
      bandeau3Titre: 'Prenez soin du vivant',
      bandeau3Description:
        'Faites évoluer vos habitudes de jardinage au fil des saisons.',

      photoLegendeTitre: 'La nature, à votre rythme',
      photoLegendeDescription:
        'Une découverte après l’autre, une plante à la fois.',

      introEyebrow: 'Bienvenue dans Arboria',
      introTitre1: 'Mieux connaître les plantes pour',
      introTitre2: 'mieux en prendre soin.',
      introDescription1:
        'Arboria est un espace dédié aux plantes et au jardin. Retrouvez les végétaux qui vous intéressent, découvrez leurs caractéristiques et apprenez à mieux comprendre leurs besoins.',
      introDescription2:
        'Que vous débutiez ou que vous cultiviez depuis des années, Arboria vous aide à développer vos connaissances, à retrouver des informations utiles et à enrichir votre expérience du jardinage.',
      introLien: 'Découvrir comment ça fonctionne',

      etapesEyebrow: 'Simple, naturellement',
      etapesTitre: 'Le jardinage devient plus accessible.',
      etapesDescription:
        'Pas besoin de maîtriser la botanique pour commencer. Explorez les plantes, consultez leurs informations et avancez à votre rythme.',
      etape1Titre: 'Recherchez une plante',
      etape1Description:
        'Explorez directement le catalogue et retrouvez les plantes qui vous intéressent grâce à une recherche simple et accessible.',
      etape2Titre: 'Découvrez ses besoins',
      etape2Description:
        'Consultez les informations disponibles sur ses caractéristiques, son environnement, sa culture et ses besoins d’entretien.',
      etape3Titre: 'Prenez-en soin',
      etape3Description:
        'Retrouvez des conseils utiles et des recommandations pour accompagner vos plantes au quotidien et au fil des saisons.',

      galerieEyebrow: 'L’inspiration au naturel',
      galerieTitre: 'Chaque plante raconte une histoire.',
      galerieDescription:
        'Des feuillages délicats aux jardins luxuriants, laissez-vous inspirer par la diversité et la beauté du monde végétal.',
      galerie1Categorie: 'Paysages vivants',
      galerie2Categorie: 'Beauté botanique',
      galerie3Categorie: 'Jardin intérieur',
      galerieImage1: 'Des instants au cœur de la nature',
      galerieImage2: 'La beauté des feuillages',
      galerieImage3: 'Un peu de nature chez soi',
      galerieImage4: 'Cultiver au fil des saisons',

      fonctionsEyebrow: 'Un espace pensé pour vous',
      fonctionsTitre: 'Tout votre univers végétal, au même endroit.',
      fonctionsDescription:
        'Découvrez les différents outils d’Arboria pour rechercher des plantes, mieux comprendre leurs besoins, obtenir des conseils et conserver vos découvertes.',

      fonction1Titre: 'Recherche de plantes',
      fonction1Description:
        'Accédez directement aux plantes et explorez le catalogue grâce à la recherche. Retrouvez les végétaux qui vous intéressent sans devoir débloquer des packs pour commencer.',

      fonction2Titre: 'Fiches végétales',
      fonction2Description:
        'Consultez les informations disponibles pour comprendre les caractéristiques des plantes, leur environnement et leurs besoins d’entretien.',

      fonction3Titre: 'Diagnostic guidé',
      fonction3Description:
        'Répondez à des questions simples pour décrire une difficulté rencontrée dans votre jardin et orienter vos recherches vers des pistes adaptées.',

      fonction4Titre: 'Conseils saisonniers',
      fonction4Description:
        'Découvrez les gestes de jardinage à envisager selon la période de l’année, les conditions de culture et les besoins de vos plantes.',

      fonction5Titre: 'Assistant jardinage',
      fonction5Description:
        'Obtenez une aide complémentaire pour vos questions sur les plantes, leur entretien et les bonnes pratiques de jardinage.',

      fonction6Titre: 'Votre collection végétale',
      fonction6Description:
        'Avec le JardiDex, conservez vos plantes favorites dans votre collection personnelle et retrouvez plus facilement vos découvertes.',

      publicEyebrow: 'Pour tous les amoureux du végétal',
      publicTitre: 'Un compagnon pour chaque jardinier.',
      publicDescription:
        'Arboria s’adapte à votre niveau, à votre curiosité et à votre façon de vivre le jardin. Découvrez de nouvelles plantes et développez vos connaissances à votre rythme.',

      public1Titre: 'Les débutants',
      public1Description:
        'Des informations accessibles pour découvrir les plantes, comprendre leurs besoins et apprendre les premiers gestes.',

      public2Titre: 'Les passionnés',
      public2Description:
        'Un espace pour approfondir vos connaissances et retrouver les informations utiles à vos cultures.',

      public3Titre: 'Les curieux',
      public3Description:
        'Explorez de nouvelles espèces, découvrez leurs particularités et élargissez votre univers végétal.',

      public4Titre: 'Les jardiniers du quotidien',
      public4Description:
        'Des repères pratiques pour entretenir vos plantes et faire évoluer votre jardin au fil du temps.',

      philoEyebrow: 'Notre philosophie',
      philoTitre1: 'Cultiver la connaissance,',
      philoTitre2: 'faire grandir la nature.',
      philoDescription:
        'Nous croyons que prendre soin du vivant commence par mieux le comprendre. Arboria rend les connaissances sur les plantes plus accessibles et vous accompagne dans une relation plus attentive avec votre jardin.',

      ctaTitre: 'Votre prochaine découverte commence ici.',
      ctaDescription:
        'Explorez le monde végétal, enrichissez vos connaissances et avancez à votre rythme avec Arboria. Votre jardin a encore beaucoup à vous apprendre.',
      ctaBouton: 'Créer mon compte',

      footer: 'Arboria — Cultivez votre curiosité, prenez soin du vivant.',
    },

    en: {
      retour: 'Back',
      headerBouton: 'Create an account',
      headerBoutonCourt: 'Sign up',

      badge: 'The plant world at your fingertips',
      heroTitre1: 'Nature deserves',
      heroTitre2: 'your full attention.',
      heroDescription:
        'Arboria helps you discover plants, understand their needs and care for your garden throughout the seasons. A simple, accessible space designed for everyone who loves plants.',
      heroBouton: 'Create my account',
      heroSecondaire: 'Discover how it works',
      avantage1: 'Plant search',
      avantage2: 'Gardening advice',
      avantage3: 'Free application',

      bandeau1Titre: 'Explore freely',
      bandeau1Description:
        'Search for plants that spark your curiosity.',
      bandeau2Titre: 'Learn at your own pace',
      bandeau2Description:
        'Find useful information that is easy to explore.',
      bandeau3Titre: 'Care for living things',
      bandeau3Description:
        'Develop your gardening habits throughout the seasons.',

      photoLegendeTitre: 'Nature at your own pace',
      photoLegendeDescription:
        'One discovery at a time, one plant at a time.',

      introEyebrow: 'Welcome to Arboria',
      introTitre1: 'Understand plants better to',
      introTitre2: 'care for them better.',
      introDescription1:
        'Arboria is a space dedicated to plants and gardening. Find the plants you are interested in, discover their characteristics and learn to understand their needs.',
      introDescription2:
        'Whether you are just starting out or have been gardening for years, Arboria helps you build your knowledge, find useful information and enrich your gardening experience.',
      introLien: 'Discover how it works',

      etapesEyebrow: 'Naturally simple',
      etapesTitre: 'Gardening becomes more accessible.',
      etapesDescription:
        'You do not need to be a botanist to get started. Explore plants, learn about their needs and progress at your own pace.',
      etape1Titre: 'Search for a plant',
      etape1Description:
        'Explore the catalogue directly and find the plants that interest you through a simple, accessible search.',
      etape2Titre: 'Discover its needs',
      etape2Description:
        'Explore available information about plant characteristics, growing environments and care requirements.',
      etape3Titre: 'Care for your plants',
      etape3Description:
        'Find useful advice and recommendations to help you care for your plants every day and throughout the seasons.',

      galerieEyebrow: 'Naturally inspiring',
      galerieTitre: 'Every plant tells a story.',
      galerieDescription:
        'From delicate foliage to lush gardens, discover the diversity and beauty of the plant world.',
      galerie1Categorie: 'Living landscapes',
      galerie2Categorie: 'Botanical beauty',
      galerie3Categorie: 'Indoor gardening',
      galerieImage1: 'Moments in the heart of nature',
      galerieImage2: 'The beauty of foliage',
      galerieImage3: 'A little nature at home',
      galerieImage4: 'Growing through the seasons',

      fonctionsEyebrow: 'Designed around you',
      fonctionsTitre: 'Your plant world, all in one place.',
      fonctionsDescription:
        'Discover Arboria’s tools to search for plants, understand their needs, find useful advice and keep track of your discoveries.',

      fonction1Titre: 'Plant search',
      fonction1Description:
        'Access plants directly and explore the catalogue through search. Find the plants that interest you without having to unlock packs to begin.',

      fonction2Titre: 'Plant profiles',
      fonction2Description:
        'Explore available information to understand plant characteristics, growing environments and care requirements.',

      fonction3Titre: 'Guided diagnosis',
      fonction3Description:
        'Answer simple questions to describe a problem in your garden and guide your research towards relevant possibilities.',

      fonction4Titre: 'Seasonal advice',
      fonction4Description:
        'Discover gardening tasks to consider depending on the time of year, growing conditions and your plants’ needs.',

      fonction5Titre: 'Gardening assistant',
      fonction5Description:
        'Get additional help with questions about plants, their care and good gardening practices.',

      fonction6Titre: 'Your plant collection',
      fonction6Description:
        'Use the JardiDex to save your favourite plants in your personal collection and revisit your discoveries more easily.',

      publicEyebrow: 'For everyone who loves plants',
      publicTitre: 'A companion for every gardener.',
      publicDescription:
        'Arboria adapts to your experience, curiosity and way of enjoying your garden. Discover new plants and expand your knowledge at your own pace.',

      public1Titre: 'Beginners',
      public1Description:
        'Accessible information to discover plants, understand their needs and learn the essential first steps.',

      public2Titre: 'Plant enthusiasts',
      public2Description:
        'A space to deepen your knowledge and revisit useful information about your plants.',

      public3Titre: 'Curious minds',
      public3Description:
        'Explore new species, discover their unique characteristics and expand your plant knowledge.',

      public4Titre: 'Everyday gardeners',
      public4Description:
        'Practical guidance to care for your plants and help your garden evolve over time.',

      philoEyebrow: 'Our philosophy',
      philoTitre1: 'Grow your knowledge,',
      philoTitre2: 'help nature thrive.',
      philoDescription:
        'We believe caring for living things starts with understanding them. Arboria makes plant knowledge more accessible and helps you build a more thoughtful relationship with your garden.',

      ctaTitre: 'Your next discovery starts here.',
      ctaDescription:
        'Explore the plant world, expand your knowledge and progress at your own pace with Arboria. Your garden still has so much to teach you.',
      ctaBouton: 'Create my account',

      footer: 'Arboria — Grow your curiosity, care for living things.',
    },
  } as const;

  get texte() {
    return this.traductions[this.langue];
  }

  ngOnInit(): void {
    this.mettreAJourLangue();

    const service = this.languageService as unknown as Record<
      string,
      unknown
    >;

    const flux =
      service['languageChange$'] ??
      service['langueChange$'] ??
      service['currentLanguage$'] ??
      service['language$'] ??
      service['langue$'];

    if (
      flux &&
      typeof (flux as { subscribe?: unknown }).subscribe === 'function'
    ) {
      this.languageSubscription = (
        flux as {
          subscribe: (
            valeur: (valeur: unknown) => void,
          ) => Subscription;
        }
      ).subscribe((valeur: unknown) => {
        this.langue = this.normaliserLangue(valeur);
      });
    }
  }

  ngOnDestroy(): void {
    this.languageSubscription?.unsubscribe();
  }

  retourPagePrecedente(): void {
    if (
      typeof window !== 'undefined' &&
      window.history.length > 1
    ) {
      this.location.back();
      return;
    }

    void this.router.navigateByUrl('/');
  }

  private mettreAJourLangue(): void {
    const service = this.languageService as unknown as Record<
      string,
      unknown
    >;

    const valeur =
      service['currentLanguage'] ??
      service['currentLang'] ??
      service['langueActuelle'] ??
      service['langue'] ??
      service['lang'] ??
      service['language'];

    this.langue = this.normaliserLangue(valeur);
  }

  private normaliserLangue(valeur: unknown): Langue {
    if (typeof valeur === 'string') {
      return valeur.toLowerCase().startsWith('en') ? 'en' : 'fr';
    }

    if (valeur && typeof valeur === 'object') {
      const objet = valeur as Record<string, unknown>;

      const langue =
        objet['lang'] ??
        objet['language'] ??
        objet['code'] ??
        objet['value'];

      if (typeof langue === 'string') {
        return langue.toLowerCase().startsWith('en') ? 'en' : 'fr';
      }
    }

    return 'fr';
  }
}