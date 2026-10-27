import { AsyncPipe, NgClass, NgStyle } from '@angular/common';
import { Component, inject } from '@angular/core';
import { ThemeService } from '../../../../../Backend/Services/theme.service';

@Component({
  selector: 'app-welcome-theme-toggle',
  standalone: true,
  imports: [AsyncPipe, NgClass, NgStyle],
  templateUrl: './welcome-theme-toggle.html',
  styleUrl: './welcome-theme-toggle.css'
})
export class WelcomeThemeToggle {
  readonly themeService = inject(ThemeService);
}