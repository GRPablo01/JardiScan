import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { WidgetScanerPlante } from '../../composant/Share/Page-Aide/widget-scaner-plante/widget-scaner-plante';
import { ThemeService } from '../../../Backend/Services/theme.service';




@Component({
  selector: 'app-Scaner-plante',
  standalone: true,
  imports: [
    CommonModule,
    HttpClientModule,
    FormsModule,
   WidgetScanerPlante
],
  templateUrl: './Scaner-plante.html',
  styleUrls: ['./Scaner-plante.css'],
})
export class ScanerPlante implements OnInit {

  isLoaded: boolean = false;
  isLoggedIn: boolean = false;

  constructor(
    private titleService: Title,
    public themeService: ThemeService
  ) {}

  ngOnInit(): void {
    // 🧠 Titre de la page
    this.titleService.setTitle('JardiScan | Nouveauté');

    // 👤 Vérification de la connexion utilisateur
    const utilisateurString = localStorage.getItem('utilisateur');
    if (utilisateurString) this.isLoggedIn = true;

    // 🎨 Appliquer le thème depuis le ThemeService (lecture localStorage)
    this.themeService.applyTheme(this.themeService.isDarkMode);

    // 🎯 Initialisation de la scrollbar
    this.initScrollbar();

    // ⏳ Loader
    setTimeout(() => {
      this.isLoaded = true;
    }, 300);
  }

  /**
   * 🎯 Initialise la scrollbar dynamique et écoute les changements de thème
   */
  private initScrollbar(): void {
    // Couleurs initiales
    this.updateScrollbarColors(this.themeService.isDarkMode);

    // Abonnement aux changements de thème
    this.themeService.themeChange$.subscribe(isDark => {
      this.updateScrollbarColors(isDark);
    });
  }

  /**
   * 🎨 Met à jour les couleurs de la scrollbar
   */
  private updateScrollbarColors(isDark: boolean): void {
    const root = document.documentElement;
    if (isDark) {
      root.style.setProperty('--scroll-track', '#1B241C');
      root.style.setProperty('--scroll-thumb', '#5FA58E');
      root.style.setProperty('--scroll-thumb-hover', '#5FA58E');
    } else {
      root.style.setProperty('--scroll-track', '#F3F7F2');
      root.style.setProperty('--scroll-thumb', '#4F8061');
      root.style.setProperty('--scroll-thumb-hover', '#4F8061');
    }
  }
}