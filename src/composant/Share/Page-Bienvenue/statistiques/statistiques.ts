import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ThemeService } from '../../../../../Backend/Services/theme.service';
import { LanguageService } from '../../../../../Backend/Services/language.service';

@Component({
  selector: 'app-statistiques',
  imports: [CommonModule],
  templateUrl: './statistiques.html',
  styleUrl: './statistiques.css',
})
export class Statistiques {

  // ==========================================================
    // 💉 CONSTRUCTEUR
    // ==========================================================
  
    constructor(
      public themeService: ThemeService,
  
      // 🌐 Service de langue
      public languageService: LanguageService
    ) {}
}
