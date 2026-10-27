
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';




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

@Component({
  selector: 'app-collection-tableau-bord',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './collection-tableau-bord.html',
  styleUrl: './collection-tableau-bord.css',
})
export class CollectionTableauBord {
  currentDate = new Date();

  stats: DashboardStat[] = [
    {
      title: 'Plantes répertoriées',
      value: '1 284',
      description: 'Dans toute la collection',
      icon: 'leaf',
      color: 'text-emerald-700',
      background: 'bg-emerald-50',
      trend: '+12,8 %',
      trendPositive: true,
    },
    {
      title: 'Espèces identifiées',
      value: '346',
      description: 'Espèces différentes',
      icon: 'scan',
      color: 'text-blue-700',
      background: 'bg-blue-50',
      trend: '+8,2 %',
      trendPositive: true,
    },
    {
      title: 'Zones surveillées',
      value: '24',
      description: 'Espaces de culture',
      icon: 'map',
      color: 'text-violet-700',
      background: 'bg-violet-50',
      trend: '+3 nouvelles',
      trendPositive: true,
    },
    {
      title: 'Alertes en cours',
      value: '07',
      description: 'Nécessitent une vérification',
      icon: 'alert',
      color: 'text-amber-700',
      background: 'bg-amber-50',
      trend: '3 prioritaires',
      trendPositive: false,
    },
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
      color: 'from-emerald-100 to-green-200',
    },
    {
      name: 'Ficus lyrata',
      scientificName: 'Ficus lyrata Warb.',
      location: 'Jardin intérieur · Zone C',
      humidity: 38,
      temperature: 27,
      status: 'À surveiller',
      initials: 'FL',
      color: 'from-lime-100 to-emerald-200',
    },
    {
      name: 'Calathea orbifolia',
      scientificName: 'Goeppertia orbifolia',
      location: 'Serre tropicale · Zone B',
      humidity: 31,
      temperature: 29,
      status: 'Attention',
      initials: 'CO',
      color: 'from-teal-100 to-cyan-200',
    },
    {
      name: 'Strelitzia reginae',
      scientificName: 'Strelitzia reginae Banks',
      location: 'Jardin extérieur · Zone D',
      humidity: 65,
      temperature: 23,
      status: 'Optimal',
      initials: 'SR',
      color: 'from-yellow-100 to-orange-200',
    },
  ];

  activities: Activity[] = [
    {
      title: 'Nouvelle plante ajoutée',
      description: 'Monstera deliciosa · Serre tropicale',
      time: 'Il y a 12 min',
      icon: 'leaf',
      color: 'bg-emerald-50 text-emerald-700',
    },
    {
      title: 'Alerte d’humidité détectée',
      description: 'Calathea orbifolia · Zone B',
      time: 'Il y a 28 min',
      icon: 'alert',
      color: 'bg-amber-50 text-amber-700',
    },
    {
      title: 'Espèce identifiée',
      description: 'Ficus lyrata · Jardin intérieur',
      time: 'Il y a 1 h',
      icon: 'scan',
      color: 'bg-blue-50 text-blue-700',
    },
    {
      title: 'Inspection terminée',
      description: 'Serre tropicale · 18 plantes contrôlées',
      time: 'Il y a 2 h',
      icon: 'check',
      color: 'bg-violet-50 text-violet-700',
    },
  ];

  selectedPeriod = '7 jours';

  get healthyPlants(): number {
    return this.plants.filter((plant) => plant.status === 'Optimal').length;
  }

  get alertsCount(): number {
    return this.plants.filter((plant) => plant.status !== 'Optimal').length;
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
    if (!this.plants || this.plants.length === 0) {
      return null;
    }
  
    const total = this.plants.reduce(
      (sum, plant) => sum + (Number(plant.humidity) || 0),
      0
    );
  
    return total / this.plants.length;
  }

  scrollProgress = 0;

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
}
