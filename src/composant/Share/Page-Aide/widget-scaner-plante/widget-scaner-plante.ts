import { Component } from '@angular/core';
import { CommonModule, Location } from '@angular/common';

import { ThemeService } from '../../../../../Backend/Services/theme.service';
import { LanguageService } from '../../../../../Backend/Services/language.service';

import { RouterLink } from "@angular/router";
import { HeaderBienvenue } from "../../Page-Bienvenue/header-bienvenue/header-bienvenue";

@Component({
  selector: 'app-widget-scaner-plante',
  standalone: true,
  imports: [CommonModule, RouterLink, HeaderBienvenue],
  templateUrl: './widget-scaner-plante.html',
  styleUrl: './widget-scaner-plante.css',
})
export class WidgetScanerPlante {

  constructor(
    private location: Location,
    public themeService: ThemeService,
    public languageService: LanguageService,
  ) {}

  /**
   * Retourne l'utilisateur sur la page précédente
   */
  retour(): void {
    this.location.back();
  }

  /**
   * 🌐 Langue actuelle
   */
  get currentLanguage(): 'fr' | 'en' {
    return this.languageService.currentLanguage;
  }
}