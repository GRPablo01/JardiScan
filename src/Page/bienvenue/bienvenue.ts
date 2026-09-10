import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { ThemeService } from '../../../Backend/Services/theme.service';
import { HeaderBienvenue } from '../../composant/Share/Page-Bienvenue/header-bienvenue/header-bienvenue';
import { Welcome } from '../../composant/Share/Page-Bienvenue/welcome/welcome';
import { Fonctionnalite } from '../../composant/Share/Page-Bienvenue/fonctionnalite/fonctionnalite';
import { Statistiques } from '../../composant/Share/Page-Bienvenue/statistiques/statistiques';
import { Pourquoi } from '../../composant/Share/Page-Bienvenue/pourquoi/pourquoi';
import { Role } from '../../composant/Share/Page-Bienvenue/role/role';
import { TicketWelcome } from '../../composant/Share/Page-Bienvenue/ticket-welcome/ticket-welcome';
import { FooterBienvenue } from "../../composant/Share/Page-Bienvenue/footer-bienvenue/footer-bienvenue";













@Component({
  selector: 'app-accueil',
  standalone: true,
  imports: [
    CommonModule,
    HttpClientModule,
    FormsModule,
    Welcome,
    HeaderBienvenue,
    Fonctionnalite,
    Statistiques,
    Pourquoi,
    Role,
    TicketWelcome,
    FooterBienvenue
],
  templateUrl: './bienvenue.html',
  styleUrls: ['./bienvenue.css'],
})
export class Bienvenue implements OnInit {

  isLoaded: boolean = false;
  isLoggedIn: boolean = false;

  constructor(
    private titleService: Title,
    public themeService: ThemeService
  ) {}

  ngOnInit(): void {
    // 🧠 Titre de la page
    this.titleService.setTitle('JardiScan | Bienvenue');

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