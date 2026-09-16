import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { ThemeService } from '../../../Backend/Services/theme.service';
import { Login } from '../../composant/Auth/login/login';
import { Register } from "../../composant/Auth/register/register";













@Component({
  selector: 'app-inscription',
  standalone: true,
  imports: [
    CommonModule,
    HttpClientModule,
    FormsModule,
    Login,
    Register
],
  templateUrl: './inscription.html',
  styleUrls: ['./inscription.css'],
})
export class Inscription implements OnInit {

  isLoaded: boolean = false;
  isLoggedIn: boolean = false;

  constructor(
    private titleService: Title,
    public themeService: ThemeService
  ) {}

  ngOnInit(): void {
    // 🧠 Titre de la page
    this.titleService.setTitle('JardiScan | Inscription');

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
      root.style.setProperty('--scroll-track', '#18181B');
      root.style.setProperty('--scroll-thumb', '#5FA58E');
      root.style.setProperty('--scroll-thumb-hover', '#5FA58E');
    } else {
      root.style.setProperty('--scroll-track', '#F8FAFC');
      root.style.setProperty('--scroll-thumb', '#4F8061');
      root.style.setProperty('--scroll-thumb-hover', '#4F8061');
    }
  }
}