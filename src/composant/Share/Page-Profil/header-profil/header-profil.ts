import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { Barre } from '../barre/barre';
import { ThemeService } from '../../../../../Backend/Services/theme.service';


@Component({
  selector: 'app-header-profil',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    RouterLinkActive,
],
  templateUrl: './header-profil.html',
  styleUrl: './header-profil.css'
})
export class HeaderProfil {

  // ============================================================
  // INFORMATIONS UTILISATEUR
  // ============================================================

  role: string = '';
  nom: string = '';
  prenom: string = '';
  email: string = '';
  avatar: string = '';
  initials: string = '';

  // ============================================================
  // CONSTRUCTEUR
  // ============================================================

  constructor(
    public themeService: ThemeService,
  ) {
    this.recupererUtilisateur();
  }

  // ============================================================
  // RÉCUPÉRER L'UTILISATEUR
  // ============================================================

  private recupererUtilisateur(): void {

    const utilisateur = localStorage.getItem('utilisateur');

    if (!utilisateur) {
      this.genererInitiales();
      return;
    }

    try {

      const data = JSON.parse(utilisateur);

      // --------------------------------------------------------
      // Informations principales
      // --------------------------------------------------------

      this.role = data.role ?? '';
      this.nom = data.nom ?? '';
      this.prenom = data.prenom ?? '';
      this.email = data.email ?? '';

      // --------------------------------------------------------
      // Avatar
      // --------------------------------------------------------

      this.avatar = data.avatar ?? '';

      // --------------------------------------------------------
      // Construction de l'URL complète de l'avatar
      // --------------------------------------------------------

      if (
        this.avatar &&
        !this.avatar.startsWith('http://') &&
        !this.avatar.startsWith('https://')
      ) {

        const serverUrl = 'http://localhost:3000';

        this.avatar = `${serverUrl}${this.avatar.startsWith('/') ? '' : '/'}${this.avatar}`;
      }

      // --------------------------------------------------------
      // Initiales
      // --------------------------------------------------------

      this.genererInitiales();

    } catch (error) {

      console.error(
        'Impossible de récupérer les informations utilisateur depuis le localStorage.',
        error
      );

      this.role = '';
      this.nom = '';
      this.prenom = '';
      this.email = '';
      this.avatar = '';

      this.genererInitiales();
    }
  }

  // ============================================================
  // GÉNÉRER LES INITIALES
  // ============================================================

  private genererInitiales(): void {

    const prenom = this.prenom.trim();
    const nom = this.nom.trim();

    if (prenom && nom) {

      this.initials = (
        prenom.charAt(0) +
        nom.charAt(0)
      ).toUpperCase();

      return;
    }

    if (prenom) {

      this.initials = prenom
        .substring(0, 2)
        .toUpperCase();

      return;
    }

    if (nom) {

      this.initials = nom
        .substring(0, 2)
        .toUpperCase();

      return;
    }

    this.initials = 'IN';
  }
}