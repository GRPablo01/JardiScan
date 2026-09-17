import { Component } from '@angular/core';
import { ThemeService } from '../../../../../Backend/Services/theme.service';
import { LanguageService } from '../../../../../Backend/Services/language.service';
import { CommonModule } from '@angular/common';
import { Icon } from "../../../Public/icon/icon";

@Component({
  selector: 'app-bot',
  imports: [CommonModule, Icon],
  templateUrl: './bot.html',
  styleUrl: './bot.css',
})
export class Bot {

   // ==========================================================
      // 💉 CONSTRUCTEUR
      // ==========================================================
    
      constructor(
        public themeService: ThemeService,
    
        // 🌐 Service de langue
        public languageService: LanguageService
      ) {}
    

}
