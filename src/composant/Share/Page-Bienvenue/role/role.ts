import { Component } from '@angular/core';
import { LanguageService } from '../../../../../Backend/Services/language.service';
import { ThemeService } from '../../../../../Backend/Services/theme.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-role',
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
