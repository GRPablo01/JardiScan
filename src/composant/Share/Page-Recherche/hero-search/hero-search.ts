
import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ThemeService } from '../../../../../Backend/Services/theme.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-hero-search',
  standalone: true,
  imports: [CommonModule,FormsModule],
  templateUrl: './hero-search.html',
  styleUrl: './hero-search.css',
})
export class HeroSearch {
  recherche = '';
  langue: 'fr' | 'en' = 'fr';

  constructor(public themeService: ThemeService) {}

  get themeSombre(): boolean {
    return this.themeService.isDarkMode;
  }

  get textes() {
    return this.langue === 'fr'
      ? {
          label: 'EXPLOREZ LE MONDE VÉGÉTAL',
          titre1: 'Chaque plante a',
          titre2: 'son histoire.',
          description:
            'Découvrez les plantes qui vous entourent, explorez leurs particularités et trouvez les conseils adaptés pour en prendre soin.',
          placeholder: 'Rechercher une plante, un nom...',
          bouton: 'Explorer les plantes',
          note: 'Une recherche simple, des découvertes infinies.',
          etiquette1: 'Des milliers de découvertes',
          etiquette2: 'Des conseils pour vos plantes',
          etiquette3: 'Votre jardin, autrement',
          indication: 'VOTRE PROCHAINE DÉCOUVERTE',
          plante: 'Monstera deliciosa',
          categorie: 'Plante tropicale',
          lumiere: 'Lumière indirecte',
          entretien: 'Entretien modéré',
          explorer: 'Découvrir la plante',
        }
      : {
          label: 'EXPLORE THE PLANT WORLD',
          titre1: 'Every plant has',
          titre2: 'a story.',
          description:
            'Discover the plants around you, explore their unique characteristics and find helpful advice to care for them.',
          placeholder: 'Search for a plant, a name...',
          bouton: 'Explore plants',
          note: 'Simple searches, endless discoveries.',
          etiquette1: 'Discover countless plants',
          etiquette2: 'Care advice for your plants',
          etiquette3: 'See your garden differently',
          indication: 'YOUR NEXT DISCOVERY',
          plante: 'Monstera deliciosa',
          categorie: 'Tropical plant',
          lumiere: 'Indirect light',
          entretien: 'Moderate care',
          explorer: 'Discover this plant',
        };
  }

  changerLangue(): void {
    this.langue = this.langue === 'fr' ? 'en' : 'fr';
  }

  lancerRecherche(): void {
    const terme = this.recherche.trim();

    if (!terme) {
      document.getElementById('recherche-plantes-input')?.focus();
      return;
    }

    // Le composant présente la fonctionnalité.
    // La recherche réelle sera raccordée au catalogue dans le composant parent.
    window.dispatchEvent(
      new CustomEvent('arboria-recherche-plantes', {
        detail: { terme },
      }),
    );
  }
}
