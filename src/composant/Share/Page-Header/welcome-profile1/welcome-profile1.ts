// ============================================================
// ARBORIA — WELCOME PROFILE
// Angular Standalone • TypeScript • Angular CDK Overlay
//
// • Aucun affichage dans la console
// • Avatar interactif
// • Popup réellement indépendante du parent
// • Popup centrée dans le viewport
// • Fond assombri et flouté
// • Fermeture par Échap et clic extérieur
// • Récupération du profil depuis localStorage
// • Compatibilité avec plusieurs formats utilisateur
// • Normalisation des URL du backend
// • Gestion de l'image de secours
// • Déconnexion via EventEmitter
// • Compatibilité avec le rendu côté serveur
// ============================================================

import {
  CommonModule,
  DOCUMENT,
  isPlatformBrowser
} from '@angular/common';

import {
  Component,
  HostListener,
  OnInit,
  OnDestroy,
  EventEmitter,
  Output,
  Inject,
  PLATFORM_ID,
  ViewChild,
  TemplateRef,
  ViewContainerRef
} from '@angular/core';

import { RouterModule } from '@angular/router';

import {
  Overlay,
  OverlayModule,
  OverlayRef
} from '@angular/cdk/overlay';

import { TemplatePortal } from '@angular/cdk/portal';

import { Subscription } from 'rxjs';
import { ThemeService } from '../../../../../Backend/Services/theme.service';
import { LanguageService } from '../../../../../Backend/Services/language.service';

@Component({
  selector: 'app-welcome-profile1',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    OverlayModule
  ],
  templateUrl: './welcome-profile1.html',
  styleUrl: './welcome-profile1.css'
})
export class WelcomeProfile1 implements OnInit, OnDestroy {

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

  private readonly navigateurDisponible: boolean;

  // ==========================================================
  // TEMPLATE ET OVERLAY
  // ==========================================================

  @ViewChild('profileTemplate')
  profileTemplate!: TemplateRef<unknown>;

  private profileOverlayRef?: OverlayRef;

  private profileBackdropSubscription?: Subscription;

  // ==========================================================
  // CONSTRUCTEUR
  // ==========================================================

  constructor(
    private readonly overlay: Overlay,
    private readonly viewContainerRef: ViewContainerRef,
    public readonly themeService: ThemeService,
    public readonly languageService: LanguageService,

    @Inject(DOCUMENT)
    private readonly document: Document,

    @Inject(PLATFORM_ID)
    private readonly platformId: object
  ) {
    this.navigateurDisponible = isPlatformBrowser(
      this.platformId
    );
  }

  // ==========================================================
  // INITIALISATION
  // ==========================================================

  ngOnInit(): void {
    this.chargerProfilUtilisateur();
  }

  ngOnDestroy(): void {
    this.fermerMenu();
  }

  // ==========================================================
  // OUVERTURE / FERMETURE DE LA POPUP
  // ==========================================================

  basculerMenu(): void {
    if (this.menuOuvert) {
      this.fermerMenu();
      return;
    }

    this.ouvrirMenu();
  }

  private ouvrirMenu(): void {
    if (
      !this.navigateurDisponible ||
      this.profileOverlayRef
    ) {
      return;
    }

    this.menuOuvert = true;

    const overlayRef = this.overlay.create({
      hasBackdrop: true,

      backdropClass: 'arboria-profile-backdrop',

      panelClass: 'arboria-profile-overlay-pane',

      width: 'min(520px, calc(100vw - 24px))',

      maxWidth: 'calc(100vw - 24px)',

      maxHeight: 'calc(100dvh - 24px)',

      positionStrategy: this.overlay
        .position()
        .global()
        .centerHorizontally()
        .centerVertically(),

      scrollStrategy: this.overlay.scrollStrategies.block()
    });

    this.profileOverlayRef = overlayRef;

    try {
      // Le contenu est attaché au conteneur global du CDK.
      // Il n'est plus limité par le parent de l'avatar.
      overlayRef.attach(
        new TemplatePortal(
          this.profileTemplate,
          this.viewContainerRef
        )
      );

      // Clic sur le fond : fermeture de la popup.
      this.profileBackdropSubscription =
        overlayRef.backdropClick().subscribe(() => {
          this.fermerMenu();
        });

      // Donner le focus à la fenêtre pour faciliter
      // la navigation au clavier.
      const dialog = overlayRef.overlayElement
        .querySelector<HTMLElement>('[role="dialog"]');

      dialog?.focus();

    } catch {
      // Nettoyage si l'attachement du template échoue.
      this.fermerMenu();
    }
  }

  fermerMenu(): void {
    this.menuOuvert = false;

    this.profileBackdropSubscription?.unsubscribe();

    this.profileBackdropSubscription = undefined;

    if (this.profileOverlayRef) {
      const overlayRef = this.profileOverlayRef;

      this.profileOverlayRef = undefined;

      overlayRef.dispose();
    }
  }

  // ==========================================================
  // FERMETURE AVEC ÉCHAP
  // ==========================================================

  @HostListener('document:keydown.escape')
  onEscape(): void {
    if (this.menuOuvert) {
      this.fermerMenu();
    }
  }

  // ==========================================================
  // RÉCUPÉRATION DU PROFIL
  // ==========================================================

  private chargerProfilUtilisateur(): void {
    try {
      if (!this.navigateurDisponible) {
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
          contenu =
            this.document.defaultView?.localStorage.getItem(cle)
            ?? null;
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
      'userName'
    ];

    let nomTrouve = '';

    for (const propriete of proprietesNom) {
      const valeur = utilisateur[propriete];

      if (
        typeof valeur === 'string' &&
        valeur.trim()
      ) {
        nomTrouve = valeur.trim();
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

    if (!nomTrouve && (prenom || nom)) {
      nomTrouve = `${prenom} ${nom}`.trim();
    }

    if (nomTrouve) {
      this.nomUtilisateur = nomTrouve;
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

      if (
        typeof valeur === 'string' &&
        valeur.trim()
      ) {
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

      if (
        typeof valeur !== 'string' ||
        !valeur.trim()
      ) {
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
  // GESTION DES ERREURS DE CHARGEMENT DE PHOTO
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

  @Output()
  deconnexionDemandee = new EventEmitter<void>();

  deconnecter(): void {
    this.fermerMenu();

    this.deconnexionDemandee.emit();
  }
}