
import {
  Component,
  EventEmitter,
  Output
} from '@angular/core';

import { RouterLink } from '@angular/router';

import { WelcomeLanguage } from '../welcome-language/welcome-language';
import { Theme } from '../../Icon/theme/theme';
import { CommonModule } from '@angular/common';
import { ThemeService } from '../../../../../Backend/Services/theme.service';
import { LanguageService } from '../../../../../Backend/Services/language.service';

@Component({
  selector: 'app-welcome-actions',
  standalone: true,
  imports: [
    RouterLink,
    WelcomeLanguage,
    Theme,
    CommonModule,
  ],
  templateUrl: './welcome-actions.html',
  styleUrl: './welcome-actions.css'
})
export class WelcomeActionsComponent {


  constructor(
          public themeService: ThemeService,
      
          // 🌐 Service de langue
          public languageService: LanguageService
        ) {}

  /**
   * Événement transmis au composant parent
   * pour fermer les menus ouverts.
   */
  @Output()
  closeMenus = new EventEmitter<void>();

  /**
   * État du menu mobile.
   * Conservé pour ne pas casser les usages existants.
   */
  menuMobileOuvert = false;
  inscriptionSurvol = false

  /**
   * Langue actuellement utilisée.
   *
   * Valeur par défaut conservée en français.
   * Si la langue est gérée dans WelcomeLanguage,
   * relie cette valeur à son état existant.
   */
  langueActuelle: 'fr' | 'en' = 'fr';

  /**
   * Ferme les menus et avertit le composant parent.
   */
  fermerMenus(): void {
    this.menuMobileOuvert = false;
    this.closeMenus.emit();
  }

  /**
   * Ouvre ou ferme le menu mobile.
   */
  toggleMenuMobile(event: Event): void {
    event.stopPropagation();

    this.menuMobileOuvert = !this.menuMobileOuvert;

    if (this.menuMobileOuvert) {
      this.closeMenus.emit();
    }
  }
}
