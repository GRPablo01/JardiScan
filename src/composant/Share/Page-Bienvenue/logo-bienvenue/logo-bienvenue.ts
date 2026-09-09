import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ThemeService } from '../../../../../Backend/Services/theme.service';

@Component({
  selector: 'app-logo-bienvenue',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './logo-bienvenue.html',
  styleUrl: './logo-bienvenue.css',
})
export class LogoBienvenue {

  constructor(
    public themeService: ThemeService
  ) {}

}