import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';

import { UserService } from '../../../../../Backend/Services/user.service';
import { ThemeService } from '../../../../../Backend/Services/theme.service';

@Component({
  selector: 'app-reset-password',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterLink
  ],
  templateUrl: './reset-password.html',
  styleUrl: './reset-password.css'
})
export class ResetPassword {

  // ============================================================
  // 📧 EMAIL
  // ============================================================

  email: string = '';


  // ============================================================
  // 🔑 CLÉ DE RÉINITIALISATION
  // ============================================================

  resetPasswordKey: string = '';
  showResetKey: boolean = false;


  // ============================================================
  // 🔐 MOT DE PASSE
  // ============================================================

  nouveauPassword: string = '';
  confirmationPassword: string = '';

  showPassword: boolean = false;
  showConfirmPassword: boolean = false;


  // ============================================================
  // ⚙️ ÉTAT
  // ============================================================

  loading: boolean = false;
  etape: number = 1;


  // ============================================================
  // 🔔 NOTIFICATION
  // ============================================================

  showNotification: boolean = false;

  notificationType: 'success' | 'error' = 'success';

  notificationMessage: string = '';

  private notificationTimeout?: ReturnType<typeof setTimeout>;


  // ============================================================
  // CONSTRUCTEUR
  // ============================================================

  constructor(
    private userService: UserService,
    public themeService: ThemeService
  ) {}


  // ============================================================
  // 🔔 AFFICHER NOTIFICATION
  // ============================================================

  private showToast(
    type: 'success' | 'error',
    message: string
  ): void {

    if (this.notificationTimeout) {
      clearTimeout(this.notificationTimeout);
    }

    this.notificationType = type;
    this.notificationMessage = message;
    this.showNotification = true;

    this.notificationTimeout = setTimeout(() => {
      this.closeNotification();
    }, 4000);
  }


  // ============================================================
  // ✅ NOTIFICATION SUCCESS
  // ============================================================

  successToast(message: string): void {
    this.showToast('success', message);
  }


  // ============================================================
  // ❌ NOTIFICATION ERROR
  // ============================================================

  errorToast(message: string): void {
    this.showToast('error', message);
  }


  // ============================================================
  // ❌ FERMER NOTIFICATION
  // ============================================================

  closeNotification(): void {

    this.showNotification = false;

    if (this.notificationTimeout) {
      clearTimeout(this.notificationTimeout);
      this.notificationTimeout = undefined;
    }
  }


  // ============================================================
  // 📧 ÉTAPE 1
  // ENVOYER LA CLÉ DE RÉINITIALISATION
  // ============================================================

  envoyerLienReset(): void {

    if (this.loading) {
      return;
    }

    this.clearNotifications();


    // ----------------------------------------------------------
    // VALIDATION EMAIL
    // ----------------------------------------------------------

    const email = this.email.trim();

    if (!email) {

      this.errorToast(
        'Veuillez entrer votre adresse e-mail'
      );

      return;
    }


    // ----------------------------------------------------------
    // VALIDATION FORMAT EMAIL
    // ----------------------------------------------------------

    const emailRegex =
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(email)) {

      this.errorToast(
        'Veuillez entrer une adresse e-mail valide'
      );

      return;
    }


    this.email = email;
    this.loading = true;


    // ----------------------------------------------------------
    // RECHERCHE UTILISATEUR
    // ----------------------------------------------------------

    this.userService
      .getUserByEmail(this.email)
      .subscribe({

        next: () => {

          // ----------------------------------------------------
          // ENVOI DE LA CLÉ
          // ----------------------------------------------------

          this.userService
            .sendResetPassword(this.email)
            .subscribe({

              next: () => {

                this.loading = false;

                this.etape = 2;

                this.successToast(
                  'Une clé de réinitialisation a été envoyée à votre adresse e-mail'
                );
              },

              error: () => {

                this.loading = false;

                this.errorToast(
                  'Une erreur est survenue pendant l’envoi de la clé'
                );
              }

            });
        },

        error: () => {

          this.loading = false;

          this.errorToast(
            'Aucun compte trouvé avec cette adresse e-mail'
          );
        }

      });
  }


  // ============================================================
  // 🔑 ÉTAPE 2
  // VÉRIFIER LA CLÉ
  // ============================================================

  verifierCle(): void {

    if (this.loading) {
      return;
    }

    this.clearNotifications();


    // ----------------------------------------------------------
    // VALIDATION
    // ----------------------------------------------------------

    const key = this.resetPasswordKey.trim();

    if (!key) {

      this.errorToast(
        'Veuillez entrer votre clé de réinitialisation'
      );

      return;
    }


    this.resetPasswordKey = key;
    this.loading = true;


    // ----------------------------------------------------------
    // DONNÉES
    // ----------------------------------------------------------

    const body = {
      email: this.email,
      resetPasswordKey: this.resetPasswordKey
    };


    // ----------------------------------------------------------
    // VÉRIFICATION
    // ----------------------------------------------------------

    this.userService
      .verifyResetKey(body)
      .subscribe({

        next: () => {

          this.loading = false;

          this.etape = 3;

          this.successToast(
            'Votre clé de réinitialisation est valide'
          );
        },

        error: () => {

          this.loading = false;

          this.errorToast(
            'Clé incorrecte ou expirée'
          );
        }

      });
  }


  // ============================================================
  // 🔐 ÉTAPE 3
  // MODIFIER LE MOT DE PASSE
  // ============================================================

  modifierPassword(): void {

    if (this.loading) {
      return;
    }

    this.clearNotifications();


    // ----------------------------------------------------------
    // VALIDATION MOT DE PASSE
    // ----------------------------------------------------------

    if (!this.nouveauPassword) {

      this.errorToast(
        'Veuillez entrer un nouveau mot de passe'
      );

      return;
    }


    if (this.nouveauPassword.length < 6) {

      this.errorToast(
        'Votre mot de passe doit contenir au moins 6 caractères'
      );

      return;
    }


    // ----------------------------------------------------------
    // VALIDATION CONFIRMATION
    // ----------------------------------------------------------

    if (!this.confirmationPassword) {

      this.errorToast(
        'Veuillez confirmer votre nouveau mot de passe'
      );

      return;
    }


    if (
      this.nouveauPassword !==
      this.confirmationPassword
    ) {

      this.errorToast(
        'Les mots de passe ne correspondent pas'
      );

      return;
    }


    this.loading = true;


    // ----------------------------------------------------------
    // DONNÉES
    // ----------------------------------------------------------

    const data = {

      email: this.email,

      resetPasswordKey:
        this.resetPasswordKey,

      password:
        this.nouveauPassword

    };


    // ----------------------------------------------------------
    // RESET PASSWORD
    // ----------------------------------------------------------

    this.userService
      .resetPassword(data)
      .subscribe({

        next: () => {

          this.loading = false;

          this.successToast(
            'Mot de passe modifié avec succès'
          );


          // ----------------------------------------------------
          // REDIRECTION
          // ----------------------------------------------------

          setTimeout(() => {

            window.location.href = '/login';

          }, 4000);

        },

        error: (err) => {

          this.loading = false;

          this.errorToast(
            err?.error?.message ||
            'Impossible de modifier le mot de passe'
          );
        }

      });
  }


  // ============================================================
  // 🔄 RETOUR ÉTAPE 1
  // ============================================================

  retourEtapeEmail(): void {

    if (this.loading) {
      return;
    }

    this.clearNotifications();

    this.etape = 1;

    this.resetPasswordKey = '';

    this.showResetKey = false;
  }


  // ============================================================
  // 🔄 RETOUR ÉTAPE 2
  // ============================================================

  retourEtapeCle(): void {

    if (this.loading) {
      return;
    }

    this.clearNotifications();

    this.etape = 2;
  }


  // ============================================================
  // 👁️ TOGGLE CLÉ
  // ============================================================

  toggleResetKey(): void {
    this.showResetKey =
      !this.showResetKey;
  }


  // ============================================================
  // 👁️ TOGGLE MOT DE PASSE
  // ============================================================

  togglePassword(): void {
    this.showPassword =
      !this.showPassword;
  }


  // ============================================================
  // 👁️ TOGGLE CONFIRMATION
  // ============================================================

  toggleConfirmPassword(): void {
    this.showConfirmPassword =
      !this.showConfirmPassword;
  }


  // ============================================================
  // 🧹 NETTOYER LES NOTIFICATIONS
  // ============================================================

  private clearNotifications(): void {

    this.showNotification = false;

    this.notificationMessage = '';

    if (this.notificationTimeout) {

      clearTimeout(
        this.notificationTimeout
      );

      this.notificationTimeout =
        undefined;
    }
  }


  // ============================================================
  // 🧹 DESTROY
  // ============================================================

  ngOnDestroy(): void {

    if (this.notificationTimeout) {

      clearTimeout(
        this.notificationTimeout
      );

      this.notificationTimeout =
        undefined;
    }
  }

}