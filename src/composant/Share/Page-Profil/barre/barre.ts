import { CommonModule } from '@angular/common';
import {
  Component,
  EventEmitter,
  Output
} from '@angular/core';

import { ThemeService } from '../../../../../Backend/Services/theme.service';
import { LanguageService } from '../../../../../Backend/Services/language.service';


// ============================================================
// 🌿 INTERFACE — ÉLÉMENT DE MENU
// ============================================================

interface MenuItem {
  label: string;
  page: string;
  section: 'menu' | 'general' | 'role';
  icon: string;
  roles: string[];
}


// ============================================================
// 🌿 COMPOSANT BARRE
// ============================================================

@Component({
  selector: 'app-barre',

  standalone: true,

  imports: [
    CommonModule
  ],

  templateUrl: './barre.html',

  styleUrl: './barre.css'
})
export class Barre {


  // ============================================================
  // 🔄 ÉVÉNEMENT — CHANGEMENT DE PAGE
  // ============================================================

  @Output()
  pageChange = new EventEmitter<string>();


  // ============================================================
  // 📄 PAGE ACTUELLEMENT ACTIVE
  // ============================================================

  pageActive: string = 'accueil';


  // ============================================================
  // 👤 INFORMATIONS UTILISATEUR
  // ============================================================

  role: string = '';

  nom: string = '';

  prenom: string = '';

  email: string = '';

  avatar: string = '';

  initials: string = 'IN';


  // ============================================================
  // 📱 SIDEBAR MOBILE / TABLETTE
  // ============================================================

  mobileSidebarOpen: boolean = false;


  // ============================================================
  // 🔐 RÔLES JARDISCAN
  // ============================================================

  private readonly roles = {

    VISITEUR: 'VISITEUR',

    PROFESSIONNEL: 'PROFESSIONNEL',

    MODERATEUR: 'MODERATEUR',

    ADMIN: 'ADMIN'

  };


  // ============================================================
  // 🧭 CONFIGURATION DE LA NAVIGATION
  // ============================================================

  private readonly menuItems: MenuItem[] = [

    // ==========================================================
    // 🌿 MENU PRINCIPAL
    // ==========================================================

    {
      label: 'Accueil',

      page: 'accueil',

      section: 'menu',

      icon: 'fa-solid fa-house',

      roles: [
        'VISITEUR',
        'PROFESSIONNEL',
        'MODERATEUR',
        'ADMIN'
      ]
    },

    {
      label: 'Mes plantes',

      page: 'mesplantes',

      section: 'menu',

      icon: 'fa-solid fa-leaf',

      roles: [
        'VISITEUR',
        'PROFESSIONNEL',
        'MODERATEUR',
        'ADMIN'
      ]
    },

    {
      label: 'Ajouter une plante',

      page: 'nouvelleplante',

      section: 'menu',

      icon: 'fa-solid fa-plus',

      roles: [
        'VISITEUR',
        'PROFESSIONNEL',
        'MODERATEUR',
        'ADMIN'
      ]
    },

    {
      label: 'Identifier une plante',

      page: 'identifier',

      section: 'menu',

      icon: 'fa-solid fa-camera',

      roles: [
        'VISITEUR',
        'PROFESSIONNEL',
        'MODERATEUR',
        'ADMIN'
      ]
    },


    // ==========================================================
    // ⚙️ GÉNÉRAL
    // ==========================================================

    {
      label: 'Paramètres',

      page: 'parametre',

      section: 'general',

      icon: 'fa-solid fa-gear',

      roles: [
        'VISITEUR',
        'PROFESSIONNEL',
        'MODERATEUR',
        'ADMIN'
      ]
    },

    {
      label: 'Aide',

      page: 'aide',

      section: 'general',

      icon: 'fa-solid fa-circle-question',

      roles: [
        'VISITEUR',
        'PROFESSIONNEL',
        'MODERATEUR',
        'ADMIN'
      ]
    },

    {
      label: 'Contact',

      page: 'contact',

      section: 'general',

      icon: 'fa-solid fa-envelope',

      roles: [
        'VISITEUR',
        'PROFESSIONNEL',
        'MODERATEUR',
        'ADMIN'
      ]
    },


    // ==========================================================
    // 🔐 NAVIGATION SELON LE RÔLE
    // ==========================================================

    {
      label: 'Gestion des plantes',

      page: 'professionnel',

      section: 'role',

      icon: 'fa-solid fa-seedling',

      roles: [
        'PROFESSIONNEL',
        'ADMIN'
      ]
    },

    {
      label: 'Gestion des utilisateurs',

      page: 'moderation',

      section: 'role',

      icon: 'fa-solid fa-users-gear',

      roles: [
        'MODERATEUR',
        'ADMIN'
      ]
    }

  ];


  // ============================================================
  // 🏗️ CONSTRUCTEUR
  // ============================================================

  constructor(
    public themeService: ThemeService,
    public languageService: LanguageService
  ) {

    this.recupererUtilisateur();

  }


  // ============================================================
  // 👤 RÉCUPÉRER L'UTILISATEUR
  // ============================================================

  private recupererUtilisateur(): void {

    const utilisateur =
      localStorage.getItem('utilisateur');


    // ----------------------------------------------------------
    // 👤 UTILISATEUR NON CONNECTÉ
    // ----------------------------------------------------------

    if (!utilisateur) {

      this.role =
        this.roles.VISITEUR;

      this.nom = '';

      this.prenom = '';

      this.email = '';

      this.avatar = '';

      this.genererInitiales();

      return;

    }


    // ----------------------------------------------------------
    // 📦 LECTURE DES DONNÉES
    // ----------------------------------------------------------

    try {

      const data = JSON.parse(utilisateur);


      // --------------------------------------------------------
      // 👤 INFORMATIONS PRINCIPALES
      // --------------------------------------------------------

      this.role = String(
        data.role ?? this.roles.VISITEUR
      ).toUpperCase();

      this.nom = String(
        data.nom ?? ''
      );

      this.prenom = String(
        data.prenom ?? ''
      );

      this.email = String(
        data.email ?? ''
      );


      // --------------------------------------------------------
      // 🖼️ AVATAR
      // --------------------------------------------------------

      this.avatar = String(
        data.avatar ?? ''
      );


      // --------------------------------------------------------
      // 🌐 CONSTRUIRE L'URL COMPLÈTE DE L'AVATAR
      // --------------------------------------------------------

      if (
        this.avatar &&
        !this.avatar.startsWith('http://') &&
        !this.avatar.startsWith('https://')
      ) {

        const serverUrl =
          'http://localhost:3000';

        this.avatar =
          `${serverUrl}${this.avatar.startsWith('/') ? '' : '/'}${this.avatar}`;

      }


      // --------------------------------------------------------
      // 🔤 GÉNÉRER LES INITIALES
      // --------------------------------------------------------

      this.genererInitiales();

    }

    catch (error) {

      console.error(
        'Impossible de récupérer les informations utilisateur depuis le localStorage.',
        error
      );


      // --------------------------------------------------------
      // 🔄 VALEURS PAR DÉFAUT
      // --------------------------------------------------------

      this.role =
        this.roles.VISITEUR;

      this.nom = '';

      this.prenom = '';

      this.email = '';

      this.avatar = '';

      this.genererInitiales();

    }

  }


  // ============================================================
  // 🔤 GÉNÉRER LES INITIALES
  // ============================================================

  private genererInitiales(): void {

    const prenom =
      this.prenom.trim();

    const nom =
      this.nom.trim();


    // ----------------------------------------------------------
    // 👤 PRÉNOM + NOM
    // ----------------------------------------------------------

    if (prenom && nom) {

      this.initials = (
        prenom.charAt(0) +
        nom.charAt(0)
      ).toUpperCase();

      return;

    }


    // ----------------------------------------------------------
    // 👤 PRÉNOM SEUL
    // ----------------------------------------------------------

    if (prenom) {

      this.initials =
        prenom
          .substring(0, 2)
          .toUpperCase();

      return;

    }


    // ----------------------------------------------------------
    // 👤 NOM SEUL
    // ----------------------------------------------------------

    if (nom) {

      this.initials =
        nom
          .substring(0, 2)
          .toUpperCase();

      return;

    }


    // ----------------------------------------------------------
    // 🔤 FALLBACK
    // ----------------------------------------------------------

    this.initials = 'IN';

  }


  // ============================================================
  // 🔐 VÉRIFIER SI UN LIEN EST ACCESSIBLE AU RÔLE
  // ============================================================

  peutVoir(item: MenuItem): boolean {

    return item.roles.includes(
      this.role
    );

  }


  // ============================================================
  // 🌿 LIENS DU MENU PRINCIPAL
  // ============================================================

  get menuLinks(): MenuItem[] {

    return this.menuItems.filter(
      item =>
        item.section === 'menu' &&
        this.peutVoir(item)
    );

  }


  // ============================================================
  // ⚙️ LIENS GÉNÉRAUX
  // ============================================================

  get generalLinks(): MenuItem[] {

    return this.menuItems.filter(
      item =>
        item.section === 'general' &&
        this.peutVoir(item)
    );

  }


  // ============================================================
  // 🔐 LIENS SPÉCIFIQUES AU RÔLE
  // ============================================================

  get roleLinks(): MenuItem[] {

    return this.menuItems.filter(
      item =>
        item.section === 'role' &&
        this.peutVoir(item)
    );

  }


  // ============================================================
  // 🏷️ NOM DU RÔLE
  // ============================================================

  get roleLabel(): string {

    switch (this.role) {

      case this.roles.ADMIN:

        return 'Admin';


      case this.roles.MODERATEUR:

        return 'Modérateur';


      case this.roles.PROFESSIONNEL:

        return 'Pro';


      case this.roles.VISITEUR:

        return 'Visiteur';


      default:

        return 'Visiteur';

    }

  }


  // ============================================================
  // 🧭 SÉLECTIONNER UNE PAGE
  // ============================================================

  selectionnerPage(page: string): void {

    // ----------------------------------------------------------
    // 📄 METTRE À JOUR LA PAGE ACTIVE
    // ----------------------------------------------------------

    this.pageActive = page;


    // ----------------------------------------------------------
    // 📤 ENVOYER LA PAGE AU COMPOSANT PARENT
    // ----------------------------------------------------------

    this.pageChange.emit(page);


    // ----------------------------------------------------------
    // 📱 FERMER LA SIDEBAR MOBILE
    // ----------------------------------------------------------

    this.closeMobileSidebar();

  }


  // ============================================================
  // 📱 OUVRIR / FERMER LA SIDEBAR MOBILE
  // ============================================================

  toggleMobileSidebar(
    event?: Event
  ): void {

    event?.stopPropagation();

    this.mobileSidebarOpen =
      !this.mobileSidebarOpen;

  }


  // ============================================================
  // ❌ FERMER LA SIDEBAR MOBILE
  // ============================================================

  closeMobileSidebar(): void {

    this.mobileSidebarOpen = false;

  }

}