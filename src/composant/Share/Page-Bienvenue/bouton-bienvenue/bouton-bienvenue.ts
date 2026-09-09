import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

import { ThemeService } from '../../../../../Backend/Services/theme.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-bouton-bienvenue',
  standalone: true,
  imports: [
    RouterLink,
    CommonModule
  ],
  templateUrl: './bouton-bienvenue.html',
  styleUrl: './bouton-bienvenue.css',
})
export class BoutonBienvenue {

  constructor(
    public themeService: ThemeService
  ) {}

}