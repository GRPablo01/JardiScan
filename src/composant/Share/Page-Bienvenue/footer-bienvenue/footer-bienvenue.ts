import { Component } from '@angular/core';
import { ThemeService } from '../../../../../Backend/Services/theme.service';
import { CommonModule } from '@angular/common';
import { LanguageService } from '../../../../../Backend/Services/language.service';

@Component({
  selector: 'app-footer-bienvenue',
  imports: [CommonModule],
  templateUrl: './footer-bienvenue.html',
  styleUrl: './footer-bienvenue.css',
})
export class FooterBienvenue {

  currentYear = new Date().getFullYear();

  constructor(
    public themeService: ThemeService,
    public languageService: LanguageService
  ) {}

}
