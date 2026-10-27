// ============================================================
// WELCOME NAV MOBILE — ARBORIA
// Angular standalone
//
// • Dock déplaçable sur les quatre côtés
// • Position sauvegardée dans localStorage
// • Navigation découverte / fonctionnalités / aide
// • Compatible avec CommonModule et RouterModule
// • Aucune dépendance supplémentaire
// ============================================================

import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ThemeService } from '../../../../../Backend/Services/theme.service';
import { LanguageService } from '../../../../../Backend/Services/language.service';

type DockPosition = 'bottom' | 'left' | 'right' | 'top';

type MenuNavigation = 'decouvrir' | 'ressources' | 'aide' | null;

@Component({
  selector: 'app-welcome-nav-mobile',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './welcome-nav-mobile.html',
  styleUrl: './welcome-nav-mobile.css'
})
export class WelcomeNavMobile {

  // ==========================================================
  // POSITION DU DOCK
  // ==========================================================

  position: DockPosition = 'bottom';

  // Affichage du menu de configuration du Dock.
  menuPositionOuvert = false;

  // ==========================================================
  // MÉGA-MENUS
  // ==========================================================

  menuOuvert: MenuNavigation = null;

  // ==========================================================
  // POSITIONS DISPONIBLES
  // ==========================================================

  readonly positions: {
    label: string;
    value: DockPosition;
  }[] = [
    {
      label: 'En bas',
      value: 'bottom'
    },
    {
      label: 'À gauche',
      value: 'left'
    },
    {
      label: 'À droite',
      value: 'right'
    },
    {
      label: 'En haut',
      value: 'top'
    }
  ];

  // ==========================================================
  // INITIALISATION
  // ==========================================================

  constructor(
    public themeService: ThemeService,
    public languageService: LanguageService,
  ) {
    this.chargerPosition();
  }

  // ==========================================================
  // CHANGER LA POSITION DU DOCK
  // ==========================================================

  changerPosition(position: DockPosition): void {
    this.position = position;
    this.menuPositionOuvert = false;

    try {
      localStorage.setItem(
        'natureora-dock-position',
        position
      );
    } catch {
      // Le Dock reste utilisable sans stockage local.
    }
  }

  // ==========================================================
  // OUVRIR / FERMER LE MENU DE POSITION
  // ==========================================================

  toggleMenuPosition(): void {
    this.menuPositionOuvert = !this.menuPositionOuvert;
  }

  fermerMenuPosition(): void {
    this.menuPositionOuvert = false;
  }

  // ==========================================================
  // OUVRIR UN MÉGA-MENU
  // ==========================================================

  toggleMenu(menu: Exclude<MenuNavigation, null>): void {
    this.menuOuvert =
      this.menuOuvert === menu
        ? null
        : menu;
  }

  // ==========================================================
  // FERMER TOUS LES MÉGA-MENUS
  // ==========================================================

  fermerMenus(): void {
    this.menuOuvert = null;
  }

  // ==========================================================
  // RESTAURER LA POSITION DU DOCK
  // ==========================================================

  private chargerPosition(): void {
    try {
      const saved = localStorage.getItem(
        'natureora-dock-position'
      );

      if (
        saved === 'bottom' ||
        saved === 'left' ||
        saved === 'right' ||
        saved === 'top'
      ) {
        this.position = saved;
      }
    } catch {
      this.position = 'bottom';
    }
  }


// ==========================================================
// OUVERTURE DU MENU AU SURVOL
// ==========================================================

ouvrirMenuSurvol(
  menu: Exclude<MenuNavigation, null>
): void {
  this.menuOuvert = menu;
}
// ==========================================================
// COMPATIBILITÉ AVEC LE HTML EXISTANT
// ==========================================================

toggleMegaMenu(
  menu: Exclude<MenuNavigation, null>,
  event?: Event
): void {
  event?.stopPropagation();
  this.toggleMenu(menu);
}

}
