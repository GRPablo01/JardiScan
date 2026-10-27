import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { ThemeService } from '../../../../../Backend/Services/theme.service';

@Component({
  selector: 'app-pourquoi-recherche',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './pourquoi-recherche.html',
  styleUrl: './pourquoi-recherche.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PourquoiRecherche {
  constructor(public readonly themeService: ThemeService) {}

  get themeSombre(): boolean {
    return this.themeService.isDarkMode;
  }
}