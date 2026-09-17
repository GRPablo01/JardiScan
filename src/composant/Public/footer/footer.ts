// ============================================================
// 🌿 JARDISCAN — FOOTER ESPACE UTILISATEUR
// ============================================================

import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

import { DebugResponsive } from '../../debug-responsive/debug-responsive';
import { ThemeService } from '../../../../Backend/Services/theme.service';
import { PlantService } from '../../../../Backend/Services/plant.service';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    DebugResponsive
  ],
  templateUrl: './footer.html',
  styleUrl: './footer.css',
})
export class Footer {

  // ============================================================
  // 📅 ANNÉE COURANTE
  // ============================================================

  currentYear = new Date().getFullYear();

  // ============================================================
  // 🌿 VRAI LOGO JARDISCAN
  // 👉 Modifie uniquement ce chemin si ton logo porte un autre nom
  // ============================================================

  logoPath = 'assets/logo.svg';

  // ============================================================
  // 👤 UTILISATEUR CONNECTÉ
  // ============================================================

  prenom = '';
  nom = '';

  constructor(
    public themeService: ThemeService,
    public plantService: PlantService,
  ) {
    this.loadUserFromLocalStorage();
  }

  // ============================================================
  // 👤 RÉCUPÉRATION DU NOM ET PRÉNOM
  // ============================================================

  private loadUserFromLocalStorage(): void {

    try {

      // ----------------------------------------------------------
      // 01 — Recherche des clés simples
      // ----------------------------------------------------------

      const prenomLocal =
        localStorage.getItem('prenom') ||
        localStorage.getItem('firstName') ||
        localStorage.getItem('firstname') ||
        '';

      const nomLocal =
        localStorage.getItem('nom') ||
        localStorage.getItem('lastName') ||
        localStorage.getItem('lastname') ||
        '';

      if (prenomLocal || nomLocal) {
        this.prenom = prenomLocal;
        this.nom = nomLocal;
        return;
      }

      // ----------------------------------------------------------
      // 02 — Recherche d'un objet utilisateur
      // ----------------------------------------------------------

      const possibleKeys = [
        'user',
        'utilisateur',
        'currentUser',
        'userConnected',
        'utilisateurConnecte',
        'connectedUser'
      ];

      for (const key of possibleKeys) {

        const storedUser = localStorage.getItem(key);

        if (!storedUser) {
          continue;
        }

        try {

          const user = JSON.parse(storedUser);

          if (!user || typeof user !== 'object') {
            continue;
          }

          this.prenom =
            user.prenom ??
            user.firstName ??
            user.firstname ??
            '';

          this.nom =
            user.nom ??
            user.lastName ??
            user.lastname ??
            '';

          if (this.prenom || this.nom) {
            return;
          }

        } catch {
          // La valeur n'est pas un JSON valide.
          // On continue avec les autres clés.
        }
      }

    } catch (error) {

      console.warn(
        'JardiScan — Impossible de récupérer l’utilisateur depuis le localStorage.',
        error
      );

    }
  }

  // ============================================================
  // 👤 NOM COMPLET
  // ============================================================

  get fullName(): string {

    const fullName = `${this.prenom} ${this.nom}`.trim();

    return fullName || 'Utilisateur';
  }

  // ============================================================
  // 👤 INITIALES
  // ============================================================

  get userInitials(): string {

    const first =
      this.prenom?.trim()?.charAt(0)?.toUpperCase() || '';

    const last =
      this.nom?.trim()?.charAt(0)?.toUpperCase() || '';

    const initials = `${first}${last}`.trim();

    return initials || 'U';
  }
}