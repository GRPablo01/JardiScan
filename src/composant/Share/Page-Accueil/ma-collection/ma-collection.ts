import { Component } from '@angular/core';
import { ThemeService } from '../../../../../Backend/Services/theme.service';
import { LanguageService } from '../../../../../Backend/Services/language.service';
import { CommonModule } from '@angular/common';
import { Icon } from '../../../Public/icon/icon';

@Component({
  selector: 'app-ma-collection',
  imports: [CommonModule,Icon],
  templateUrl: './ma-collection.html',
  styleUrl: './ma-collection.css',
})
export class MaCollection {

  // ==========================================================
        // 💉 CONSTRUCTEUR
        // ==========================================================
      
        constructor(
          public themeService: ThemeService,
      
          // 🌐 Service de langue
          public languageService: LanguageService
        ) {}
      

}
