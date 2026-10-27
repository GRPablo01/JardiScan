import { Component } from '@angular/core';
import { ThemeService } from '../../../../../Backend/Services/theme.service';
import { CommonModule } from '@angular/common';
import { Icon } from '../../../Public/icon/icon';
import { LanguageService } from '../../../../../Backend/Services/language.service';

@Component({
  selector: 'app-pourquoi',
  imports: [CommonModule,Icon],
  templateUrl: './pourquoi.html',
  styleUrl: './pourquoi.css',
})
export class Pourquoi {

  /**
     * ============================================================
     * CONSTRUCTEUR
     * ============================================================
     */
  
    constructor(
      public themeService: ThemeService,
      public languageService: LanguageService
    ) {}

}
