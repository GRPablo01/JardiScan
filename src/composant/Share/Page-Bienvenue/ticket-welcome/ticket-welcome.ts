import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

import { ThemeService } from '../../../../../Backend/Services/theme.service';
import { LanguageService } from '../../../../../Backend/Services/language.service';

@Component({
  selector: 'app-ticket-welcome',

  standalone: true,

  imports: [
    CommonModule,
    RouterLink
  ],

  templateUrl: './ticket-welcome.html',
  styleUrl: './ticket-welcome.css'
})
export class TicketWelcome {

  /**
   * ============================================================
   * État du modal
   * ============================================================
   */

  ticketModalOpen = false;


  /**
   * ============================================================
   * CONSTRUCTEUR
   * ============================================================
   */

  constructor(
    public themeService: ThemeService,
    public languageService: LanguageService
  ) {}


  /**
   * ============================================================
   * OUVRIR LE MODAL
   * ============================================================
   */

  openTicketModal(): void {
    this.ticketModalOpen = true;

    /*
     * Empêche le scroll de la page lorsque le modal est ouvert.
     */
    document.body.style.overflow = 'hidden';
  }


  /**
   * ============================================================
   * FERMER LE MODAL
   * ============================================================
   */

  closeTicketModal(): void {
    this.ticketModalOpen = false;

    /*
     * Réactive le scroll de la page.
     */
    document.body.style.overflow = '';
  }


  /**
   * ============================================================
   * NETTOYAGE DU COMPOSANT
   * ============================================================
   */

  ngOnDestroy(): void {
    /*
     * Sécurité :
     * si le composant est détruit alors que le modal est ouvert,
     * on remet le scroll du body dans son état normal.
     */
    document.body.style.overflow = '';
  }
}
