import {
  Component,
  HostListener
  } from '@angular/core';
  
  import { CommonModule } from '@angular/common';
  
  import {
  RouterLink,
  RouterLinkActive,
  Router
  } from '@angular/router';
  
  import { ThemeService } from '../../../../../Backend/Services/theme.service';
  import { LanguageService } from '../../../../../Backend/Services/language.service';
  
  interface NavLink {
  label: string;
  page: string;
  icon: string;
  }
  
  @Component({
  selector: 'app-nav-welcome',
  
  standalone: true,
  
  imports: [
  CommonModule,
  RouterLink,
  RouterLinkActive
  ],
  
  templateUrl: './nav-welcome.html',
  
  styleUrl: './nav-welcome.css'
  })
  export class NavWelcome {
  
  constructor(
  public themeService: ThemeService,
  public languageService: LanguageService,
  private router: Router
  ) {}
  
  /* ============================================================
  ÉTAT DE NAVIGATION
  ============================================================ */
  
  pageActive = '';
  
  role = '';
  
  roleLabel = 'Espace personnel';
  
  /* ============================================================
  MENU PRINCIPAL
  ============================================================ */
  
  menuLinks: NavLink[] = [
  {
  label: 'Accueil',
  page: '/accueil',
  icon: 'fa-solid fa-house'
  },
  {
  label: 'Recherche',
  page: '/recherche',
  icon: 'fa-solid fa-magnifying-glass'
  },
  {
  label: 'JardiDex',
  page: '/jardidex',
  icon: 'fa-solid fa-book'
  }
  ];
  
  /* ============================================================
  MENU GÉNÉRAL
  ============================================================ */
  
  generalLinks: NavLink[] = [
  {
  label: 'Conseils',
  page: '/conseils',
  icon: 'fa-solid fa-leaf'
  },
  {
  label: 'Plantes',
  page: '/plantes',
  icon: 'fa-solid fa-seedling'
  },
  {
  label: 'Paramètres',
  page: '/parametres',
  icon: 'fa-solid fa-gear'
  }
  ];
  
  /* ============================================================
  MENU DYNAMIQUE PAR RÔLE
  ============================================================ */
  
  roleLinks: NavLink[] = [];
  
  /* ============================================================
  MENU CONSEIL
  ============================================================ */
  
  conseilMenuOuvert = false;
  
  toggleConseilMenu(event?: Event): void {
  event?.stopPropagation();
  
  
  this.conseilMenuOuvert =
    !this.conseilMenuOuvert;
  
  
  }
  
  closeConseilMenu(): void {
  this.conseilMenuOuvert = false;
  }
  
  /* ============================================================
  SÉLECTION DE PAGE
  ============================================================ */
  
  selectionnerPage(page: string): void {
  
  
  this.pageActive = page;
  
  this.closeConseilMenu();
  
  if (!page) {
    return;
  }
  
  this.router.navigateByUrl(page);
  
  
  }
  
  /* ============================================================
  CLIC EXTÉRIEUR
  ============================================================ */
  
  @HostListener('document:click')
  onDocumentClick(): void {
  this.closeConseilMenu();
  }
  
  /* ============================================================
  INITIALISATION
  ============================================================ */
  
  ngOnInit(): void {
  
  
  this.pageActive =
    this.router.url || '/accueil';
  
  
  }
  
  }
  