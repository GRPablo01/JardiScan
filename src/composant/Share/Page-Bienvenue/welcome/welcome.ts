import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ThemeService } from '../../../../../Backend/Services/theme.service';
import { LanguageService } from '../../../../../Backend/Services/language.service';
import { HeaderBienvenue } from '../header-bienvenue/header-bienvenue';
import { DebugResponsive } from '../../../debug-responsive/debug-responsive';
import { RouterLink } from "@angular/router";


@Component({
  selector: 'app-welcome-bienvenue',
  standalone: true,
  imports: [
    CommonModule,
    HeaderBienvenue,
    DebugResponsive,
    RouterLink
],
  templateUrl: './welcome.html',
  styleUrl: './welcome.css',
})
export class WelcomeBienvenue {

  ticketModalOpen = false;

  currentYear = new Date().getFullYear();

  constructor(
    public themeService: ThemeService,
    public languageService: LanguageService
  ) {}
  openTicketModal(): void {
    this.ticketModalOpen = true;
  }

  closeTicketModal(): void {
    this.ticketModalOpen = false;
  }
}