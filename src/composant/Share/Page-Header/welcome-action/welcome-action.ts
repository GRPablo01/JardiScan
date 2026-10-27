import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { WelcomeLanguage } from '../welcome-language/welcome-language';
import { WelcomeProfile } from '../welcome-profile/welcome-profile';
import { WelcomeNotifications } from '../welcome-notifications/welcome-notifications';
import { WelcomeThemeToggle } from '../welcome-theme-toggle/welcome-theme-toggle';



@Component({
  selector: 'app-welcome-action',
  standalone: true,
  imports: [
    CommonModule,
    WelcomeLanguage,
    WelcomeProfile,
    WelcomeNotifications,
    WelcomeThemeToggle
  ],
  templateUrl: './welcome-action.html',
  styleUrl: './welcome-action.css'
})
export class WelcomeAction {
  langueActuelle: 'fr' | 'en' = 'fr';
  nombreNotifications = 0;

  /**
   * Conserve ici ta méthode existante si elle est déjà
   * connectée à ton LanguageService.
   */
  changerLangue(langue: 'fr' | 'en'): void {
    if (this.langueActuelle === langue) {
      return;
    }

    this.langueActuelle = langue;

    // Relier ici le changement à la méthode réelle
    // de ton LanguageService.
  }
}