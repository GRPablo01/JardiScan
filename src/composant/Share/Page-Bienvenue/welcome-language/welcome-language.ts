// ============================================================
// 🌐 ARBORIA — LANGUAGE COMPONENT
// ============================================================
//
// • Angular standalone
// • Gestion FR / EN via LanguageService
// • Thème clair / sombre indépendant via ThemeService
// • Synchronisation automatique avec language$
// • Compatible avec le sélecteur FR / EN côte à côte
// • Nettoyage automatique de la souscription
// • Aucun changement de la logique existante
// ============================================================

import {
  Component,
  OnDestroy
} from '@angular/core';

import {
  CommonModule
} from '@angular/common';

import {
  Subscription
} from 'rxjs';

import {
  Icon
} from '../../../Public/icon/icon';

import {
  ThemeService
} from '../../../../../Backend/Services/theme.service';

import {
  LanguageService,
  Language
} from '../../../../../Backend/Services/language.service';

// ============================================================
// 🌿 COMPONENT
// ============================================================

@Component({
  selector: 'app-welcome-language',

  standalone: true,

  templateUrl: './welcome-language.html',

  styleUrls: ['./welcome-language.css'],

  imports: [
    CommonModule,
    Icon
  ]
})

export class WelcomeLanguage implements OnDestroy {

  // ==========================================================
  // 🎨 UI STATE
  // ==========================================================

  hover = false;

  hoverTheme = false;

  isOpen = false;

  // À ajouter dans le composant TypeScript si cette propriété
// n'existe pas déjà.

languageMenuOpen = false;

  // ==========================================================
  // 🌐 CURRENT LANGUAGE
  // ==========================================================

  currentLanguage: Language = 'fr';

  // ==========================================================
  // 🔄 LANGUAGE SUBSCRIPTION
  // ==========================================================

  private languageSubscription?: Subscription;

  // ==========================================================
  // 🧩 CONSTRUCTOR
  // ==========================================================

  constructor(
    public themeService: ThemeService,
    public languageService: LanguageService
  ) {

    // Récupération de la langue actuellement utilisée.
    this.currentLanguage =
      this.languageService.currentLanguage;

    // Synchronisation automatique lorsque la langue change.
    this.languageSubscription =
      this.languageService.language$.subscribe(
        (language: Language) => {
          this.currentLanguage = language;
        }
      );
  }

  // ==========================================================
  // 🌐 SET LANGUAGE
  // ==========================================================

  setLanguage(language: Language): void {

    if (language !== 'fr' && language !== 'en') {
      return;
    }

    // Le service central gère la langue et sa sauvegarde.
    this.languageService.setLanguage(language);

    // Ferme le menu éventuel.
    this.isOpen = false;
  }

  // ==========================================================
  // 🔄 TOGGLE LANGUAGE
  // ==========================================================

  toggleLanguage(event?: Event): void {

    event?.stopPropagation();

    this.languageService.toggleLanguage();

    this.isOpen = false;
  }

  // ==========================================================
  // 📂 TOGGLE MENU
  // ==========================================================

  toggleMenu(event?: Event): void {

    event?.stopPropagation();

    this.isOpen = !this.isOpen;
  }

  // ==========================================================
  // 🇫🇷 CHECK FRENCH
  // ==========================================================

  isFrench(): boolean {

    return this.currentLanguage === 'fr';
  }

  // ==========================================================
  // 🇬🇧 CHECK ENGLISH
  // ==========================================================

  isEnglish(): boolean {

    return this.currentLanguage === 'en';
  }

  // ==========================================================
  // 🌍 LANGUAGE NAME
  // ==========================================================

  getLanguageName(): string {

    return this.languageService.getLanguageName(
      this.currentLanguage
    );
  }

  // ==========================================================
  // 🚩 LANGUAGE FLAG
  // ==========================================================

  getLanguageFlag(): string {

    return this.languageService.getLanguageFlag(
      this.currentLanguage
    );
  }

  // ==========================================================
  // 🧹 DESTROY
  // ==========================================================

  ngOnDestroy(): void {

    this.languageSubscription?.unsubscribe();
  }
}
