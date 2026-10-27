// welcome.ts

import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Router } from '@angular/router';

import { ThemeService } from '../../../../../Backend/Services/theme.service';
import { LanguageService } from '../../../../../Backend/Services/language.service';

@Component({
  selector: 'app-welcome-catalogue',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './welcome-catalogue.html',
  styleUrl: './welcome-catalogue.css',
})
export class WelcomeCatalogue {
  // ==========================================================
  // SERVICES
  // ==========================================================

  constructor(
    public readonly themeService: ThemeService,
    public readonly languageService: LanguageService,
    private readonly router: Router,
  ) {}

  // ==========================================================
  // NAVIGATION
  // ==========================================================

  /**
   * Accède au catalogue.
   */
  onGetStarted(): void {
    void this.router.navigate(['/catalogue']);
  }

  /**
   * Accède à l'assistant.
   */
  onViewDemo(): void {
    void this.router.navigate(['/assistant']);
  }
}
