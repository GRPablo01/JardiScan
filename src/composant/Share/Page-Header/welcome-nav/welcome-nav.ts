// welcome-nav.ts

import { CommonModule } from '@angular/common';
import {
  Component,
  HostListener,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import {
  NavigationEnd,
  Router,
  RouterLink,
  RouterLinkActive,
} from '@angular/router';
import { Subject, filter, takeUntil } from 'rxjs';

import { ThemeService } from '../../../../../Backend/Services/theme.service';
import { LanguageService } from '../../../../../Backend/Services/language.service';

import { WelcomeLogoComponent } from '../welcome-logo/welcome-logo';
import { WelcomeProfile1 } from '../welcome-profile1/welcome-profile1';

// ==========================================================
// TYPES DU DOCK
// ==========================================================

interface DockItem {
  route: string;
  fr: string;
  en: string;
  bg: string;
  border: string;
  text: string;
  paths: string[];
}

// ==========================================================
// COMPOSANT
// ==========================================================

@Component({
  selector: 'app-welcome-nav',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterLink,
    RouterLinkActive,
    WelcomeLogoComponent,
    WelcomeProfile1,
  ],
  templateUrl: './welcome-nav.html',
  styleUrl: './welcome-nav.css',
})
export class WelcomeNav implements OnInit, OnDestroy {

  // ========================================================
  // SERVICES
  // ========================================================

  constructor(
    public themeService: ThemeService,
    public languageService: LanguageService,
    private router: Router,
  ) {}

  // ========================================================
  // ÉTAT DU HEADER
  // ========================================================

  menuMobileOuvert = false;
  rechercheMobileOuverte = false;
  menuProfilOuvert = false;
  menuNotificationsOuvert = false;

  recherche = '';
  nombreNotifications = 0;

  private readonly destroy$ = new Subject<void>();

  // ========================================================
  // INITIALISATION
  // ========================================================

  ngOnInit(): void {
    this.router.events
      .pipe(
        filter(
          (event): event is NavigationEnd =>
            event instanceof NavigationEnd,
        ),
        takeUntil(this.destroy$),
      )
      .subscribe(() => {
        this.fermerTousLesMenus();
      });
  }

  // ========================================================
  // RECHERCHE DE PLANTES
  // ========================================================

  rechercherPlantes(): void {
    const terme = this.recherche.trim();

    void this.router.navigate(['/recherche'], {
      queryParams: terme ? { q: terme } : {},
    });

    this.fermerTousLesMenus();
  }

  ouvrirRechercheMobile(): void {
    this.rechercheMobileOuverte = !this.rechercheMobileOuverte;

    if (this.rechercheMobileOuverte) {
      this.menuMobileOuvert = false;
      this.menuProfilOuvert = false;
      this.menuNotificationsOuvert = false;
    }
  }

  fermerRechercheMobile(): void {
    this.rechercheMobileOuverte = false;
  }

  // ========================================================
  // MENU MOBILE
  // ========================================================

  basculerMenuMobile(): void {
    this.menuMobileOuvert = !this.menuMobileOuvert;

    if (this.menuMobileOuvert) {
      this.rechercheMobileOuverte = false;
      this.menuProfilOuvert = false;
      this.menuNotificationsOuvert = false;
    }
  }

  fermerMenuMobile(): void {
    this.menuMobileOuvert = false;
  }

  // ========================================================
  // MENU PROFIL
  // ========================================================

  basculerMenuProfil(): void {
    this.menuProfilOuvert = !this.menuProfilOuvert;

    if (this.menuProfilOuvert) {
      this.menuMobileOuvert = false;
      this.rechercheMobileOuverte = false;
      this.menuNotificationsOuvert = false;
    }
  }

  // ========================================================
  // NOTIFICATIONS
  // ========================================================

  basculerNotifications(): void {
    this.menuNotificationsOuvert = !this.menuNotificationsOuvert;

    if (this.menuNotificationsOuvert) {
      this.menuProfilOuvert = false;
      this.menuMobileOuvert = false;
      this.rechercheMobileOuverte = false;
    }
  }

  // ========================================================
  // FERMETURE GLOBALE DES MENUS
  // ========================================================

  fermerTousLesMenus(): void {
    this.menuMobileOuvert = false;
    this.rechercheMobileOuverte = false;
    this.menuProfilOuvert = false;
    this.menuNotificationsOuvert = false;
  }

  // ========================================================
  // RACCOURCIS CLAVIER
  // ========================================================

  @HostListener('document:keydown', ['$event'])
  gererRaccourcisClavier(event: KeyboardEvent): void {
    const cible = event.target as HTMLElement | null;

    const saisieEnCours =
      cible instanceof HTMLInputElement ||
      cible instanceof HTMLTextAreaElement ||
      cible instanceof HTMLSelectElement ||
      cible?.isContentEditable === true;

    // La touche "/" ouvre la recherche hors des champs de saisie.
    if (
      event.key === '/' &&
      !saisieEnCours &&
      !event.ctrlKey &&
      !event.metaKey &&
      !event.altKey
    ) {
      event.preventDefault();

      this.rechercheMobileOuverte = true;
      this.menuMobileOuvert = false;
      this.menuProfilOuvert = false;
      this.menuNotificationsOuvert = false;
    }

    // Échap ferme tous les menus.
    if (event.key === 'Escape') {
      this.fermerTousLesMenus();
    }
  }

  // ========================================================
  // CLIC EN DEHORS DU HEADER
  // ========================================================

  @HostListener('document:click', ['$event'])
  fermerMenusAuClicExterieur(event: MouseEvent): void {
    const cible = event.target as HTMLElement | null;

    if (!cible?.closest('app-header, app-welcome-nav')) {
      this.fermerTousLesMenus();
    }
  }

  // ========================================================
  // RESPONSIVE
  // Fermeture des menus mobiles à partir de 920px.
  // ========================================================

  @HostListener('window:resize')
  gererRedimensionnement(): void {
    if (typeof window !== 'undefined' && window.innerWidth >= 920) {
      this.menuMobileOuvert = false;
      this.rechercheMobileOuverte = false;
    }
  }

  // ========================================================
  // THÈME
  // ========================================================

  basculerTheme(): void {
    this.themeService.toggleTheme();
  }

  // ========================================================
  // LANGUE
  // ========================================================

  basculerLangue(): void {
    const langueActuelle = this.languageService.currentLanguage;

    this.languageService.setLanguage(
      langueActuelle === 'fr' ? 'en' : 'fr',
    );
  }

  // ========================================================
  // DOCK MOBILE / TABLETTE
  // ========================================================

  trackByRoute(_index: number, item: DockItem): string {
    return item.route;
  }

  /**
   * Getter dynamique :
   * les couleurs sont recalculées lorsque le thème change.
   *
   * Les propriétés BGO, BRO, TXO, BGR, BRR, TXR,
   * BGV, BRV, TXV, BGG, BRG et TXG doivent exister
   * dans ton ThemeService.
   */
  get items(): DockItem[] {
    const t = this.themeService;

    return [
      {
        route: '/recherche',
        fr: 'Recherche',
        en: 'Search',
  
        bg: `linear-gradient(to bottom, ${t.BGO}, color-mix(in srgb, ${t.BGO} 80%, black))`,
        border: t.BRO,
        text: t.TXO,
  
        paths: [
          'M12 7v13',
          'M12 8C9 4.5 5.8 5 3.5 6v13c3-1.5 6-.8 8.5 1',
          'M12 8c3-3.5 6.2-3 8.5-2v13c-3-1.5-6-.8-8.5 1',
          'M7 9.5c1.2 0 2.2.3 3 1',
          'M17 9.5c-1.2 0-2.2.3-3 1',
        ],
      },

      {
        route: '/favoris',
        fr: 'Mes favoris',
        en: 'My favorites',

        bg: `linear-gradient(to bottom, ${t.BGR}, #B92D87)`,
        border: t.BRR,
        text: t.TXR,

        paths: [
          'M20.8 8.8c0 5.2-8.8 10.2-8.8 10.2S3.2 14 3.2 8.8A4.6 4.6 0 0 1 12 6.5a4.6 4.6 0 0 1 8.8 2.3Z',
        ],
      },

      {
        route: '/assistant',
        fr: 'Assistant',
        en: 'Assistant',

        bg: `linear-gradient(to bottom, ${t.BGV}, #7904D3)`,
        border: t.BRV,
        text: t.TXV,

        paths: [
          'M12 3.5a8.5 8.5 0 0 0-7.2 13l-1 4 4.2-1A8.5 8.5 0 1 0 12 3.5Z',
          'M8 10h8',
          'M8 14h5',
        ],
      },

      {
        route: '/diagnostic',
        fr: 'Diagnostic',
        en: 'Diagnosis',

        bg: `linear-gradient(to bottom, ${t.BGG}, #087653)`,
        border: t.BRG,
        text: t.TXG,

        paths: [
          'M20 4c-8.5 0-14 3.5-14 10a6 6 0 0 0 6 6c6.5 0 8-7.5 8-16Z',
          'M4 21c3-5 6-8 11-11',
          'm9 14 2 2',
        ],
      },
    ];
  }

  // ========================================================
  // DESTRUCTION
  // ========================================================

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
