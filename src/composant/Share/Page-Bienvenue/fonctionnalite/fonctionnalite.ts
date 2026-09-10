import { Component } from '@angular/core';
import { ThemeService } from '../../../../../Backend/Services/theme.service';
import { CommonModule } from '@angular/common';
import { LanguageService } from '../../../../../Backend/Services/language.service';
import { Icon } from '../../../Public/icon/icon';

@Component({
  selector: 'app-fonctionnalite',
  imports: [CommonModule,Icon],
  templateUrl: './fonctionnalite.html',
  styleUrl: './fonctionnalite.css',
})
export class Fonctionnalite {

  constructor(
    public themeService: ThemeService,
    public languageService: LanguageService
  ) {}

}
