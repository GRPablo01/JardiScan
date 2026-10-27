
import { CommonModule } from '@angular/common';
import { Component, HostListener, OnDestroy, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NavigationEnd, Router, RouterLink, RouterLinkActive } from '@angular/router';
import { Subject, filter, takeUntil } from 'rxjs';

import { ThemeService } from '../../../../Backend/Services/theme.service';
import { LanguageService } from '../../../../Backend/Services/language.service';
import { WelcomeLogoComponent } from '../../Share/Page-Header/welcome-logo/welcome-logo';
import { WelcomeNav } from '../../Share/Page-Header/welcome-nav/welcome-nav';
import { WelcomeAction } from '../../Share/Page-Header/welcome-action/welcome-action';






@Component({
  selector: 'app-header',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterLink,
    RouterLinkActive,
    WelcomeLogoComponent,
    WelcomeNav,
    WelcomeAction
],
  templateUrl: './header.html',
  styleUrl: './header.css'
})
export class Header implements OnInit, OnDestroy {

  // ==========================================================
  // SERVICES
  // ==========================================================

  constructor(
    public themeService: ThemeService,
    public languageService: LanguageService,
    private router: Router
  ) {}

  // ==========================================================
  // ÉTAT DU HEADER
  // ==========================================================

  menuMobileOuvert = false;
  rechercheMobileOuverte = false;
  menuProfilOuvert = false;
  menuNotificationsOuvert = false;

  recherche = '';

  nombreNotifications = 0;

  private readonly destroy$ = new Subject<void>();

  // ==========================================================
  // INITIALISATION
  // ==========================================================

  ngOnInit(): void {
    this.router.events
      .pipe(
        filter((event): event is NavigationEnd => event instanceof NavigationEnd),
        takeUntil(this.destroy$)
      )
      .subscribe(() => {
        this.fermerTousLesMenus();
      });
  }

  // ==========================================================
  // RECHERCHE DE PLANTES
  // ==========================================================

  rechercherPlantes(): void {
    const terme = this.recherche.trim();

    if (!terme) {
      this.router.navigate(['/recherche']);
      this.fermerTousLesMenus();
      return;
    }

    this.router.navigate(['/recherche'], {
      queryParams: {
        q: terme
      }
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

  // ==========================================================
  // MENU MOBILE
  // ==========================================================

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

  // ==========================================================
  // MENU PROFIL
  // ==========================================================

  basculerMenuProfil(): void {
    this.menuProfilOuvert = !this.menuProfilOuvert;

    if (this.menuProfilOuvert) {
      this.menuMobileOuvert = false;
      this.rechercheMobileOuverte = false;
      this.menuNotificationsOuvert = false;
    }
  }

  // ==========================================================
  // NOTIFICATIONS
  // ==========================================================

  basculerNotifications(): void {
    this.menuNotificationsOuvert = !this.menuNotificationsOuvert;

    if (this.menuNotificationsOuvert) {
      this.menuProfilOuvert = false;
      this.menuMobileOuvert = false;
      this.rechercheMobileOuverte = false;
    }
  }

  // ==========================================================
  // FERMETURE GLOBALE DES MENUS
  // ==========================================================

  fermerTousLesMenus(): void {
    this.menuMobileOuvert = false;
    this.rechercheMobileOuverte = false;
    this.menuProfilOuvert = false;
    this.menuNotificationsOuvert = false;
  }

  // ==========================================================
  // RACCOURCI CLAVIER : "/" POUR LA RECHERCHE
  // ==========================================================

  @HostListener('document:keydown', ['$event'])
  gererRaccourcisClavier(event: KeyboardEvent): void {
    const cible = event.target as HTMLElement | null;

    const saisieEnCours =
      cible instanceof HTMLInputElement ||
      cible instanceof HTMLTextAreaElement ||
      cible instanceof HTMLSelectElement ||
      cible?.isContentEditable === true;

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

    if (event.key === 'Escape') {
      this.fermerTousLesMenus();
    }
  }

  // ==========================================================
  // CLIC EN DEHORS DU HEADER
  // ==========================================================

  @HostListener('document:click', ['$event'])
  fermerMenusAuClicExterieur(event: MouseEvent): void {
    const cible = event.target as HTMLElement | null;

    if (!cible?.closest('app-header')) {
      this.fermerTousLesMenus();
    }
  }

  // ==========================================================
  // RESPONSIVE : FERMETURE DU MENU MOBILE
  // ==========================================================

  @HostListener('window:resize')
  gererRedimensionnement(): void {
    if (typeof window !== 'undefined' && window.innerWidth >= 919) {
      this.menuMobileOuvert = false;
      this.rechercheMobileOuverte = false;
    }
  }

  // ==========================================================
  // THÈME
  // ==========================================================

  basculerTheme(): void {
    this.themeService.toggleTheme();
  }

  // ==========================================================
  // LANGUE
  // ==========================================================

  basculerLangue(): void {
    const langueActuelle = this.languageService.currentLanguage;

    if (langueActuelle === 'fr') {
      this.languageService.setLanguage('en');
    } else {
      this.languageService.setLanguage('fr');
    }
  }

  // ==========================================================
  // DESTRUCTION
  // ==========================================================

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
