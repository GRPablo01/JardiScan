import { Component } from '@angular/core';

import { ThemeService } from '../../../../../Backend/Services/theme.service';
import { LanguageService } from '../../../../../Backend/Services/language.service';

import { CommonModule } from '@angular/common';

import {
  RouterLink,
  RouterLinkActive
} from '@angular/router';

@Component({
  selector: 'app-nav',
  standalone: true,

  imports: [
    CommonModule,
    RouterLink,
    RouterLinkActive
  ],

  templateUrl: './nav.html',
  styleUrl: './nav.css',
})
export class Nav {

  constructor(
    public themeService: ThemeService,
    public languageService: LanguageService
  ) {}

}