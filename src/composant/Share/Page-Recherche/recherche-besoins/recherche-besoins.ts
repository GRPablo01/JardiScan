import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { ThemeService } from '../../../../../Backend/Services/theme.service';

@Component({
  selector: 'app-recherche-besoins',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './recherche-besoins.html',
  styleUrl: './recherche-besoins.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class RechercheBesoins {
  constructor(public readonly themeService: ThemeService) {}

  get themeSombre(): boolean {
    return this.themeService.isDarkMode;
  }
}