import {
  Component,
  EventEmitter,
  Input,
  Output,
  OnInit,
  OnChanges,
  SimpleChanges,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { Tableaubord } from '../tableaubord/tableaubord';
import { ThemeService } from '../../../../../Backend/Services/theme.service';
import { LanguageService } from '../../../../../Backend/Services/language.service';
import { BandeauTableauBord } from '../../Page-TableauBord/bandeau-tableau-bord/bandeau-tableau-bord';
import { CollectionTableauBord } from '../../Page-TableauBord/collection-tableau-bord/collection-tableau-bord';
import { ConseilsTableauBord } from '../../Page-TableauBord/conseils-tableau-bord/conseils-tableau-bord';
import { HeaderTableauBord } from '../../Page-TableauBord/header-tableau-bord/header-tableau-bord';
import { EnvTableauBord } from '../../Page-TableauBord/env-tableau-bord/env-tableau-bord';

export type UserRole =
  | 'administrateur'
  | 'botaniste'
  | 'gestionnaire'
  | 'visiteur';

export type WidgetSize = 'small' | 'medium' | 'large';

export interface SidebarItem {
  label: string;
  icon: string;
  children?: SidebarItem[];
  badge?: string;
}

export interface SidebarSection {
  title: string;
  items: SidebarItem[];
}

export interface ArboriaPalette {
  id: string;
  name: string;
  primary: string;
  secondary: string;
  accent: string;
  background: string;
  surface: string;
  border: string;
  text: string;
  muted: string;
}

interface StoredUser {
  role?: string;
  [key: string]: unknown;
}

@Component({
  selector: 'app-barre',
  standalone: true,
  imports: [CommonModule, Tableaubord, BandeauTableauBord, CollectionTableauBord, ConseilsTableauBord, HeaderTableauBord, EnvTableauBord],
  templateUrl: './barre.html',
})
export class Barre implements OnInit, OnChanges {
  @Input() userRole: UserRole | null = null;

  @Output() navigationChange = new EventEmitter<string>();

  sidebarCollapsed = false;
  activeItem = 'Tableau de bord';
  pageActive = 'Tableau de bord';

  readonly roleLabels: Record<UserRole, string> = {
    administrateur: 'Administrateur',
    botaniste: 'Botaniste',
    gestionnaire: 'Gestionnaire',
    visiteur: 'Visiteur',
  };

  readonly navigationByRole: Record<UserRole, SidebarSection[]> = {
    administrateur: [
      {
        title: 'ADMINISTRATION',
        items: [
          { label: 'Tableau de bord', icon: 'dashboard' },
          { label: 'Utilisateurs', icon: 'users' },
          { label: 'Rôles et permissions', icon: 'shield' },
          { label: 'Gestion des contenus', icon: 'file' },
          { label: 'Catalogue botanique', icon: 'leaf' },
          { label: 'Statistiques', icon: 'chart' },
        ],
      },
      {
        title: 'ESPACE BOTANIQUE',
        items: [
          { label: 'Recherche botanique', icon: 'search' },
          { label: 'Diagnostic botanique', icon: 'diagnostic' },
          { label: 'Familles botaniques', icon: 'family' },
          { label: 'Fiches botaniques', icon: 'file' },
          { label: 'Glossaire', icon: 'book' },
          { label: 'Outils de comparaison', icon: 'compare' },
        ],
      },
      {
        title: 'CONFIGURATION',
        items: [
          { label: 'Paramètres', icon: 'settings' },
          { label: 'Mon profil', icon: 'user' },
          { label: 'Aide et support', icon: 'help' },
        ],
      },
    ],

    botaniste: [
      {
        title: 'EXPLORATION',
        items: [
          { label: 'Tableau de bord', icon: 'dashboard' },
          { label: 'Catalogue botanique', icon: 'leaf', badge: '01' },
          { label: 'Recherche botanique', icon: 'search' },
          { label: 'Diagnostic botanique', icon: 'diagnostic' },
        ],
      },
      {
        title: 'ESPACE SCIENTIFIQUE',
        items: [
          { label: 'Familles botaniques', icon: 'family' },
          { label: 'Fiches botaniques', icon: 'file' },
          { label: 'Glossaire', icon: 'book' },
          { label: 'Outils de comparaison', icon: 'compare' },
          { label: 'Carnet botanique', icon: 'notebook' },
          { label: 'Historique', icon: 'history' },
        ],
      },
      {
        title: 'PRÉFÉRENCES',
        items: [
          { label: 'Mon profil', icon: 'user' },
          { label: 'Paramètres', icon: 'settings' },
          { label: 'Aide et support', icon: 'help' },
        ],
      },
    ],

    gestionnaire: [
      {
        title: 'ESPACE DE GESTION',
        items: [
          { label: 'Tableau de bord', icon: 'dashboard' },
          { label: 'Catalogue botanique', icon: 'leaf' },
          { label: 'Gestion des contenus', icon: 'file' },
          { label: 'Collections partagées', icon: 'collection' },
          { label: 'Utilisateurs', icon: 'users' },
        ],
      },
      {
        title: 'MON ESPACE',
        items: [
          {
            label: 'Mes collections',
            icon: 'collection',
            children: [
              { label: 'Toutes mes plantes', icon: 'leaf' },
              { label: 'Favoris', icon: 'star' },
              { label: 'Listes personnalisées', icon: 'list' },
            ],
          },
          { label: 'Carnet botanique', icon: 'notebook' },
          { label: 'Historique', icon: 'history' },
        ],
      },
      {
        title: 'PRÉFÉRENCES',
        items: [
          { label: 'Mon profil', icon: 'user' },
          { label: 'Paramètres', icon: 'settings' },
          { label: 'Aide et support', icon: 'help' },
        ],
      },
    ],

    visiteur: [
      {
        title: 'EXPLORATION',
        items: [
          { label: 'Tableau de bord', icon: 'dashboard' },
          { label: 'Recherche botanique', icon: 'search' },
        ],
      },
      {
        title: 'MON ESPACE',
        items: [
          {
            label: 'Mes collections',
            icon: 'collection',
            children: [
              { label: 'Toutes mes plantes', icon: 'leaf' },
              { label: 'Favoris', icon: 'star' },
              { label: 'Listes personnalisées', icon: 'list' },
            ],
          },
          { label: 'Carnet botanique', icon: 'notebook' },
          { label: 'Guide Saisons', icon: 'calendar' },
        ],
      },
      {
        title: 'OUTILS BOTANIQUES',
        items: [
          {
            label: 'Outils botaniques',
            icon: 'leaf',
            children: [
              { label: 'Familles botaniques', icon: 'family' },
              { label: 'Fiches botaniques', icon: 'file' },
              { label: 'Glossaire', icon: 'book' },
              { label: 'Outils de comparaison', icon: 'compare' },
            ],
          },
        ],
      },
      {
        title: 'PRÉFÉRENCES',
        items: [
          {
            label: 'Paramètres',
            icon: 'settings',
            children: [
              { label: 'Mon profil', icon: 'user' },
              { label: 'Préférences', icon: 'settings' },
              { label: 'Langue et thème', icon: 'palette' },
            ],
          },
          { label: 'Aide et support', icon: 'help' },
        ],
      },
    ],
  };

  readonly openSections = new Set<string>();

  readonly widgetDefinitions = [
    { id: 'one', title: 'Widget botanique 1', icon: 'fa-leaf' },
    { id: 'two', title: 'Widget botanique 2', icon: 'fa-seedling' },
    { id: 'three', title: 'Widget botanique 3', icon: 'fa-tree' },
    { id: 'four', title: 'Widget principal', icon: 'fa-chart-line' },
    { id: 'five', title: 'Widget botanique 5', icon: 'fa-spa' },
    { id: 'six', title: 'Widget botanique 6', icon: 'fa-calendar-days' },
    { id: 'seven', title: 'Widget botanique 7', icon: 'fa-layer-group' },
  ] as const;

  widgetSizes: Record<string, WidgetSize> = {
    one: 'medium',
    two: 'medium',
    three: 'large',
    four: 'large',
    five: 'medium',
    six: 'medium',
    seven: 'large',
  };

  readonly arboriaPalettes: ArboriaPalette[] = [
    {
      id: 'forest',
      name: 'Forest',
      primary: '#287653',
      secondary: '#36BFA6',
      accent: '#D2F29A',
      background: '#EDF3EE',
      surface: '#FFFFFF',
      border: '#D8E3D9',
      text: '#173F32',
      muted: '#718176',
    },
    {
      id: 'meadow',
      name: 'Prairie',
      primary: '#56834B',
      secondary: '#9ABF68',
      accent: '#E0EFAD',
      background: '#F2F5E9',
      surface: '#FFFFFF',
      border: '#DDE5CC',
      text: '#293F27',
      muted: '#78836D',
    },
    {
      id: 'ocean',
      name: 'Botanique bleue',
      primary: '#4679C9',
      secondary: '#48B8B0',
      accent: '#B9E7DB',
      background: '#EDF3FA',
      surface: '#FFFFFF',
      border: '#D7E1EF',
      text: '#203A59',
      muted: '#71839A',
    },
    {
      id: 'terracotta',
      name: 'Terracotta',
      primary: '#B75E43',
      secondary: '#D98B69',
      accent: '#F2D3A5',
      background: '#FAF0E9',
      surface: '#FFFFFF',
      border: '#EAD8CC',
      text: '#533329',
      muted: '#94796F',
    },
    {
      id: 'lavender',
      name: 'Lavande',
      primary: '#7865B4',
      secondary: '#A99BDA',
      accent: '#E1D8FF',
      background: '#F3F0FA',
      surface: '#FFFFFF',
      border: '#E1D9F0',
      text: '#382D55',
      muted: '#857A9C',
    },
    {
      id: 'night',
      name: 'Forêt nocturne',
      primary: '#8BC9A2',
      secondary: '#4ABFA5',
      accent: '#D2F29A',
      background: '#111B17',
      surface: '#1B2921',
      border: '#304438',
      text: '#F0F7F0',
      muted: '#A4B7A8',
    },
  ];

  selectedPaletteId = 'forest';
  paletteMenuOpen = false;

  constructor(
    public themeService: ThemeService,
    public languageService: LanguageService,
  ) {}

  ngOnInit(): void {
    this.resolveUserRole();
    this.restorePalette();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['userRole']) {
      this.resolveUserRole();
    }
  }

  private getStoredUserRole(): UserRole | null {
    try {
      if (typeof localStorage === 'undefined') {
        return null;
      }

      const storedValue =
        localStorage.getItem('user') ??
        localStorage.getItem('utilisateur');

      if (!storedValue) {
        return null;
      }

      const user: unknown = JSON.parse(storedValue);

      if (
        typeof user !== 'object' ||
        user === null ||
        !('role' in user)
      ) {
        return null;
      }

      const role = (user as StoredUser).role;

      if (typeof role !== 'string') {
        return null;
      }

      const normalizedRole = role.trim().toLowerCase();

      const validRoles: UserRole[] = [
        'administrateur',
        'botaniste',
        'gestionnaire',
        'visiteur',
      ];

      return validRoles.includes(normalizedRole as UserRole)
        ? (normalizedRole as UserRole)
        : null;
    } catch {
      return null;
    }
  }

  private resolveUserRole(): void {
    const validRoles: UserRole[] = [
      'administrateur',
      'botaniste',
      'gestionnaire',
      'visiteur',
    ];

    if (this.userRole && validRoles.includes(this.userRole)) {
      return;
    }

    this.userRole = this.getStoredUserRole() ?? 'visiteur';
  }

  private restorePalette(): void {
    try {
      const storedPalette = localStorage.getItem(
        'arboria-dashboard-palette',
      );

      if (
        storedPalette &&
        this.arboriaPalettes.some(
          (palette) => palette.id === storedPalette,
        )
      ) {
        this.selectedPaletteId = storedPalette;
      }
    } catch {
      this.selectedPaletteId = 'forest';
    }
  }

  get navigationSections(): SidebarSection[] {
    return this.navigationByRole[this.userRole ?? 'visiteur'];
  }

  get roleLabel(): string {
    return this.roleLabels[this.userRole ?? 'visiteur'];
  }

  get selectedPalette(): ArboriaPalette {
    return (
      this.arboriaPalettes.find(
        (palette) => palette.id === this.selectedPaletteId,
      ) ?? this.arboriaPalettes[0]
    );
  }

  get dashboardPaletteStyles(): Record<string, string> {
    const palette = this.selectedPalette;

    return {
      '--dashboard-primary': palette.primary,
      '--dashboard-secondary': palette.secondary,
      '--dashboard-accent': palette.accent,
      '--dashboard-background': palette.background,
      '--dashboard-surface': palette.surface,
      '--dashboard-border': palette.border,
      '--dashboard-text': palette.text,
      '--dashboard-muted': palette.muted,
    };
  }

  toggleSidebar(): void {
    this.sidebarCollapsed = !this.sidebarCollapsed;
  }

  toggleSection(label: string): void {
    if (this.sidebarCollapsed) {
      this.sidebarCollapsed = false;
      this.openSections.add(label);
      return;
    }

    if (this.openSections.has(label)) {
      this.openSections.delete(label);
    } else {
      this.openSections.add(label);
    }
  }

  isSectionOpen(label: string): boolean {
    return this.openSections.has(label);
  }

  hasChildren(item: SidebarItem): boolean {
    return !!item.children?.length;
  }

  selectItem(item: SidebarItem): void {
    if (this.hasChildren(item)) {
      this.toggleSection(item.label);
      return;
    }

    this.activateItem(item.label);
  }

  selectChild(item: SidebarItem): void {
    this.activateItem(item.label);
  }

  onNavigate(label: string): void {
    this.activateItem(label);
  }

  private activateItem(label: string): void {
    this.activeItem = label;
    this.pageActive = label;
    this.navigationChange.emit(label);
  }

  isActive(item: SidebarItem): boolean {
    return (
      this.activeItem === item.label ||
      !!item.children?.some((child) => this.isActive(child))
    );
  }

  getItemAccent(item: SidebarItem): string {
    const label = String(item?.label ?? '').toLowerCase();
    const icon = String(item?.icon ?? '').toLowerCase();

    if (
      label.includes('favori') ||
      label.includes('profil') ||
      label.includes('utilisateur') ||
      icon === 'user' ||
      icon === 'users'
    ) {
      return this.themeService.BGR || '#D946A8';
    }

    if (
      label.includes('aide') ||
      label.includes('document') ||
      label.includes('rapport') ||
      label.includes('guide') ||
      icon === 'help' ||
      icon === 'file' ||
      icon === 'book'
    ) {
      return this.themeService.BGV || '#9946D8';
    }

    if (
      label.includes('calendrier') ||
      label.includes('saison') ||
      label.includes('plan') ||
      label.includes('statistique') ||
      icon === 'calendar' ||
      icon === 'chart'
    ) {
      return this.themeService.BGO || '#F28C38';
    }

    if (
      label.includes('collection') ||
      label.includes('plante') ||
      label.includes('jardidex') ||
      label.includes('nature') ||
      icon === 'leaf' ||
      icon === 'collection'
    ) {
      return this.themeService.BGG || '#159B72';
    }

    if (
      label.includes('paramètre') ||
      label.includes('parametre') ||
      label.includes('configuration') ||
      label.includes('réglage') ||
      label.includes('reglage') ||
      icon === 'settings'
    ) {
      return this.themeService.BGV || '#9946D8';
    }

    if (
      label.includes('recherche') ||
      label.includes('comparer') ||
      label.includes('comparaison') ||
      icon === 'search' ||
      icon === 'compare'
    ) {
      return this.themeService.Blue || '#739AF5';
    }

    if (
      label.includes('diagnostic') ||
      label.includes('urgence') ||
      label.includes('sécurité') ||
      label.includes('securite') ||
      icon === 'shield' ||
      icon === 'diagnostic'
    ) {
      return this.themeService.Error || '#D94646';
    }

    if (
      label.includes('historique') ||
      label.includes('nouveau') ||
      label.includes('communauté') ||
      label.includes('communaute') ||
      icon === 'history' ||
      icon === 'star'
    ) {
      return this.themeService.BGR || '#D946A8';
    }

    if (
      label.includes('assistant') ||
      label.includes('intelligence') ||
      label.includes('activité') ||
      label.includes('activite')
    ) {
      return this.themeService.BGO || '#F28C38';
    }

    return this.themeService.Primary || '#287653';
  }

  getBadgeStyle(item: SidebarItem): Record<string, string> {
    const accent = this.getItemAccent(item);

    return {
      'background-color': `${accent}18`,
      'border-color': `${accent}66`,
      color: accent,
    };
  }

  togglePaletteMenu(): void {
    this.paletteMenuOpen = !this.paletteMenuOpen;
  }

  selectPalette(palette: ArboriaPalette): void {
    this.selectedPaletteId = palette.id;
    this.paletteMenuOpen = false;

    try {
      localStorage.setItem(
        'arboria-dashboard-palette',
        palette.id,
      );
    } catch {
      // La sélection reste active même si le stockage est indisponible.
    }
  }

  cycleWidgetSize(widgetId: string): void {
    const sizes: WidgetSize[] = ['small', 'medium', 'large'];
    const currentSize = this.widgetSizes[widgetId] ?? 'medium';
    const currentIndex = sizes.indexOf(currentSize);
    const nextIndex = (currentIndex + 1) % sizes.length;

    this.widgetSizes = {
      ...this.widgetSizes,
      [widgetId]: sizes[nextIndex],
    };
  }

  setWidgetSize(widgetId: string, size: WidgetSize): void {
    this.widgetSizes = {
      ...this.widgetSizes,
      [widgetId]: size,
    };
  }

  getWidgetSizeLabel(widgetId: string): string {
    const labels: Record<WidgetSize, string> = {
      small: 'Petite',
      medium: 'Moyenne',
      large: 'Grande',
    };

    return labels[this.widgetSizes[widgetId] ?? 'medium'];
  }

  resetWidgetLayout(): void {
    this.widgetSizes = {
      one: 'medium',
      two: 'medium',
      three: 'large',
      four: 'large',
      five: 'medium',
      six: 'medium',
      seven: 'large',
    };
  }


  // À ajouter dans la classe TypeScript existante du composant.
// À ajouter dans la classe TypeScript existante du composant.
// Conserver les propriétés et méthodes déjà présentes.

expandedPanel: number | null = null;

togglePanelSize(panel: number): void {
  if (panel < 1 || panel > 7) {
    return;
  }

  this.expandedPanel = this.expandedPanel === panel ? null : panel;
}

getNavigationClass(item: any): string {
  const icon = String(item?.icon ?? '').toLowerCase();
  const label = String(item?.label ?? '').toLowerCase();

  if (
    icon.includes('search') ||
    icon.includes('calendar') ||
    label.includes('recherche') ||
    label.includes('saison')
  ) {
    return 'nav-violet';
  }

  if (
    icon.includes('collection') ||
    icon.includes('star') ||
    label.includes('collection') ||
    label.includes('favoris') ||
    label.includes('jardidex')
  ) {
    return 'nav-orange';
  }

  if (
    icon.includes('leaf') ||
    icon.includes('users') ||
    label.includes('plante') ||
    label.includes('communauté')
  ) {
    return 'nav-green';
  }

  if (
    icon.includes('diagnostic') ||
    label.includes('diagnostic') ||
    label.includes('assistant')
  ) {
    return 'nav-pink';
  }

  return 'nav-green';
}
}