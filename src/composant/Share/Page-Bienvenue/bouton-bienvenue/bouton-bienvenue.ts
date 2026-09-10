import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ThemeService } from '../../../../../Backend/Services/theme.service';
import { LanguageService } from '../../../../../Backend/Services/language.service';



@Component({
  selector: 'app-bouton-bienvenue',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink
  ],
  templateUrl: './bouton-bienvenue.html'
})
export class BoutonBienvenue {

  /**
   * 🎨 ThemeService
   */
  readonly themeService = inject(ThemeService);

  /**
   * 🌐 LanguageService
   */
  readonly languageService = inject(LanguageService);

  /**
   * 🌐 Changer la langue
   */
  toggleLanguage(): void {
    this.languageService.toggleLanguage();
  }

  /**
   * 🏷️ Texte connexion
   */
  get loginText(): string {
    return this.languageService.is('fr')
      ? 'Se connecter'
      : 'Log in';
  }

  /**
   * 🏷️ Texte inscription
   */
  get registerText(): string {
    return this.languageService.is('fr')
      ? 'Créer un compte'
      : 'Create account';
  }

  /**
   * 🏷️ Label connexion
   */
  get loginLabel(): string {
    return this.languageService.is('fr')
      ? 'Se connecter à JardiScan'
      : 'Log in to JardiScan';
  }

  /**
   * 🏷️ Label inscription
   */
  get registerLabel(): string {
    return this.languageService.is('fr')
      ? 'Créer un compte JardiScan'
      : 'Create a JardiScan account';
  }

  /**
   * 🏷️ Tooltip connexion
   */
  get loginTitle(): string {
    return this.languageService.is('fr')
      ? 'Se connecter'
      : 'Log in';
  }

  /**
   * 🏷️ Tooltip inscription
   */
  get registerTitle(): string {
    return this.languageService.is('fr')
      ? 'Créer un compte'
      : 'Create account';
  }

  /**
   * 🏷️ Label langue
   */
  get languageLabel(): string {
    return this.languageService.is('fr')
      ? 'Passer en anglais'
      : 'Switch to French';
  }

  /**
   * 🏳️ Drapeau de la prochaine langue
   */
  get nextLanguageFlag(): string {
    return this.languageService.is('fr')
      ? '🇬🇧'
      : '🇫🇷';
  }
}