
import {
  Component,
  ElementRef,
  EventEmitter,
  HostListener,
  Output
} from '@angular/core';

import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

import { ThemeService } from '../../../../../Backend/Services/theme.service';
import { LanguageService } from '../../../../../Backend/Services/language.service';

type MenuNavigation = 'decouvrir' | 'ressources' | 'aide';

type Langue = 'fr' | 'en';

interface ElementMenu {
  title: string;
  description: string;
  href: string;
  icon: string;
}

interface GroupeMenu {
  title: string;
  items: ElementMenu[];
}

interface TraductionsNavigation {
  discover: string;
  features: string;
  help: string;
  contact: string;
  explore: string;
  featuresHeading: string;
  featuresIntro: string;
  plantsHeading: string;
  adviceHeading: string;
  organizeHeading: string;
  quickAccess: string;
  gardenAtYourPace: string;
  quickFeatureIntro: string;
  discoverFeatures: string;
  helpCenter: string;
  helpCardDescription: string;
  featuresFooter: string;
  helpHeading: string;
  helpIntro: string;
  gettingStarted: string;
  plantsAndGarden: string;
  guidesAndLearning: string;
  needHelp: string;
  quickHelpIntro: string;
  openHelpCenter: string;
  contactUs: string;
  contactDescription: string;
  helpFooter: string;
  faq: string;
}

const TRADUCTIONS: Record<Langue, TraductionsNavigation> = {
  fr: {
    discover: 'Découvrir',
    features: 'Fonctionnalités',
    help: 'Aide',
    contact: 'Contact',

    explore: 'EXPLORER ARBORIA',
    featuresHeading: 'Tout pour prendre soin de votre jardin',
    featuresIntro:
      'Retrouvez les outils essentiels pour découvrir les plantes, obtenir des conseils et organiser votre jardin.',
    plantsHeading: 'Découvrir les plantes',
    adviceHeading: 'Conseils et diagnostic',
    organizeHeading: 'Organiser son jardin',
    quickAccess: 'Accès rapides',
    gardenAtYourPace: 'Un jardin à votre rythme',
    quickFeatureIntro:
      'Découvrez les fonctionnalités Arboria et avancez à votre rythme, selon les besoins de votre jardin.',
    discoverFeatures: 'Découvrir les fonctionnalités',
    helpCenter: 'Centre d’aide',
    helpCardDescription:
      'Retrouvez les réponses à vos questions et les informations utiles.',
    featuresFooter:
      'Arboria vous accompagne pour mieux connaître vos plantes et prendre soin de votre jardin.',
    helpHeading: 'Comment pouvons-nous vous aider ?',
    helpIntro:
      'Accédez aux informations utiles pour découvrir Arboria, utiliser ses fonctionnalités et entretenir vos plantes.',
    gettingStarted: 'Bien commencer',
    plantsAndGarden: 'Plantes et jardin',
    guidesAndLearning: 'Guides et ressources',
    needHelp: 'Besoin d’aide ?',
    quickHelpIntro:
      'Consultez les ressources disponibles pour trouver rapidement une réponse.',
    openHelpCenter: 'Consulter l’aide',
    contactUs: 'Nous contacter',
    contactDescription:
      'Une question ou une remarque ? Écrivez-nous.',
    helpFooter:
      'Retrouvez les informations utiles pour profiter pleinement d’Arboria.',
    faq: 'Questions fréquentes'
  },

  en: {
    discover: 'Discover',
    features: 'Features',
    help: 'Help',
    contact: 'Contact',

    explore: 'EXPLORE ARBORIA',
    featuresHeading: 'Everything you need to care for your garden',
    featuresIntro:
      'Discover plants, get helpful advice and organize your garden with Arboria.',
    plantsHeading: 'Discover plants',
    adviceHeading: 'Advice and diagnosis',
    organizeHeading: 'Organize your garden',
    quickAccess: 'Quick access',
    gardenAtYourPace: 'A garden at your own pace',
    quickFeatureIntro:
      'Explore Arboria features and care for your garden at your own pace.',
    discoverFeatures: 'Explore features',
    helpCenter: 'Help center',
    helpCardDescription:
      'Find answers to your questions and useful information.',
    featuresFooter:
      'Arboria helps you learn about your plants and care for your garden.',
    helpHeading: 'How can we help you?',
    helpIntro:
      'Find useful information about Arboria, its features and plant care.',
    gettingStarted: 'Getting started',
    plantsAndGarden: 'Plants and garden',
    guidesAndLearning: 'Guides and resources',
    needHelp: 'Need help?',
    quickHelpIntro:
      'Explore the available resources to find an answer quickly.',
    openHelpCenter: 'Visit help center',
    contactUs: 'Contact us',
    contactDescription:
      'Have a question or suggestion? Get in touch.',
    helpFooter:
      'Find the information you need to get the most out of Arboria.',
    faq: 'Frequently asked questions'
  }
};

@Component({
  selector: 'app-welcome-nav',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink
  ],
  templateUrl: './welcome-nav.html',
  styleUrl: './welcome-nav.css'
})
export class WelcomeNavComponent {
  constructor(
    public themeService: ThemeService,
    public languageService: LanguageService,
    private elementRef: ElementRef<HTMLElement>
  ) {}

  @Output() closeMenus = new EventEmitter<void>();

  menuOuvert: MenuNavigation | null = null;
  menuMobileOuvert = false;

  /**
   * Traductions utilisées par le template.
   *
   * La langue est lue depuis le LanguageService lorsqu'une propriété
   * de langue courante est disponible, avec un repli sur le stockage
   * local et, enfin, le français.
   */
  get t(): TraductionsNavigation {
    const service = this.languageService as unknown as Record<
      string,
      unknown
    >;

    const valeurService =
      service['currentLanguage'] ??
      service['currentLang'] ??
      service['language'] ??
      service['langue'] ??
      service['lang'];

    const valeurStockee =
      typeof localStorage !== 'undefined'
        ? localStorage.getItem('jardiscan_language')
        : null;

    const valeur = String(
      valeurService ?? valeurStockee ?? 'fr'
    ).toLowerCase();

    return TRADUCTIONS[
      valeur.startsWith('en') ? 'en' : 'fr'
    ];
  }

  get themeSombre(): boolean {
    return (
      typeof document !== 'undefined' &&
      document.documentElement.classList.contains('dark')
    );
  }

  /**
   * Groupes de fonctionnalités.
   * Les liens restent des ancres de la page d'accueil.
   */
  readonly featureGroups: GroupeMenu[] = [
    {
      title: 'plantsHeading',
      items: [
        {
          title: 'Recherche de plantes',
          description:
            'Explorez les plantes et trouvez celles qui correspondent à votre jardin.',
          href: '#recherche',
          icon: 'search'
        },
        {
          title: 'JardiDex',
          description:
            'Retrouvez et organisez les plantes de votre collection.',
          href: '#jardidex',
          icon: 'leaf'
        }
      ]
    },
    {
      title: 'adviceHeading',
      items: [
        {
          title: 'Diagnostic',
          description:
            'Répondez à quelques questions pour mieux comprendre les besoins de votre plante.',
          href: '#diagnostic',
          icon: 'diagnostic'
        },
        {
          title: 'Conseils personnalisés',
          description:
            'Découvrez des conseils pour prendre soin de vos plantes.',
          href: '#assistant',
          icon: 'leaf'
        }
      ]
    },
    {
      title: 'organizeHeading',
      items: [
        {
          title: 'Entretien du jardin',
          description:
            'Retrouvez les informations utiles pour entretenir vos plantes.',
          href: '#fonctionnalites',
          icon: 'calendar'
        },
        {
          title: 'Conseils de saison',
          description:
            'Adaptez vos gestes aux besoins de votre jardin au fil des saisons.',
          href: '#saison',
          icon: 'document'
        }
      ]
    }
  ];

  /**
   * Groupes du centre d'aide.
   */
  readonly helpGroups: GroupeMenu[] = [
    {
      title: 'gettingStarted',
      items: [
        {
          title: 'Découvrir Arboria',
          description:
            'Comprenez les possibilités offertes par l’application.',
          href: '#home',
          icon: 'grid'
        },
        {
          title: 'Bien démarrer',
          description:
            'Découvrez les principales fonctionnalités et leurs usages.',
          href: '#fonctionnalites',
          icon: 'user'
        }
      ]
    },
    {
      title: 'plantsAndGarden',
      items: [
        {
          title: 'Recherche de plantes',
          description:
            'Apprenez à parcourir les plantes et leurs informations.',
          href: '#recherche',
          icon: 'search'
        },
        {
          title: 'Diagnostic végétal',
          description:
            'Orientez vos recherches grâce au questionnaire de diagnostic.',
          href: '#diagnostic',
          icon: 'diagnostic'
        }
      ]
    },
    {
      title: 'guidesAndLearning',
      items: [
        {
          title: 'Guides pratiques',
          description:
            'Retrouvez les conseils utiles pour prendre soin de votre jardin.',
          href: '#fonctionnalites',
          icon: 'document'
        },
        {
          title: 'Questions fréquentes',
          description:
            'Consultez les réponses aux questions les plus courantes.',
          href: '#faq',
          icon: 'question'
        }
      ]
    }
  ];

  /**
   * Ouvre le méga-menu correspondant.
   */
  ouvrirMenuSurvol(menu: MenuNavigation): void {
    this.menuOuvert = menu;
  }

  /**
   * Conservée pour la compatibilité avec les templates existants.
   */
  fermerMenuSurvol(): void {
    // Le menu reste ouvert pendant le déplacement vers son contenu.
  }

  /**
   * Ouvre ou ferme un méga-menu au clic.
   */
  toggleMegaMenu(
    menu: MenuNavigation,
    event: Event
  ): void {
    event.stopPropagation();

    this.menuOuvert =
      this.menuOuvert === menu ? null : menu;
  }

  fermerMegaMenu(): void {
    this.menuOuvert = null;
  }

  toggleMenuMobile(event: Event): void {
    event.stopPropagation();

    this.menuMobileOuvert = !this.menuMobileOuvert;

    if (!this.menuMobileOuvert) {
      this.menuOuvert = null;
    }
  }

  fermerMenuMobile(): void {
    this.menuMobileOuvert = false;
    this.menuOuvert = null;
  }

  /**
   * Ferme les menus puis notifie le parent seulement si nécessaire.
   */
  fermerMenus(): void {
    const menusEtaientOuverts =
      this.menuOuvert !== null ||
      this.menuMobileOuvert;

    this.menuOuvert = null;
    this.menuMobileOuvert = false;

    if (menusEtaientOuverts) {
      this.closeMenus.emit();
    }
  }

  /**
   * Style de base et état actif des boutons de méga-menu.
   */
  styleBoutonMenu(
    menu: MenuNavigation
  ): Record<string, string> {
    const actif = this.menuOuvert === menu;

    return {
      color: actif
        ? this.themeService.Primary
        : this.themeService.TX0,

      backgroundColor: actif
        ? this.themeService.BG2
        : 'transparent',

      borderColor: actif
        ? this.themeService.BR2
        : 'transparent',

      '--tw-ring-color': this.themeService.Primary,
      '--tw-ring-offset-color': this.themeService.BG1
    };
  }

  /**
   * Style des éléments au survol.
   * Le CSS complète cet état avec :hover et :focus-visible.
   */
  styleElementSurvol(): Record<string, string> {
    return {
      color: this.themeService.TX0,
      '--element-hover-bg': this.themeService.BG2,
      '--element-hover-border': this.themeService.BR2
    };
  }

  styleIcone(): Record<string, string> {
    return {
      color: this.themeService.Primary,
      backgroundColor: this.themeService.BG2
    };
  }

  styleBoutonPrincipal(): Record<string, string> {
    return {
      color: this.themeService.BG1,
      backgroundColor: this.themeService.Primary,
      '--tw-ring-color': this.themeService.Primary,
      '--tw-ring-offset-color': this.themeService.BG1
    };
  }

  styleCarteSecondaire(): Record<string, string> {
    return {
      color: this.themeService.TX0,
      backgroundColor: this.themeService.BG1,
      borderColor: this.themeService.BR2,
      '--tw-ring-color': this.themeService.Primary,
      '--tw-ring-offset-color': this.themeService.BG1
    };
  }

  /**
   * Clic extérieur : ne ferme rien lorsque le clic se trouve
   * à l'intérieur de la navigation ou d'un de ses méga-menus.
   */
  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent): void {
    const cible = event.target;

    if (!(cible instanceof Node)) {
      return;
    }

    if (this.elementRef.nativeElement.contains(cible)) {
      return;
    }

    if (
      this.menuOuvert !== null ||
      this.menuMobileOuvert
    ) {
      this.fermerMenus();
    }
  }

  /**
   * Fermeture au clavier.
   */
  @HostListener('document:keydown.escape')
  onEscapeKey(): void {
    if (
      this.menuOuvert !== null ||
      this.menuMobileOuvert
    ) {
      this.fermerMenus();
    }
  }

  /**
   * Ferme le menu mobile au retour au format ordinateur.
   */
  @HostListener('window:resize')
  onWindowResize(): void {
    if (
      typeof window !== 'undefined' &&
      window.innerWidth >= 1063 &&
      this.menuMobileOuvert
    ) {
      this.menuMobileOuvert = false;
      this.menuOuvert = null;
    }
  }
}
