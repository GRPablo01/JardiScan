// ============================================================
// ARBORIA — WELCOME PROFILE
// Angular Standalone • TypeScript
//
// • Aucun affichage dans la console
// • Avatar interactif
// • Panneau de profil moderne
// • Récupération du profil depuis localStorage
// • Compatibilité avec plusieurs formats utilisateur
// • Normalisation des URL du backend
// • Gestion de l'image de secours
// • Fermeture avec Échap
// • Déconnexion complète et redirection vers /connexion
// ============================================================

import { CommonModule } from '@angular/common';
import {
  Component,
  EventEmitter,
  HostListener,
  OnInit,
  Output
} from '@angular/core';
import { Router, RouterModule } from '@angular/router';

import { ThemeService } from '../../../../../Backend/Services/theme.service';
import { LanguageService } from '../../../../../Backend/Services/language.service';

@Component({
  selector: 'app-welcome-profile',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule
  ],
  templateUrl: './welcome-profile.html',
  styleUrl: './welcome-profile.css'
})
export class WelcomeProfile implements OnInit {

  // ==========================================================
  // CONFIGURATION
  // ==========================================================

  private readonly backendUrl = 'http://localhost:3000';

  readonly photoParDefaut = 'assets/images/default-avatar.png';

  photoUtilisateur = this.photoParDefaut;
  nomUtilisateur = 'Mon profil';
  emailUtilisateur = '';
  langueActuelle = 'fr';
  menuOuvert = false;

  private erreurPhotoDejaTraitee = false;
  private photoParDefautEnCours = false;

  // ==========================================================
  // CONSTRUCTEUR
  // ==========================================================

  constructor(
    public readonly themeService: ThemeService,
    public readonly languageService: LanguageService,
    private readonly router: Router
  ) {}

  // ==========================================================
  // INITIALISATION
  // ==========================================================

  ngOnInit(): void {
    this.chargerProfilUtilisateur();
  }

  // ==========================================================
  // OUVERTURE / FERMETURE DU PANNEAU
  // ==========================================================

  basculerMenu(): void {
    this.menuOuvert = !this.menuOuvert;
  }

  fermerMenu(): void {
    this.menuOuvert = false;
  }

  @HostListener('document:keydown.escape')
  onEscape(): void {
    this.fermerMenu();
  }

  // ==========================================================
  // RÉCUPÉRATION DU PROFIL
  // ==========================================================

  private chargerProfilUtilisateur(): void {
    try {
      if (typeof localStorage === 'undefined') {
        this.utiliserPhotoParDefaut();
        return;
      }

      const clesUtilisateur = [
        'user',
        'utilisateur',
        'currentUser',
        'current_user'
      ];

      for (const cle of clesUtilisateur) {
        let contenu: string | null;

        try {
          contenu = localStorage.getItem(cle);
        } catch {
          continue;
        }

        if (!contenu) {
          continue;
        }

        let donnees: unknown;

        try {
          donnees = JSON.parse(contenu);
        } catch {
          continue;
        }

        if (!this.estUnObjet(donnees)) {
          continue;
        }

        const utilisateur = this.extraireUtilisateur(donnees);

        this.chargerIdentite(utilisateur);
        this.chargerPhoto(utilisateur);

        return;
      }

      this.utiliserPhotoParDefaut();
    } catch {
      this.utiliserPhotoParDefaut();
    }
  }

  // ==========================================================
  // EXTRACTION DE L'UTILISATEUR
  // ==========================================================

  private extraireUtilisateur(
    donnees: Record<string, unknown>
  ): Record<string, unknown> {

    const proprietesUtilisateur = [
      'utilisateur',
      'user',
      'currentUser',
      'profile',
      'profil'
    ];

    for (const propriete of proprietesUtilisateur) {
      const valeur = donnees[propriete];

      if (this.estUnObjet(valeur)) {
        return valeur;
      }
    }

    return donnees;
  }

  private estUnObjet(
    valeur: unknown
  ): valeur is Record<string, unknown> {

    return (
      valeur !== null &&
      typeof valeur === 'object' &&
      !Array.isArray(valeur)
    );
  }

  // ==========================================================
  // IDENTITÉ UTILISATEUR
  // ==========================================================

  private chargerIdentite(
    utilisateur: Record<string, unknown>
  ): void {

    const proprietesNom = [
      'nomComplet',
      'fullName',
      'displayName',
      'name',
      'nom',
      'username',
      'userName',
      'prenom',
      'firstName'
    ];

    for (const propriete of proprietesNom) {
      const valeur = utilisateur[propriete];

      if (typeof valeur === 'string' && valeur.trim()) {
        this.nomUtilisateur = valeur.trim();
        break;
      }
    }

    const prenom = this.lireTexte(utilisateur, [
      'prenom',
      'firstName',
      'firstname'
    ]);

    const nom = this.lireTexte(utilisateur, [
      'nom',
      'lastName',
      'lastname'
    ]);

    if (
      prenom &&
      nom &&
      (
        this.nomUtilisateur === prenom ||
        this.nomUtilisateur === 'Mon profil'
      )
    ) {
      this.nomUtilisateur = `${prenom} ${nom}`.trim();
    }

    const email = this.lireTexte(utilisateur, [
      'email',
      'mail',
      'adresseEmail',
      'emailAddress'
    ]);

    if (email) {
      this.emailUtilisateur = email;
    }
  }

  private lireTexte(
    objet: Record<string, unknown>,
    proprietes: string[]
  ): string {

    for (const propriete of proprietes) {
      const valeur = objet[propriete];

      if (typeof valeur === 'string' && valeur.trim()) {
        return valeur.trim();
      }
    }

    return '';
  }

  // ==========================================================
  // PHOTO UTILISATEUR
  // ==========================================================

  private chargerPhoto(
    utilisateur: Record<string, unknown>
  ): void {

    const proprietesPhoto = [
      'avatar',
      'photoUrl',
      'photoURL',
      'photo',
      'image',
      'profileImage',
      'profilePicture',
      'picture',
      'imageUrl',
      'urlPhoto'
    ];

    for (const propriete of proprietesPhoto) {
      const valeur = utilisateur[propriete];

      if (typeof valeur !== 'string' || !valeur.trim()) {
        continue;
      }

      const urlPhoto = this.normaliserPhoto(valeur);

      if (!urlPhoto) {
        continue;
      }

      this.erreurPhotoDejaTraitee = false;
      this.photoParDefautEnCours = false;
      this.photoUtilisateur = urlPhoto;

      return;
    }

    this.utiliserPhotoParDefaut();
  }

  // ==========================================================
  // NORMALISATION DE L'URL
  // ==========================================================

  private normaliserPhoto(photo: string): string {
    const chemin = photo.trim();

    if (!chemin) {
      return this.photoParDefaut;
    }

    // URL HTTP ou HTTPS complète.
    if (/^https?:\/\//i.test(chemin)) {
      return chemin;
    }

    // Chemin local fourni par le backend.
    const cheminNettoye = chemin.replace(/^\/+/, '');

    // Chemin déjà préfixé par uploads/users/.
    if (cheminNettoye.startsWith('uploads/users/')) {
      return `${this.backendUrl}/${cheminNettoye}`;
    }

    // Nom de fichier seul.
    if (!cheminNettoye.includes('/')) {
      return `${this.backendUrl}/uploads/users/${cheminNettoye}`;
    }

    // Autre chemin relatif du backend.
    return `${this.backendUrl}/${cheminNettoye}`;
  }

  // ==========================================================
  // GESTION DES ERREURS DE CHARGEMENT
  // ==========================================================

  onPhotoErreur(): void {
    if (this.photoParDefautEnCours) {
      return;
    }

    if (this.erreurPhotoDejaTraitee) {
      return;
    }

    this.erreurPhotoDejaTraitee = true;
    this.utiliserPhotoParDefaut();
  }

  private utiliserPhotoParDefaut(): void {
    this.photoParDefautEnCours = true;
    this.photoUtilisateur = this.photoParDefaut;
  }

  // ==========================================================
  // DÉCONNEXION
  // ==========================================================

  @Output() deconnexionDemandee = new EventEmitter<void>();

  deconnecter(): void {
    this.fermerMenu();

    // Clés d'authentification et de profil connues.
    const clesASupprimer = [
      'jardiscan_session',
      'user',
      'utilisateur',
      'currentUser',
      'current_user',
      'token',
      'accessToken',
      'refreshToken',
      'mode'
    ];

    try {
      for (const cle of clesASupprimer) {
        localStorage.removeItem(cle);
      }

      // Supprimer les données temporaires de session.
      sessionStorage.clear();
    } catch {
      // La redirection reste possible même si le stockage est inaccessible.
    }

    // Réinitialiser les informations affichées.
    this.nomUtilisateur = 'Mon profil';
    this.emailUtilisateur = '';
    this.utiliserPhotoParDefaut();

    // Prévenir le composant parent si nécessaire.
    this.deconnexionDemandee.emit();

    // Rediriger vers la page de connexion.
    void this.router.navigate(['/login']);
  }
}