import {
  Component,
  EventEmitter,
  Output
} from '@angular/core';

import {
  RouterLink
} from '@angular/router';
import { LanguageService } from '../../../../../Backend/Services/language.service';
import { ThemeService } from '../../../../../Backend/Services/theme.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-welcome-logo',
  standalone: true,
  imports: [
    RouterLink,
    CommonModule
  ],
  templateUrl: './welcome-logo.html',
  styleUrl: './welcome-logo.css'
})
export class WelcomeLogoComponent {

  constructor(
        public themeService: ThemeService,
    
        // 🌐 Service de langue
        public languageService: LanguageService
      ) {}

  @Output()
  closeMenus = new EventEmitter<void>();

  fermerMenus(): void {
    this.closeMenus.emit();
  }
}