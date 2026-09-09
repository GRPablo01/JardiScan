import { CommonModule, Location } from '@angular/common';
import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

import { ThemeService } from '../../../../../Backend/Services/theme.service';
import { LanguageService } from '../../../../../Backend/Services/language.service';



interface Nouveaute {
  id: number;
  icon: string;
  categorie?: string;
  category?: string;
  titre: string;
  title?: string;
  description: string;
  date?: string;
}

@Component({
  selector: 'app-widget-paramettre',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
  ],
  templateUrl: './widget-paramettre.html',
  styleUrl: './widget-paramettre.css'
})
export class WidgetParamettre {

  constructor(
    private location: Location,
    public themeService: ThemeService,
    public languageService: LanguageService
  ) {}

  /**
   * 🌐 Langue actuelle
   */
  get currentLanguage(): 'fr' | 'en' {
    return this.languageService.currentLanguage;
  }

  /**
   * ↩️ Retour
   */
  retour(): void {
    this.location.back();
  }

  /**
   * 🌿 Liste des nouveautés
   */
  nouveautes: Nouveaute[] = [
    {
      id: 1,
      icon: '🌿',
      categorie: 'Fonctionnalité',
      category: 'Feature',
      titre: 'Identification des plantes améliorée',
      title: 'Improved plant identification',
      description:
        'JardiScan améliore progressivement la précision de son analyse visuelle pour vous aider à identifier vos plantes plus facilement.',
      date: '03/09/2026'
    },
    {
      id: 2,
      icon: '✨',
      categorie: 'Interface',
      category: 'Interface',
      titre: 'Nouvelle interface JardiScan',
      title: 'New JardiScan interface',
      description:
        'Une nouvelle expérience visuelle plus moderne, fluide et immersive avec un design Emerald Glass adapté aux modes clair et sombre.',
      date: '02/09/2026'
    },
    {
      id: 3,
      icon: '🌱',
      categorie: 'Collection',
      category: 'Collection',
      titre: 'Gestion de vos plantes améliorée',
      title: 'Improved plant collection',
      description:
        'Retrouvez plus facilement vos plantes et profitez d’une organisation plus claire de votre collection.',
      date: '01/09/2026'
    },
    {
      id: 4,
      icon: '🌍',
      categorie: 'Langues',
      category: 'Languages',
      titre: 'JardiScan disponible en français et en anglais',
      title: 'JardiScan available in French and English',
      description:
        'L’expérience JardiScan s’adapte désormais à votre langue avec une interface entièrement pensée pour le français et l’anglais.',
      date: '30/08/2026'
    },
    {
      id: 5,
      icon: '🌓',
      categorie: 'Personnalisation',
      category: 'Personalization',
      titre: 'Mode clair et mode sombre',
      title: 'Light and dark mode',
      description:
        'Profitez d’une interface confortable à utiliser aussi bien en journée que dans des environnements plus sombres.',
      date: '28/08/2026'
    }
  ];

  /**
   * 🏷️ Catégorie
   */
  getCategorie(nouveaute: Nouveaute): string {
    if (this.currentLanguage === 'fr') {
      return nouveaute.categorie ?? 'Nouveauté';
    }

    return nouveaute.category ?? 'Update';
  }

  /**
   * 📅 Date
   */
  getDate(nouveaute: Nouveaute): string {
    return nouveaute.date ?? '';
  }

  /**
   * 📝 Titre
   */
  getTitre(nouveaute: Nouveaute): string {
    if (this.currentLanguage === 'fr') {
      return nouveaute.titre;
    }

    return nouveaute.title ?? nouveaute.titre;
  }

  /**
   * 📄 Description
   */
  getDescription(nouveaute: Nouveaute): string {
    return nouveaute.description;
  }
}