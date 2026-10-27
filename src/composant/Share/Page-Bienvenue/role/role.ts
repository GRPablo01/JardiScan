// ============================================================
// ARBORIA — SECTION DES 4 PROFILS UTILISATEURS
// Fichier : role.ts
//
// Angular Standalone + Tailwind CSS + Font Awesome
// • Compatible avec ThemeService
// • Compatible avec LanguageService
// • Aucune dépendance supplémentaire
// ============================================================

import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { LanguageService } from '../../../../../Backend/Services/language.service';
import { ThemeService } from '../../../../../Backend/Services/theme.service';

@Component({
  selector: 'app-role',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './role.html',
  styleUrl: './role.css',
})
export class Role {
  constructor(
    public themeService: ThemeService,
    public languageService: LanguageService
  ) {}
}