import { Component } from '@angular/core';
import { Profil } from '../../Share/Page-Header/profil/profil';
import { Nav } from '../../Share/Page-Header/nav/nav';
import { ListeIcon } from '../liste-icon/liste-icon';
import { CommonModule } from '@angular/common';
import { ThemeService } from '../../../../Backend/Services/theme.service';
import { LanguageService } from '../../../../Backend/Services/language.service';


@Component({
  selector: 'app-header',
  imports: [Profil,Nav,ListeIcon,CommonModule],
  templateUrl: './header.html',
  styleUrl: './header.css',
})
export class Header {

  // ==========================================================
    // 💉 CONSTRUCTEUR
    // ==========================================================
  
    constructor(
      public themeService: ThemeService,
  
      // 🌐 Service de langue
      public languageService: LanguageService
    ) {}
  

}
