import { Component } from '@angular/core';
import { ThemeService } from '../../../../../Backend/Services/theme.service';
import { LanguageService } from '../../../../../Backend/Services/language.service';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-widget-scan',
  imports: [CommonModule,RouterLink],
  templateUrl: './widget-scan.html',
  styleUrl: './widget-scan.css',
})
export class WidgetScan {

  // ==========================================================
        // 💉 CONSTRUCTEUR
        // ==========================================================
      
        constructor(
          public themeService: ThemeService,
      
          // 🌐 Service de langue
          public languageService: LanguageService
        ) {}
      

}
