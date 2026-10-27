
import { Component, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ThemeService } from '../../../../../Backend/Services/theme.service';
import { Theme } from '../../Icon/theme/theme';
import { Language2 } from '../../Icon/language/language';
import { BlocAnnoce } from '../bloc-annoce/bloc-annoce';

import { WelcomeNavComponent } from '../welcome-nav/welcome-nav';
import { WelcomeActionsComponent } from '../welcome-actions/welcome-actions';
import { WelcomeNavMobile } from '../welcome-nav-mobile/welcome-nav-mobile';
import { WelcomeLogoComponent } from '../../Page-Header/welcome-logo/welcome-logo';

type MenuType = 'how' | 'products' | null;
type MenuActif = Exclude<MenuType, null>;
type Langue = 'fr' | 'en';

@Component({
  selector: 'app-header-bienvenue',
  standalone: true,
  imports: [
    CommonModule,
    Theme,
    Language2,
    BlocAnnoce,
    WelcomeLogoComponent,
    WelcomeNavComponent,
    WelcomeActionsComponent,
    WelcomeNavMobile
],
  templateUrl: './header-bienvenue.html',
  styleUrl: './header-bienvenue.css',
})
export class HeaderBienvenue {

  // =========================================================
  // ÉTAT DU HEADER
  // =========================================================

  themeSombre = false;
  annonceVisible = true;

  menuOuvert: MenuType = null;

  menuMobileOuvert = false;
  menuMobileSection: MenuType = null;
  afficherBlocAnnonce = false;

  // =========================================================
  // LANGUE
  // =========================================================

  langueActuelle: Langue = 'fr';

  // =========================================================
  // CONSTRUCTEUR
  // =========================================================

  constructor(
    public themeService: ThemeService,
  ) {
    this.initialiserTheme();
    this.initialiserLangue();
  }

  // =========================================================
  // COULEURS DE LA BARRE D'ANNONCE
  // =========================================================

  get ANNOUNCEMENT(): string {
    return this.themeSombre ? '#1C3027' : '#244536';
  }

  get ANNOUNCEMENT_HOVER(): string {
    return this.themeSombre ? '#2B4938' : '#315B45';
  }

  get ANNOUNCEMENT_TEXT(): string {
    return '#F2F4F0';
  }

  get ANNOUNCEMENT_ACCENT(): string {
    return '#C4D9B9';
  }

  get ANNOUNCEMENT_BORDER(): string {
    return this.themeSombre ? '#344D3E' : '#3B604B';
  }



  private annonceTimeout?: ReturnType<typeof setTimeout>;

  ngOnInit(): void {
    this.annonceTimeout = setTimeout(() => {
      this.afficherBlocAnnonce = true;
    }, 10_000);
  }

  ngOnDestroy(): void {
    if (this.annonceTimeout) {
      clearTimeout(this.annonceTimeout);
    }
  }
  
  // =========================================================
  // INITIALISATION DU THÈME
  // =========================================================

  private initialiserTheme(): void {
    if (typeof window === 'undefined') {
      return;
    }

    const themeEnregistre = localStorage.getItem('theme');

    this.themeSombre = themeEnregistre === 'dark';
  }

  // =========================================================
  // INITIALISATION DE LA LANGUE
  // =========================================================

  private initialiserLangue(): void {
    if (typeof window === 'undefined') {
      return;
    }

    const langueEnregistree = localStorage.getItem(
      'jardiscan_language'
    );

    if (
      langueEnregistree === 'fr' ||
      langueEnregistree === 'en'
    ) {
      this.langueActuelle = langueEnregistree;
    }
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
      localStorage.setItem('jardiscan_language', langue);
    }

    /*
     * Raccorde ici ton LanguageService existant.
     *
     * Exemple, si ton service expose setLanguage() :
     * this.languageService.setLanguage(langue);
     *
     * Le service doit être injecté dans le constructeur.
     */
  }

  // =========================================================
  // BARRE D'ANNONCE
  // =========================================================

  fermerAnnonce(): void {
    this.annonceVisible = false;
  }

  // =========================================================
  // NAVIGATION DESKTOP
  // =========================================================

  toggleMenu(menu: MenuActif): void {
    this.menuOuvert = menu;
    this.menuMobileOuvert = false;
    this.menuMobileSection = null;
  }

  ouvrirMenuSurvol(menu: MenuActif): void {
    if (typeof window === 'undefined') {
      return;
    }

    if (window.innerWidth < 1024 || this.menuMobileOuvert) {
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
      this.menuMobileSection === section ? null : section;
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
    // À relier à ta logique de profil ou à ton Router existant.
  }

  gererClicExterieur(event: MouseEvent): void {
    this.fermerAuClicExterieur(event);
  }

  // =========================================================
  // CHANGEMENT DE THÈME
  // =========================================================

  toggleTheme(): void {
    this.themeSombre = !this.themeSombre;

    if (typeof window === 'undefined') {
      return;
    }

    localStorage.setItem(
      'theme',
      this.themeSombre ? 'dark' : 'light'
    );

    this.appliquerTheme();
  }

  private appliquerTheme(): void {
    if (typeof document === 'undefined') {
      return;
    }

    document.documentElement.classList.toggle(
      'dark',
      this.themeSombre
    );
  }
}
