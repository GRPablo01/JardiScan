import { CommonModule } from '@angular/common';
import { Component, ChangeDetectionStrategy } from '@angular/core';
import { ThemeService } from '../../../../../Backend/Services/theme.service';

@Component({
  selector: 'app-explore-catalogue',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './explore-catalogue.html',
  styleUrl: './explore-catalogue.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ExploreCatalogue {
  constructor(public readonly themeService: ThemeService) {}

  get themeSombre(): boolean {
    return this.themeService.isDarkMode;
  }
}