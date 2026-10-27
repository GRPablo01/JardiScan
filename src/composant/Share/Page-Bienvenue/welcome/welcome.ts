// ============================================================
// welcome.component.ts
// À intégrer dans ton composant Angular standalone existant.
// ============================================================

import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ThemeService } from '../../../../../Backend/Services/theme.service';
import { LanguageService } from '../../../../../Backend/Services/language.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-welcome-bienvenue',
  standalone: true,
  imports: [RouterLink,CommonModule],
  templateUrl: './welcome.html',
  styleUrl: './welcome.css',
})
export class WelcomeBienvenue {
  readonly currentYear = new Date().getFullYear();

  // ==========================================================
        // 💉 CONSTRUCTEUR
        // ==========================================================
      
        constructor(
          public themeService: ThemeService,
      
          // 🌐 Service de langue
          public languageService: LanguageService
        ) {}
}