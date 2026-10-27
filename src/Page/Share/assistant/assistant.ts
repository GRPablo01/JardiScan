
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
import { NoCompatible } from '../../../composant/no-compatible/no-compatible';
import { ThemeService } from '../../../../Backend/Services/theme.service';
import { Header } from '../../../composant/Public/header/header';
import { Footer } from '../../../composant/Public/footer/footer';
import { WidgetAssistant } from '../../../composant/Share/Page-Assistant/widget-assistant/widget-assistant';



@Component({
  selector: 'app-assistant',
  standalone: true,

  imports: [
    CommonModule,
    HttpClientModule,
    FormsModule,
    NoCompatible,
    Header,
    Footer,
    WidgetAssistant
],

  templateUrl: './assistant.html',
  styleUrls: ['./assistant.css']
})
export class Assistant implements OnInit, OnDestroy {

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
    this.titleService.setTitle('Arboria | Accueil');

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
