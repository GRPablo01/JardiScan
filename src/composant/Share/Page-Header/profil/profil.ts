import { CommonModule } from '@angular/common';
import { Component, HostListener, OnInit } from '@angular/core';

import { ThemeService } from '../../../../../Backend/Services/theme.service';
import { LanguageService } from '../../../../../Backend/Services/language.service';

@Component({
  selector: 'app-profil',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './profil.html',
  styleUrl: './profil.css',
})
export class Profil implements OnInit {

  // ============================================================
  // 👤 UTILISATEUR
  // ============================================================

  avatar: string | null = null;

  prenom = '';
  nom = '';
  role = '';
  initials = '';

  // ============================================================
  // ⚙️ CONFIGURATION
  // ============================================================

  private readonly BACKEND_URL = 'http://localhost:3000';

  // ============================================================
  // 📂 MENU
  // ============================================================

  menuOpen = false;

  // ============================================================
  // CONSTRUCTEUR
  // ============================================================

  constructor(
    public themeService: ThemeService,
    public languageService: LanguageService
  ) {}

  // ============================================================
  // 🚀 INITIALISATION
  // ============================================================

  ngOnInit(): void {
    this.recupererUtilisateur();
    this.recupererAvatar();
  }

  // ============================================================
  // 👆 OUVERTURE / FERMETURE DU MENU
  // ============================================================

  toggleMenu(): void {
    this.menuOpen = !this.menuOpen;
  }

  // ============================================================
  // 🌍 CLIC N'IMPORTE OÙ SUR LA PAGE
  //
  // Ferme le menu lorsqu'on clique à l'extérieur.
  // Le HTML utilise stopPropagation() sur le bouton et le menu
  // afin d'éviter une fermeture immédiate.
  // ============================================================

  @HostListener('document:click')
  fermerMenu(): void {
    if (this.menuOpen) {
      this.menuOpen = false;
    }
  }

  // ============================================================
  // 👤 RÉCUPÉRATION DE L'UTILISATEUR
  // ============================================================

  private recupererUtilisateur(): void {

    const utilisateur = localStorage.getItem('utilisateur');

    if (!utilisateur) {
      console.warn(
        'Aucun utilisateur trouvé dans le localStorage.'
      );
      return;
    }

    try {

      const user = JSON.parse(utilisateur);

      this.prenom = user.prenom || '';
      this.nom = user.nom || '';
      this.role = user.role || '';

      this.initials = this.genererInitiales(
        this.prenom,
        this.nom
      );

    } catch (error) {

      console.error(
        'Erreur lors de la récupération de l’utilisateur :',
        error
      );

    }
  }

  // ============================================================
  // 🖼️ RÉCUPÉRATION DE L'AVATAR
  // ============================================================

  private recupererAvatar(): void {

    const utilisateur = localStorage.getItem('utilisateur');

    if (!utilisateur) {

      console.warn(
        'Aucun utilisateur trouvé dans le localStorage.'
      );

      this.avatar = null;
      return;
    }

    try {

      const user = JSON.parse(utilisateur);

      if (!user.avatar) {

        console.warn(
          'Aucun avatar trouvé pour cet utilisateur.'
        );

        this.avatar = null;
        return;
      }

      /*
       * Exemple :
       *
       * /uploads/users/1789460627309-797767838.png
       */

      if (
        typeof user.avatar === 'string' &&
        user.avatar.trim() !== ''
      ) {

        /*
         * Si le backend renvoie déjà une URL complète,
         * on l'utilise directement.
         */

        if (
          user.avatar.startsWith('http://') ||
          user.avatar.startsWith('https://')
        ) {

          this.avatar = user.avatar;

        } else {

          /*
           * Sinon on ajoute l'URL du backend.
           */

          const avatarPath = user.avatar.startsWith('/')
            ? user.avatar
            : `/${user.avatar}`;

          this.avatar = `${this.BACKEND_URL}${avatarPath}`;
        }

        console.log(
          'Avatar récupéré :',
          this.avatar
        );

      } else {

        this.avatar = null;
      }

    } catch (error) {

      console.error(
        'Erreur lors de la récupération de l’utilisateur :',
        error
      );

      this.avatar = null;
    }
  }

  // ============================================================
  // 🔤 GÉNÉRATION DES INITIALES
  // ============================================================

  private genererInitiales(
    prenom: string,
    nom: string
  ): string {

    const premiereLettrePrenom =
      prenom?.trim().charAt(0) || '';

    const premiereLettreNom =
      nom?.trim().charAt(0) || '';

    const result =
      `${premiereLettrePrenom}${premiereLettreNom}`
        .toUpperCase();

    return result || 'IN';
  }

  // ============================================================
  // 🏷️ FORMATAGE DU RÔLE
  // ============================================================

  formatRole(
    role: string | null | undefined
  ): string {

    const normalizedRole = (role ?? '')
      .toString()
      .trim()
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '');

    switch (normalizedRole) {

      case 'admin':
      case 'administrateur':
        return 'Administrateur';

      case 'moderateur':
      case 'moderator':
        return 'Modérateur';

      case 'professionnel':
      case 'pro':
        return 'Professionnel';

      case 'expert':
        return 'Expert';

      case 'utilisateur':
      case 'user':
        return 'Utilisateur';

      case '':
        return 'Utilisateur';

      default:
        return role?.toString().trim() || 'Utilisateur';
    }
  }

  // ============================================================
  // 🎨 GRADIENT SELON LE RÔLE
  // ============================================================

  getRoleGradient(
    role: string | null | undefined
  ): string {

    const normalizedRole = (role ?? '')
      .toString()
      .trim()
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '');

    switch (normalizedRole) {

      case 'admin':
      case 'administrateur':
        return 'from-emerald-400 via-green-500 to-lime-400';

      case 'moderateur':
      case 'moderator':
        return 'from-blue-400 via-cyan-500 to-teal-400';

      case 'professionnel':
      case 'pro':
        return 'from-violet-400 via-purple-500 to-fuchsia-400';

      case 'expert':
        return 'from-amber-400 via-orange-500 to-red-400';

      case 'utilisateur':
      case 'user':
      case '':
      default:
        return 'from-emerald-400 via-teal-500 to-green-500';
    }
  }
}
