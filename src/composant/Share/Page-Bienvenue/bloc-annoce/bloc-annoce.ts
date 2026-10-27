
import {
  Component,
  HostListener,
  OnDestroy,
  OnInit,
} from '@angular/core';

import { CommonModule } from '@angular/common';

import { Subscription } from 'rxjs';

import { ThemeService } from '../../../../../Backend/Services/theme.service';
import { Theme } from '../../Icon/theme/theme';
import { Language2 } from '../../Icon/language/language';

type MenuType = 'how' | 'products' | null;
type MenuActif = Exclude<MenuType, null>;
type Langue = 'fr' | 'en';

@Component({
  selector: 'app-bloc-annoce',
  standalone: true,
  imports: [
    CommonModule,
    Theme,
    Language2,
  ],
  templateUrl: './bloc-annoce.html',
  styleUrl: './bloc-annoce.css',
})
export class BlocAnnoce implements OnInit, OnDestroy {

  // =========================================================
  // ÉTAT
  // =========================================================

  themeSombre = false;
  annonceVisible = true;

  menuOuvert: MenuType = null;

  menuMobileOuvert = false;
  menuMobileSection: MenuType = null;

  langueActuelle: Langue = 'fr';

  private themeSubscription?: Subscription;

  // =========================================================
  // CONSTRUCTEUR
  // =========================================================

  constructor(
    public themeService: ThemeService,
  ) {}

  // =========================================================
  // INITIALISATION
  // =========================================================

  ngOnInit(): void {
    this.initialiserTheme();
    this.initialiserLangue();
    this.ecouterTheme();
  }

  ngOnDestroy(): void {
    this.themeSubscription?.unsubscribe();
  }

  // =========================================================
  // COULEURS DE L'ANNONCE
  // =========================================================

  get ANNOUNCEMENT(): string {
    return this.themeSombre
      ? '#1C3027'
      : '#244536';
  }

  get ANNOUNCEMENT_HOVER(): string {
    return this.themeSombre
      ? '#2B4938'
      : '#315B45';
  }

  get ANNOUNCEMENT_TEXT(): string {
    return '#F2F4F0';
  }

  get ANNOUNCEMENT_ACCENT(): string {
    return '#C4D9B9';
  }

  get ANNOUNCEMENT_BORDER(): string {
    return this.themeSombre
      ? '#344D3E'
      : '#3B604B';
  }

  // =========================================================
  // INITIALISATION DU THÈME
  // =========================================================

  private initialiserTheme(): void {
    if (typeof window === 'undefined') {
      return;
    }

    const themeEnregistre = localStorage.getItem('theme');

    this.themeSombre =
      themeEnregistre === 'dark' ||
      (
        themeEnregistre === null &&
        document.documentElement.classList.contains('dark')
      );
  }

  private ecouterTheme(): void {
    const service = this.themeService as any;

    /*
     * Compatible avec le ThemeService existant :
     * - isDarkMode$ si disponible ;
     * - darkMode s'il s'agit d'un BehaviorSubject.
     *
     * Si aucune de ces propriétés n'existe, le thème
     * reste initialisé depuis localStorage et le document.
     */

    const observable =
      service.isDarkMode$ ??
      service.darkMode?.asObservable?.();

    if (!observable?.subscribe) {
      return;
    }

    this.themeSubscription = observable.subscribe(
      (valeur: unknown) => {
        if (typeof valeur === 'boolean') {
          this.themeSombre = valeur;
        } else if (
          valeur === 'dark' ||
          valeur === 'light'
        ) {
          this.themeSombre = valeur === 'dark';
        }
      },
    );
  }

  // =========================================================
  // INITIALISATION DE LA LANGUE
  // =========================================================

  private initialiserLangue(): void {
    if (typeof window === 'undefined') {
      return;
    }

    const langueEnregistree = localStorage.getItem(
      'jardiscan_language',
    );

    if (
      langueEnregistree === 'fr' ||
      langueEnregistree === 'en'
    ) {
      this.langueActuelle = langueEnregistree;
      return;
    }

    const langueNavigateur =
      navigator.language.toLowerCase();

    this.langueActuelle =
      langueNavigateur.startsWith('en') ? 'en' : 'fr';
  }

  // =========================================================
  // CHANGEMENT DE LANGUE
  // =========================================================

  changerLangue(langue: Langue): void {
    if (this.langueActuelle === langue) {
      return;
    }

    this.langueActuelle = langue;

    if (typeof window !== 'undefined') {
      localStorage.setItem(
        'jardiscan_language',
        langue,
      );
    }
  }

  // =========================================================
  // BARRE D'ANNONCE
  // =========================================================

  fermerAnnonce(): void {
    this.annonceVisible = false;
  }

  afficherAnnonce(): void {
    this.annonceVisible = true;
  }

  // =========================================================
  // NAVIGATION DESKTOP
  // =========================================================

  toggleMenu(menu: MenuActif): void {
    this.menuOuvert =
      this.menuOuvert === menu ? null : menu;

    this.menuMobileOuvert = false;
    this.menuMobileSection = null;
  }

  ouvrirMenuSurvol(menu: MenuActif): void {
    if (
      typeof window === 'undefined' ||
      window.innerWidth < 1024 ||
      this.menuMobileOuvert
    ) {
      return;
    }

    this.menuOuvert = menu;
    this.menuMobileSection = null;
  }

  fermerMenuSurvol(menu: MenuActif): void {
    if (this.menuOuvert === menu) {
      this.menuOuvert = null;
    }
  }

  // =========================================================
  // NAVIGATION MOBILE / TABLETTE
  // =========================================================

  toggleMenuMobile(): void {
    this.menuMobileOuvert = !this.menuMobileOuvert;
    this.menuOuvert = null;

    if (!this.menuMobileOuvert) {
      this.menuMobileSection = null;
    }
  }

  toggleSectionMobile(section: MenuActif): void {
    this.menuMobileSection =
      this.menuMobileSection === section
        ? null
        : section;
  }

  // =========================================================
  // FERMETURE DES MENUS
  // =========================================================

  fermerMenus(): void {
    this.menuOuvert = null;
    this.menuMobileOuvert = false;
    this.menuMobileSection = null;
  }

  @HostListener('document:click', ['$event'])
  fermerAuClicExterieur(event: MouseEvent): void {
    const target = event.target;

    if (!(target instanceof Element)) {
      return;
    }

    /*
     * Conserve le comportement du header existant.
     * Le clic sur la barre d'annonce ne ferme les menus
     * que si le lien déclenche explicitement fermerMenus().
     */

    if (!target.closest('app-header-bienvenue')) {
      this.fermerMenus();
    }
  }

  @HostListener('document:keydown.escape')
  fermerAvecEscape(): void {
    this.fermerMenus();
  }

  // =========================================================
  // REDIMENSIONNEMENT
  // =========================================================

  @HostListener('window:resize')
  gererRedimensionnement(): void {
    if (typeof window === 'undefined') {
      return;
    }

    if (window.innerWidth >= 1024) {
      this.menuMobileOuvert = false;
      this.menuMobileSection = null;
    } else {
      this.menuOuvert = null;
    }
  }

  // =========================================================
  // PROFIL UTILISATEUR
  // =========================================================

  ouvrirProfil(): void {
    // À relier à la logique de profil ou au Router existant.
  }

  gererClicExterieur(event: MouseEvent): void {
    this.fermerAuClicExterieur(event);
  }

  // =========================================================
  // CHANGEMENT DE THÈME
  // =========================================================

  toggleTheme(): void {
    const nouveauTheme = !this.themeSombre;

    this.themeSombre = nouveauTheme;

    if (typeof window === 'undefined') {
      return;
    }

    localStorage.setItem(
      'theme',
      nouveauTheme ? 'dark' : 'light',
    );

    this.appliquerTheme();

    /*
     * Le ThemeService reste la source de vérité du thème
     * lorsqu'il expose setDark() ou setLight().
     */

    const service = this.themeService as any;

    if (nouveauTheme && typeof service.setDark === 'function') {
      service.setDark();
    } else if (
      !nouveauTheme &&
      typeof service.setLight === 'function'
    ) {
      service.setLight();
    }
  }

  private appliquerTheme(): void {
    if (typeof document === 'undefined') {
      return;
    }

    document.documentElement.classList.toggle(
      'dark',
      this.themeSombre,
    );
  }
}
