import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { FormsModule } from '@angular/forms';

export interface PlanteRecherche {
  NomCommun?: string;
  NomScientifique?: string;
  Famille?: string;
  Description?: string;
  Origine?: string;
  Images?: string | string[];
  Couleurs?: string | string[];
  PeriodeFloraison?: string;
  PeriodeRecolte?: string;
  Cycle?: string;
  Exposition?: string;
  Arrosage?: string;
  Sol?: string;
  TemperatureMin?: number | string;
  TemperatureMax?: number | string;
  Humidite?: string | number;
  PartiesDangereuses?: string;
  'Usage culinaire'?: string;
  Retours?: string | string[];
  [key: string]: unknown;
}

@Component({
  selector: 'app-widget-recherche',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './widget-recherche.html',
  styleUrl: './widget-recherche.css',
})
export class WidgetRecherche {
  @Input() plantes: PlanteRecherche[] = [];

  recherche = '';
  champActif = 'Tous les champs';

  readonly champsRecherche = [
    'Tous les champs',
    'Nom commun',
    'Nom scientifique',
    'Famille',
    'Description',
    'Origine',
    'Couleurs',
    'Floraison',
    'Récolte',
    'Cycle',
    'Exposition',
    'Arrosage',
    'Sol',
    'Température',
    'Humidité',
    'Parties dangereuses',
    'Usage culinaire',
    'Retours',
  ];

  private readonly correspondance: Record<string, string[]> = {
    'Nom commun': ['NomCommun'],
    'Nom scientifique': ['NomScientifique'],
    Famille: ['Famille'],
    Description: ['Description'],
    Origine: ['Origine'],
    Couleurs: ['Couleurs'],
    Floraison: ['PeriodeFloraison'],
    Récolte: ['PeriodeRecolte'],
    Cycle: ['Cycle'],
    Exposition: ['Exposition'],
    Arrosage: ['Arrosage'],
    Sol: ['Sol'],
    Température: ['TemperatureMin', 'TemperatureMax'],
    Humidité: ['Humidite'],
    'Parties dangereuses': ['PartiesDangereuses'],
    'Usage culinaire': ['Usage culinaire', 'UsageCulinaire'],
    Retours: ['Retours'],
  };

  get plantesFiltrees(): PlanteRecherche[] {
    const terme = this.normaliser(this.recherche);

    if (!terme) {
      return [];
    }

    return this.plantes.filter((plante) => {
      const champs =
        this.champActif === 'Tous les champs'
          ? Object.values(plante)
          : (this.correspondance[this.champActif] ?? []).map(
              (cle) => plante[cle],
            );

      return champs.some((valeur) =>
        this.normaliser(this.versTexte(valeur)).includes(terme),
      );
    });
  }

  get nombreResultats(): number {
    return this.plantesFiltrees.length;
  }

  get rechercheActive(): boolean {
    return this.recherche.trim().length > 0;
  }

  getValeur(
    plante: PlanteRecherche,
    ...cles: string[]
  ): string {
    for (const cle of cles) {
      const valeur = plante[cle];

      if (valeur !== undefined && valeur !== null && valeur !== '') {
        return this.versTexte(valeur);
      }
    }

    return '';
  }

  getImage(plante: PlanteRecherche): string {
    const images = plante['Images'];

    if (Array.isArray(images)) {
      return images[0] ?? '';
    }

    return typeof images === 'string' ? images.split(',')[0].trim() : '';
  }

  private versTexte(valeur: unknown): string {
    if (valeur === null || valeur === undefined) {
      return '';
    }

    if (Array.isArray(valeur)) {
      return valeur.map((element) => this.versTexte(element)).join(' ');
    }

    if (typeof valeur === 'object') {
      return Object.values(valeur as Record<string, unknown>)
        .map((element) => this.versTexte(element))
        .join(' ');
    }

    return String(valeur);
  }

  private normaliser(valeur: string): string {
    return valeur
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .toLocaleLowerCase('fr')
      .trim();
  }

  trackByPlante(index: number, plante: PlanteRecherche): unknown {
    return (
      plante['id'] ??
      plante['Id'] ??
      plante['NomScientifique'] ??
      plante['NomCommun'] ??
      index
    );
  }



// Filtres indépendants et facultatifs
filtres = {
  nom: '',
  famille: '',
  origine: '',
  exposition: '',
  arrosage: '',
  floraison: '',
};

// Nombre de critères effectivement renseignés
get nombreFiltresActifs(): number {
  return Object.values(this.filtres)
    .filter(value => value.trim() !== '')
    .length;
}

// À appeler à chaque modification d'un critère
appliquerFiltres(): void {
  // Point d'entrée du filtrage multi-critères.
  // Branche ici ta collection de plantes existante
  // pour conserver ton système actuel de résultats.
}

}