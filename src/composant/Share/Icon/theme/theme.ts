import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Icon } from '../../../Public/icon/icon';
import { ThemeService } from '../../../../../Backend/Services/theme.service';





@Component({
  selector: 'app-theme',
  standalone: true,
  templateUrl: './theme.html',
  styleUrls: ['./theme.css'],
  imports: [CommonModule, Icon]
})
export class Theme {
  hover = false;
  hoverTheme = false;

  isOpen = false;


  toggleMenu(): void {
    this.isOpen = !this.isOpen;
    // Ton code existant pour ouvrir/fermer le menu...
  }

  constructor(public themeService: ThemeService) { }

  toggleTheme() {
    this.themeService.toggleTheme();
  }
}