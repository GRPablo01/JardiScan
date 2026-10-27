// bot.ts

import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Router } from '@angular/router';

import { ThemeService } from '../../../../../Backend/Services/theme.service';
import { LanguageService } from '../../../../../Backend/Services/language.service';
import { Icon } from '../../../Public/icon/icon';

@Component({
  selector: 'app-bot',
  standalone: true,
  imports: [
    CommonModule,
    Icon,
  ],
  templateUrl: './bot.html',
  styleUrl: './bot.css',
})
export class Bot {

  // ==========================================================
  // 💉 CONSTRUCTEUR
  // ==========================================================

  constructor(
    public themeService: ThemeService,
    public languageService: LanguageService,
    private router: Router,
  ) {}

  // ==========================================================
  // 🤖 NAVIGATION VERS ARBORIA BOT
  // ==========================================================

  ouvrirChatBot(): void {
    this.router.navigate(['/chatbot']);
  }
}
