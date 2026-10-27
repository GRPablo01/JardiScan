
import {
  Component,
  OnInit,
  OnDestroy,
  HostListener,
  DestroyRef,
  inject
} from '@angular/core';

import { Title } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ThemeService } from '../../../Backend/Services/theme.service';
import { HeaderBienvenue } from '../../composant/Share/Page-Bienvenue/header-bienvenue/header-bienvenue';
import { FooterBienvenue } from '../../composant/Share/Page-Bienvenue/footer-bienvenue/footer-bienvenue';
import { NoCompatible } from '../../composant/no-compatible/no-compatible';
import { HeroSearch } from '../../composant/Share/Page-Recherche/hero-search/hero-search';
import { ExploreCatalogue } from '../../composant/Share/Page-Recherche/explore-catalogue/explore-catalogue';
import { RechercheBesoins } from '../../composant/Share/Page-Recherche/recherche-besoins/recherche-besoins';
import { PourquoiRecherche } from '../../composant/Share/Page-Recherche/pourquoi-recherche/pourquoi-recherche';
import { CommentRecherche } from '../../composant/Share/Page-Recherche/comment-recherche/comment-recherche';






@Component({
  selector: 'app-bienvenue',
  standalone: true,

  imports: [
    CommonModule,
    HttpClientModule,
    FormsModule,
    HeaderBienvenue,
    FooterBienvenue,
    NoCompatible,
    HeroSearch,
    CommentRecherche,
    ExploreCatalogue,
    RechercheBesoins,
    PourquoiRecherche,
],

  templateUrl: './widget-search.html',
  styleUrls: ['./widget-search.css']
})
export class WidgetSearch implements OnInit, OnDestroy {

  private readonly destroyRef = inject(DestroyRef);

  private loaderTimer?: ReturnType<typeof setTimeout>;

  isLoaded = false;
  isLoggedIn = false;

  largeurCompatible = true;

  constructor(
    private readonly titleService: Title,
    public readonly themeService: ThemeService
  ) {}

  // ============================================================
  // INITIALISATION
  // ============================================================

  ngOnInit(): void {
    this.titleService.setTitle('Arboria | Explication Recherche');

    // Vérification de la compatibilité de l'écran.
    this.updateLargeurCompatible();

    // Vérification de la connexion utilisateur.
    this.checkUserSession();

    // Application du thème actuel.
    this.themeService.applyTheme(
      this.themeService.isDarkMode
    );

    // Initialisation des couleurs de la scrollbar.
    this.updateScrollbarColors(
      this.themeService.isDarkMode
    );

    // Écoute des changements de thème avec nettoyage automatique.
    this.themeService.themeChange$
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((isDark: boolean) => {
        this.updateScrollbarColors(isDark);
      });

    // Affichage du contenu après le chargement.
    this.loaderTimer = setTimeout(() => {
      this.isLoaded = true;
    }, 300);
  }

  // ============================================================
  // RESPONSIVE : SEUIL DE 325PX
  // ============================================================

  @HostListener('window:resize')
  onResize(): void {
    this.updateLargeurCompatible();
  }

  private updateLargeurCompatible(): void {
    this.largeurCompatible = window.innerWidth >= 325;
  }

  // ============================================================
  // SESSION UTILISATEUR
  // ============================================================

  private checkUserSession(): void {
    try {
      const utilisateurString =
        localStorage.getItem('utilisateur') ??
        localStorage.getItem('user');

      this.isLoggedIn = !!utilisateurString;
    } catch {
      this.isLoggedIn = false;
    }
  }

  // ============================================================
  // SCROLLBAR : COULEURS CLAIRES ET SOMBRES
  // ============================================================
  
  private updateScrollbarColors(isDark: boolean): void {
    const root = document.documentElement;

    if (isDark) {
      root.style.setProperty('--scroll-track', '#232B22');
      root.style.setProperty('--scroll-thumb', '#5FA58E');
      root.style.setProperty('--scroll-thumb-hover', '#70B99F');
    } else {
      root.style.setProperty('--scroll-track', '#F8FAFC');
      root.style.setProperty('--scroll-thumb', '#4F8061');
      root.style.setProperty('--scroll-thumb-hover', '#3D6B4F');
    }
  }

  // ============================================================
  // NETTOYAGE
  // ============================================================

  ngOnDestroy(): void {
    if (this.loaderTimer) {
      clearTimeout(this.loaderTimer);
    }
  }
}
