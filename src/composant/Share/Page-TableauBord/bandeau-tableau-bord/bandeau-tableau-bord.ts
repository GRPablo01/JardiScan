import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ThemeService } from '../../../../../Backend/Services/theme.service';


@Component({
  selector: 'app-bandeau-tableau-bord',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './bandeau-tableau-bord.html',
  styleUrl: './bandeau-tableau-bord.css',
})
export class BandeauTableauBord {
  constructor(
    public themeService: ThemeService
  ) {}
}