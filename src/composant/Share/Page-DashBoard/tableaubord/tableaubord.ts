
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

import { HeaderTableauBord } from '../../Page-TableauBord/header-tableau-bord/header-tableau-bord';
import { BandeauTableauBord } from '../../Page-TableauBord/bandeau-tableau-bord/bandeau-tableau-bord';
import { EnvTableauBord } from '../../Page-TableauBord/env-tableau-bord/env-tableau-bord';
import { CollectionTableauBord } from '../../Page-TableauBord/collection-tableau-bord/collection-tableau-bord';
import { ConseilsTableauBord } from '../../Page-TableauBord/conseils-tableau-bord/conseils-tableau-bord';
import { ThemeService } from '../../../../../Backend/Services/theme.service';
import { LanguageService } from '../../../../../Backend/Services/language.service';

interface DashboardStat {
  title: string;
  value: string;
  description: string;
  icon: string;
  color: string;
  background: string;
  trend: string;
  trendPositive: boolean;
}

interface Plant {
  name: string;
  scientificName: string;
  location: string;
  humidity: number;
  temperature: number;
  status: 'Optimal' | 'À surveiller' | 'Attention';
  initials: string;
  color: string;
}

interface Activity {
  title: string;
  description: string;
  time: string;
  icon: string;
  color: string;
}

type WidgetArboriaId =
  | 'statistiques'
  | 'environnement'
  | 'collection'
  | 'conseils'
  | 'recherche'
  | 'mes-plantes'
  | 'saison'
  | 'assistant'
  | 'diagnostic'
  | 'plantes'
  | 'activites'
  | 'indicateurs';

interface WidgetArboria {
  id: WidgetArboriaId;
  label: string;
  couleur: string;
}

@Component({
  selector: 'app-tableaubord',
  standalone: true,
  imports: [
    CommonModule,
    HeaderTableauBord,
    BandeauTableauBord,
    EnvTableauBord,
    CollectionTableauBord,
    ConseilsTableauBord
  ],
  templateUrl: './tableaubord.html',
  styleUrl: './tableaubord.css'
})
export class Tableaubord implements OnInit {
  currentDate = new Date();

  selectedPeriod = '7 jours';
  scrollProgress = 0;

   constructor(
      public themeService: ThemeService,
      public languageService: LanguageService,
    ) {}

  readonly cleWidgetsArboria = 'arboria-dashboard-widgets';

  readonly widgetsDisponibles: WidgetArboria[] = [
    { id: 'statistiques', label: 'Statistiques', couleur: '#D2A83E' },
    { id: 'environnement', label: 'Environnement', couleur: '#36BFA6' },
    { id: 'collection', label: 'Collection', couleur: '#287653' },
    { id: 'conseils', label: 'Conseils', couleur: '#739AF5' },
    { id: 'plantes', label: 'État des plantes', couleur: '#2E8B57' },
    { id: 'activites', label: 'Activité récente', couleur: '#739AF5' },
    { id: 'indicateurs', label: 'Indicateurs du jardin', couleur: '#36BFA6' },
    { id: 'recherche', label: 'Recherche', couleur: '#287653' },
    { id: 'mes-plantes', label: 'Mes plantes', couleur: '#36BFA6' },
    { id: 'saison', label: 'Saison', couleur: '#D2A83E' },
    { id: 'assistant', label: 'Assistant', couleur: '#739AF5' },
    { id: 'diagnostic', label: 'Diagnostic guidé', couleur: '#F28B73' }
  ];

  widgetsVisibles: Record<WidgetArboriaId, boolean> = {
    statistiques: true,
    environnement: true,
    collection: true,
    conseils: true,
    plantes: true,
    activites: true,
    indicateurs: true,
    recherche: true,
    'mes-plantes': true,
    saison: true,
    assistant: true,
    diagnostic: true
  };

  stats: DashboardStat[] = [
    {
      title: 'Plantes répertoriées',
      value: '1 284',
      description: 'Dans toute la collection',
      icon: 'leaf',
      color: 'text-emerald-700',
      background: 'bg-emerald-50',
      trend: '+12,8 %',
      trendPositive: true
    },
    {
      title: 'Espèces botaniques',
      value: '346',
      description: 'Espèces différentes',
      icon: 'seedling',
      color: 'text-blue-700',
      background: 'bg-blue-50',
      trend: '+8,2 %',
      trendPositive: true
    },
    {
      title: 'Zones de culture',
      value: '24',
      description: 'Espaces de culture',
      icon: 'map',
      color: 'text-violet-700',
      background: 'bg-violet-50',
      trend: '+3 nouvelles',
      trendPositive: true
    },
    {
      title: 'Plantes à surveiller',
      value: '07',
      description: 'Nécessitent une vérification',
      icon: 'alert',
      color: 'text-amber-700',
      background: 'bg-amber-50',
      trend: '3 prioritaires',
      trendPositive: false
    }
  ];

  plants: Plant[] = [
    {
      name: 'Monstera deliciosa',
      scientificName: 'Monstera deliciosa Liebm.',
      location: 'Serre tropicale · Zone A',
      humidity: 72,
      temperature: 24,
      status: 'Optimal',
      initials: 'MD',
      color: 'from-emerald-100 to-green-200'
    },
    {
      name: 'Ficus lyrata',
      scientificName: 'Ficus lyrata Warb.',
      location: 'Jardin intérieur · Zone C',
      humidity: 38,
      temperature: 27,
      status: 'À surveiller',
      initials: 'FL',
      color: 'from-lime-100 to-emerald-200'
    },
    {
      name: 'Calathea orbifolia',
      scientificName: 'Goeppertia orbifolia',
      location: 'Serre tropicale · Zone B',
      humidity: 31,
      temperature: 29,
      status: 'Attention',
      initials: 'CO',
      color: 'from-teal-100 to-cyan-200'
    },
    {
      name: 'Strelitzia reginae',
      scientificName: 'Strelitzia reginae Banks',
      location: 'Jardin extérieur · Zone D',
      humidity: 65,
      temperature: 23,
      status: 'Optimal',
      initials: 'SR',
      color: 'from-yellow-100 to-orange-200'
    }
  ];

  activities: Activity[] = [
    {
      title: 'Nouvelle plante ajoutée',
      description: 'Monstera deliciosa · Serre tropicale',
      time: 'Il y a 12 min',
      icon: 'leaf',
      color: 'bg-emerald-50 text-emerald-700'
    },
    {
      title: 'Humidité à surveiller',
      description: 'Calathea orbifolia · Zone B',
      time: 'Il y a 28 min',
      icon: 'alert',
      color: 'bg-amber-50 text-amber-700'
    },
    {
      title: 'Fiche botanique consultée',
      description: 'Ficus lyrata · Jardin intérieur',
      time: 'Il y a 1 h',
      icon: 'book-open',
      color: 'bg-blue-50 text-blue-700'
    },
    {
      title: 'Entretien planifié',
      description: 'Serre tropicale · 18 plantes concernées',
      time: 'Il y a 2 h',
      icon: 'check',
      color: 'bg-violet-50 text-violet-700'
    }
  ];

  ngOnInit(): void {
    this.chargerPreferencesWidgets();
  }

  get nombreWidgetsActifs(): number {
    return this.widgetsDisponibles.filter(
      widget => this.widgetsVisibles[widget.id]
    ).length;
  }

  get healthyPlants(): number {
    return this.plants.filter(
      plant => plant.status === 'Optimal'
    ).length;
  }

  get alertsCount(): number {
    return this.plants.filter(
      plant => plant.status !== 'Optimal'
    ).length;
  }

  get averageTemperature(): number | null {
    if (this.plants.length === 0) {
      return null;
    }

    const total = this.plants.reduce(
      (sum, plant) => sum + plant.temperature,
      0
    );

    return total / this.plants.length;
  }

  get averageHumidity(): number | null {
    if (this.plants.length === 0) {
      return null;
    }

    const total = this.plants.reduce(
      (sum, plant) => sum + (Number(plant.humidity) || 0),
      0
    );

    return total / this.plants.length;
  }

  selectPeriod(period: string): void {
    this.selectedPeriod = period;
  }

  refreshDashboard(): void {
    this.currentDate = new Date();
  }

  getStatusClass(status: Plant['status']): string {
    switch (status) {
      case 'Optimal':
        return 'bg-emerald-50 text-emerald-700 ring-emerald-600/20';

      case 'À surveiller':
        return 'bg-amber-50 text-amber-700 ring-amber-600/20';

      case 'Attention':
        return 'bg-rose-50 text-rose-700 ring-rose-600/20';
    }
  }

  getHumidityClass(humidity: number): string {
    if (humidity < 40) {
      return 'bg-amber-500';
    }

    return 'bg-emerald-500';
  }

  updateScrollProgress(event: Event): void {
    const element = event.target as HTMLElement;

    const scrollableHeight =
      element.scrollHeight - element.clientHeight;

    if (scrollableHeight <= 0) {
      this.scrollProgress = 0;
      return;
    }

    this.scrollProgress = Math.min(
      100,
      Math.max(
        0,
        Math.round(
          (element.scrollTop / scrollableHeight) * 100
        )
      )
    );
  }

  basculerWidget(id: WidgetArboriaId): void {
    this.widgetsVisibles[id] = !this.widgetsVisibles[id];
    this.sauvegarderPreferencesWidgets();
  }

  restaurerWidgets(): void {
    for (const widget of this.widgetsDisponibles) {
      this.widgetsVisibles[widget.id] = true;
    }

    this.sauvegarderPreferencesWidgets();
  }

  afficherTousWidgets(): void {
    this.restaurerWidgets();
  }

  private chargerPreferencesWidgets(): void {
    try {
      if (typeof localStorage === 'undefined') {
        return;
      }

      const sauvegarde = localStorage.getItem(
        this.cleWidgetsArboria
      );

      if (!sauvegarde) {
        return;
      }

      const preferences: unknown = JSON.parse(sauvegarde);

      if (
        typeof preferences !== 'object' ||
        preferences === null ||
        Array.isArray(preferences)
      ) {
        return;
      }

      const donnees = preferences as Record<string, unknown>;

      for (const widget of this.widgetsDisponibles) {
        if (typeof donnees[widget.id] === 'boolean') {
          this.widgetsVisibles[widget.id] =
            donnees[widget.id] as boolean;
        }
      }
    } catch {
      // Les préférences par défaut restent actives.
    }
  }

  private sauvegarderPreferencesWidgets(): void {
    try {
      if (typeof localStorage !== 'undefined') {
        localStorage.setItem(
          this.cleWidgetsArboria,
          JSON.stringify(this.widgetsVisibles)
        );
      }
    } catch {
      // Le tableau de bord reste fonctionnel sans stockage local.
    }
  }
}
