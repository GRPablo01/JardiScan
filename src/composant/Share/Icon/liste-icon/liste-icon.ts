import { Component } from '@angular/core';

import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive } from '@angular/router';

import { Theme } from '../theme/theme';
import { Language2 } from '../language/language';
import { Aide } from '../aide/aide';
import { Contact } from '../contact/contact';

import { Bienvenue } from '../../../../Page/bienvenue/bienvenue';

import { ThemeService } from '../../../../../Backend/Services/theme.service';
import { LanguageService } from '../../../../../Backend/Services/language.service';

@Component({
  selector: 'app-liste-icon',
  standalone: true,

  imports: [
    CommonModule,
    RouterLink,
    RouterLinkActive,

    Theme,
    Language2,
    Aide,
    Contact,
    Bienvenue
  ],

  templateUrl: './liste-icon.html',
  styleUrl: './liste-icon.css',
})
export class ListeIcon {

  constructor(
    public themeService: ThemeService,
    public languageService: LanguageService
  ) {}

}