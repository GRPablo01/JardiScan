import {
  Component,
  HostListener
} from '@angular/core';

import { CommonModule } from '@angular/common';

import { ThemeService } from '../../../../Backend/Services/theme.service';
import { Language2 } from '../../Share/Icon/language/language';
import { Aide } from '../../Share/Icon/aide/aide';
import { Contact } from '../../Share/Icon/contact/contact';
import { Theme } from '../../Share/Icon/theme/theme';





@Component({
  selector: 'app-actions-mobile-tablette',

  standalone: true,

  imports: [
    CommonModule,
    Language2,
    Aide,
    Contact,
    Theme
  ],

  templateUrl: './actions-mobile-tablette.html',

  styleUrl: './actions-mobile-tablette.css',
})
export class ActionsMobileTablette {

  // ========================================================
  // 🚀 ÉTAT DU MENU
  //
  // false → menu fermé
  // true  → menu ouvert
  // ========================================================

  showMoreActions = false;


  // ========================================================
  // 🎨 CONSTRUCTEUR
  // ========================================================

  constructor(
    public themeService: ThemeService
  ) {}


  // ========================================================
  // ➕ OUVRIR / FERMER LE MENU
  // ========================================================

  toggleMoreActions(): void {
    this.showMoreActions = !this.showMoreActions;
  }


  // ========================================================
  // ❌ FERMER LE MENU
  // ========================================================

  closeMoreActions(): void {
    this.showMoreActions = false;
  }


  // ========================================================
  // 🌱 PLANTES
  //
  // Pour l'instant on ferme simplement le menu.
  // Tu peux ensuite ajouter ta navigation ici.
  // ========================================================

  onPlantsClick(): void {
    this.closeMoreActions();

    // Exemple :
    // this.router.navigate(['/plantes']);
  }


  // ========================================================
  // 📖 CONSEILS
  //
  // Pour l'instant on ferme simplement le menu.
  // Tu peux ensuite ajouter ta navigation ici.
  // ========================================================

  onAdviceClick(): void {
    this.closeMoreActions();

    // Exemple :
    // this.router.navigate(['/conseils']);
  }


  // ========================================================
  // ⌨️ ESCAPE
  //
  // Ferme le menu avec la touche Échap.
  // ========================================================

  @HostListener('document:keydown.escape')
  onEscape(): void {
    this.closeMoreActions();
  }

}
