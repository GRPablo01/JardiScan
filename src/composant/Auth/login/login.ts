import { CommonModule } from '@angular/common';

import {
  HttpClient,
  HttpErrorResponse
} from '@angular/common/http';

import {
  Component,
  inject
} from '@angular/core';

import { FormsModule } from '@angular/forms';

import {
  Router,
  RouterLink
} from '@angular/router';

import { ThemeService } from '../../../../Backend/Services/theme.service';

import {
  LanguageService,
  Language
} from '../../../../Backend/Services/language.service';

// ============================================================
// 👤 UTILISATEUR LOGIN
// ============================================================

interface LoginUser {
  // ==========================================================
  // IDENTIFICATION
  // ==========================================================

  _id?: string;
  key?: string;

  // ==========================================================
  // RÉINITIALISATION MOT DE PASSE
  // ==========================================================

  resetPasswordKey?: string | null;
  resetPasswordExpire?: string | null;



  // ==========================================================
  // INFORMATIONS UTILISATEUR
  // ==========================================================

  pseudo?: string;
  nom?: string;
  prenom?: string;
  email?: string;

  // ==========================================================
  // AUTHENTIFICATION
  // ==========================================================

  motDePasse?: string;

  // ==========================================================
  // PROFIL
  // ==========================================================

  avatar?: string;
  bannerColor?: string;

  // ==========================================================
  // RÔLE
  // ==========================================================

  role?: string;

  // ==========================================================
  // ÉTAT DU COMPTE
  // ==========================================================

  estActif?: boolean;

  // ==========================================================
  // JARDIDEX
  // ==========================================================

  jardiDex?: unknown[];

  // ==========================================================
  // DATES
  // ==========================================================

  createdAt?: string;
  updatedAt?: string;

  // ==========================================================
  // MONGOOSE
  // ==========================================================

  __v?: number;

  // ==========================================================
  // AUTRES DONNÉES ÉVENTUELLEMENT RENVOYÉES
  // ==========================================================

  [key: string]: unknown;
}

// ============================================================
// 📡 RÉPONSE LOGIN
// ============================================================

interface LoginResponse {
  message?: string;
  token?: string;
  user?: LoginUser;
  utilisateur?: LoginUser;

  [key: string]: unknown;
}

// ============================================================
// 💾 SESSION JARDISCAN
// ============================================================

interface JardiScanSession {
  isLoggedIn: boolean;
  mode: 'user' | 'guest';
  token: string | null;
  user: LoginUser | null;
  loginAt: string;
  response?: Record<string, unknown>;
}

// ============================================================
// 🔔 TYPE NOTIFICATION
// ============================================================

type NotificationType = 'success' | 'error';

// ============================================================
// 🔐 COMPONENT LOGIN
// ============================================================

@Component({
  selector: 'app-login',

  standalone: true,

  imports: [
    CommonModule,
    FormsModule,
    RouterLink
  ],

  templateUrl: './login.html',

  styleUrl: './login.css'
})
export class Login {

  // ==========================================================
  // SERVICES
  // ==========================================================

  registerHover = false;

  public readonly themeService =
    inject(ThemeService);

  public readonly languageService =
    inject(LanguageService);

  private readonly http =
    inject(HttpClient);

  private readonly router =
    inject(Router);

  // ==========================================================
  // 🌐 API
  // ==========================================================

  private readonly API_URL =
    'http://localhost:3000/api/users';

  private readonly LOGIN_URL =
    `${this.API_URL}/login`;

  // ==========================================================
  // 💾 CLÉS LOCALSTORAGE
  // ==========================================================

  private readonly SESSION_STORAGE_KEY =
    'jardiscan_session';

  private readonly USER_STORAGE_KEY =
    'user';

  private readonly UTILISATEUR_STORAGE_KEY =
    'utilisateur';

  private readonly TOKEN_STORAGE_KEY =
    'token';

  private readonly MODE_STORAGE_KEY =
    'mode';

  // ==========================================================
  // 📝 FORMULAIRE
  // ==========================================================

  email = '';

  password = '';

  // ==========================================================
  // 🔄 ÉTAT
  // ==========================================================

  isLoading = false;

  submitted = false;

  errorMessage = '';

  successMessage = '';

  // ==========================================================
  // 👁️ MOT DE PASSE
  // ==========================================================

  showPassword = false;

  // ==========================================================
  // 👤 MODE INVITÉ
  // ==========================================================

  guestLoading = false;

  // ==========================================================
  // 🔔 NOTIFICATION
  // ==========================================================

  showNotification = false;

  notificationMessage = '';

  notificationType: NotificationType =
    'success';

  private notificationTimeout:
    ReturnType<typeof setTimeout> | null = null;

  // ==========================================================
  // 🌐 LANGUE
  // ==========================================================

  get currentLanguage(): Language {
    return this.languageService.currentLanguage;
  }

  // ==========================================================
  // 🇫🇷 / 🇬🇧 CHANGER LANGUE
  // ==========================================================

  setLanguage(language: Language): void {
    this.languageService.setLanguage(language);
  }

  // ==========================================================
  // 🔄 BASCULER LANGUE
  // ==========================================================

  toggleLanguage(): void {
    this.languageService.toggleLanguage();
  }

  // ==========================================================
  // 🏳️ DRAPEAU LANGUE
  // ==========================================================

  get currentLanguageFlag(): string {
    return this.languageService.getLanguageFlag(
      this.currentLanguage
    );
  }

  // ==========================================================
  // 🏷️ NOM LANGUE
  // ==========================================================

  get currentLanguageName(): string {
    return this.languageService.getLanguageName(
      this.currentLanguage
    );
  }

  // ==========================================================
  // 🌍 TRADUCTIONS
  // ==========================================================

  t(key: string): string {

    const translations:
      Record<Language, Record<string, string>> = {

      // ======================================================
      // 🇫🇷 FRANÇAIS
      // ======================================================

      fr: {

        login:
          'Connexion',

        welcome:
          'Bienvenue sur Natureora',

        subtitle:
          'Connectez-vous pour accéder à votre espace.',

        email:
          'Adresse e-mail',

        emailPlaceholder:
          'Votre adresse e-mail',

        password:
          'Mot de passe',

        passwordPlaceholder:
          'Votre mot de passe',

        forgotPassword:
          'Mot de passe oublié ?',

        connect:
          'Se connecter',

        connecting:
          'Connexion en cours...',

        guest:
          'Continuer comme invité',

        guestLoading:
          'Accès invité...',

        noAccount:
          'Vous n’avez pas encore de compte ?',

        register:
          'Créer un compte',

        weak:
          'Faible',

        medium:
          'Moyen',

        good:
          'Bon',

        excellent:
          'Excellent',

        emailRequired:
          'Veuillez renseigner votre adresse e-mail.',

        emailInvalid:
          'Veuillez renseigner une adresse e-mail valide.',

        passwordRequired:
          'Veuillez renseigner votre mot de passe.',

        passwordMin:
          'Le mot de passe doit contenir au moins 6 caractères.',

        loginSuccess:
          'Connexion réussie.',

        serverUnavailable:
          'Impossible de contacter le serveur. Vérifiez que le backend JardiScan est bien démarré.',

        invalidInformation:
          'Veuillez vérifier les informations renseignées.',

        invalidCredentials:
          'Adresse e-mail ou mot de passe incorrect.',

        accountUnavailable:
          'Votre compte ne peut pas être utilisé actuellement.',

        accountNotFound:
          'Aucun compte ne correspond à cette adresse e-mail.',

        serverError:
          'Une erreur serveur est survenue. Veuillez réessayer.',

        loginError:
          'Impossible de vous connecter. Veuillez réessayer.'
      },

      // ======================================================
      // 🇬🇧 ENGLISH
      // ======================================================

      en: {

        login:
          'Login',

        welcome:
          'Welcome to Natureora',

        subtitle:
          'Log in to access your personal space.',

        email:
          'Email address',

        emailPlaceholder:
          'Your email address',

        password:
          'Password',

        passwordPlaceholder:
          'Your password',

        forgotPassword:
          'Forgot your password?',

        connect:
          'Log in',

        connecting:
          'Logging in...',

        guest:
          'Continue as guest',

        guestLoading:
          'Guest access...',

        noAccount:
          'Don’t have an account yet?',

        register:
          'Create an account',

        weak:
          'Weak',

        medium:
          'Medium',

        good:
          'Good',

        excellent:
          'Excellent',

        emailRequired:
          'Please enter your email address.',

        emailInvalid:
          'Please enter a valid email address.',

        passwordRequired:
          'Please enter your password.',

        passwordMin:
          'Your password must contain at least 6 characters.',

        loginSuccess:
          'Login successful.',

        serverUnavailable:
          'Unable to contact the server. Please check that the JardiScan backend is running.',

        invalidInformation:
          'Please check the information provided.',

        invalidCredentials:
          'Incorrect email address or password.',

        accountUnavailable:
          'Your account cannot currently be used.',

        accountNotFound:
          'No account matches this email address.',

        serverError:
          'A server error occurred. Please try again.',

        loginError:
          'Unable to log in. Please try again.'
      }
    };

    return (
      translations[this.currentLanguage]?.[key] ??
      translations.fr[key] ??
      key
    );
  }

  // ==========================================================
  // 👑 FORMAT ROLE
  // ==========================================================

  formatRole(role?: string): string {

    if (!role) {
      return 'Visiteur';
    }

    switch (role.toUpperCase()) {

      case 'ADMIN':
        return 'Admin';

      case 'VISITEUR':
        return 'Visiteur';

      case 'PROFESSIONNEL':
        return 'Professionnel';

      case 'MODERATEUR':
        return 'Modérateur';

      default:
        return role;
    }
  }

  // ==========================================================
  // 👑 VÉRIFIER ADMIN
  // ==========================================================

  isAdmin(role?: string): boolean {

    return (
      (role ?? '').toUpperCase() ===
      'ADMIN'
    );
  }

  // ==========================================================
  // 👤 RÉCUPÉRER UTILISATEUR STOCKÉ
  // ==========================================================

  getStoredUser(): LoginUser | null {

    try {

      const storedUser =
        localStorage.getItem(
          this.UTILISATEUR_STORAGE_KEY
        );

      if (!storedUser) {
        return null;
      }

      return JSON.parse(
        storedUser
      ) as LoginUser;

    } catch {

      return null;
    }
  }

  // ==========================================================
  // 👑 RÉCUPÉRER ROLE
  // ==========================================================

  getStoredUserRole(): string {

    const utilisateur =
      this.getStoredUser();

    return (
      utilisateur?.role ??
      'VISITEUR'
    );
  }

  // ==========================================================
  // 👑 VÉRIFIER ADMIN STOCKÉ
  // ==========================================================

  isStoredUserAdmin(): boolean {

    return this.isAdmin(
      this.getStoredUserRole()
    );
  }

  // ==========================================================
  // 🔐 CONNEXION
  // ==========================================================

  connecter(): void {

    this.submitted = true;

    this.errorMessage = '';

    this.successMessage = '';

    // ========================================================
    // PROTECTION DOUBLE CLIC
    // ========================================================

    if (
      this.isLoading ||
      this.guestLoading
    ) {
      return;
    }

    // ========================================================
    // NETTOYAGE
    // ========================================================

    const email =
      this.email
        .trim()
        .toLowerCase();

    const password =
      this.password;

    // ========================================================
    // VALIDATION EMAIL
    // ========================================================

    if (!email) {

      this.errorMessage =
        this.t('emailRequired');

      this.showErrorNotification(
        this.errorMessage
      );

      return;
    }

    if (!this.isValidEmail(email)) {

      this.errorMessage =
        this.t('emailInvalid');

      this.showErrorNotification(
        this.errorMessage
      );

      return;
    }

    // ========================================================
    // VALIDATION MOT DE PASSE
    // ========================================================

    if (!password) {

      this.errorMessage =
        this.t('passwordRequired');

      this.showErrorNotification(
        this.errorMessage
      );

      return;
    }

    if (password.length < 6) {

      this.errorMessage =
        this.t('passwordMin');

      this.showErrorNotification(
        this.errorMessage
      );

      return;
    }

    // ========================================================
    // LOADING
    // ========================================================

    this.isLoading = true;

    // ========================================================
    // REQUÊTE LOGIN
    // ========================================================

    this.http
      .post<LoginResponse>(
        this.LOGIN_URL,
        {
          email,
          motDePasse: password
        }
      )
      .subscribe({

        // ====================================================
        // ✅ SUCCÈS
        // ====================================================

        next: (response) => {

          this.isLoading = false;

          // ==================================================
          // 👤 RÉCUPÉRATION UTILISATEUR
          // ==================================================

          const utilisateur =
            response?.user ??
            response?.utilisateur ??
            null;

          // ==================================================
          // ❌ UTILISATEUR ABSENT
          // ==================================================

          if (!utilisateur) {

            this.errorMessage =
              this.t('loginError');

            this.showErrorNotification(
              this.errorMessage
            );

            return;
          }

          // ==================================================
          // 💾 SAUVEGARDE SESSION
          // ==================================================

          this.saveUserSession(
            response,
            utilisateur
          );

          // ==================================================
          // ✅ MESSAGE
          // ==================================================

          this.successMessage =
            response?.message ??
            this.t('loginSuccess');

          this.showSuccessNotification(
            this.successMessage,
            2500
          );

          // ==================================================
          // 🚀 REDIRECTION
          // ==================================================

          setTimeout(() => {

            void this.router.navigate([
              '/accueil'
            ]);

          }, 1000);
        },

        // ====================================================
        // ❌ ERREUR
        // ====================================================

        error: (
          error: HttpErrorResponse
        ) => {

          this.isLoading = false;

          this.errorMessage =
            this.getErrorMessage(error);

          this.showErrorNotification(
            this.errorMessage
          );
        }
      });
  }

  // ==========================================================
  // 💾 SAUVEGARDE SESSION COMPLÈTE
  // ==========================================================

  private saveUserSession(
    response: LoginResponse,
    utilisateur: LoginUser
  ): void {

    // ========================================================
    // 👤 COPIE COMPLÈTE
    // ========================================================

    const utilisateurComplet: LoginUser = {
      ...utilisateur
    };

    // ========================================================
    // 🔑 TOKEN
    // ========================================================

    const token =
      response?.token ??
      null;

    if (token) {

      localStorage.setItem(
        this.TOKEN_STORAGE_KEY,
        token
      );

    } else {

      localStorage.removeItem(
        this.TOKEN_STORAGE_KEY
      );
    }

    // ========================================================
    // 👤 USER
    // ========================================================

    localStorage.setItem(
      this.USER_STORAGE_KEY,
      JSON.stringify(
        utilisateurComplet
      )
    );

    // ========================================================
    // 👤 UTILISATEUR
    // ========================================================

    localStorage.setItem(
      this.UTILISATEUR_STORAGE_KEY,
      JSON.stringify(
        utilisateurComplet
      )
    );

    // ========================================================
    // 👤 MODE
    // ========================================================

    localStorage.setItem(
      this.MODE_STORAGE_KEY,
      'user'
    );

    // ========================================================
    // 💾 SESSION
    // ========================================================

    const session: JardiScanSession = {

      isLoggedIn: true,

      mode: 'user',

      token,

      user: utilisateurComplet,

      loginAt:
        new Date().toISOString(),

      response:
        response as Record<
          string,
          unknown
        >
    };

    localStorage.setItem(
      this.SESSION_STORAGE_KEY,
      JSON.stringify(session)
    );
  }

  // ==========================================================
  // 💾 RÉCUPÉRER SESSION
  // ==========================================================

  getStoredSession():
    JardiScanSession | null {

    try {

      const session =
        localStorage.getItem(
          this.SESSION_STORAGE_KEY
        );

      if (!session) {
        return null;
      }

      return JSON.parse(
        session
      ) as JardiScanSession;

    } catch {

      return null;
    }
  }

  // ==========================================================
  // 👤 RÉCUPÉRER LE JARDIDEX
  // ==========================================================

  getStoredJardiDex(): unknown[] {

    const utilisateur =
      this.getStoredUser();

    return (
      utilisateur?.jardiDex ??
      []
    );
  }

  // ==========================================================
  // 👤 MODE INVITÉ
  // ==========================================================

  continuerCommeInvite(): void {

    if (
      this.isLoading ||
      this.guestLoading
    ) {
      return;
    }

    this.guestLoading = true;

    this.errorMessage = '';

    this.successMessage = '';

    // ========================================================
    // 🧹 NETTOYAGE SESSION UTILISATEUR
    // ========================================================

    localStorage.removeItem(
      this.TOKEN_STORAGE_KEY
    );

    localStorage.removeItem(
      this.USER_STORAGE_KEY
    );

    localStorage.removeItem(
      this.UTILISATEUR_STORAGE_KEY
    );

    // ========================================================
    // 👤 SESSION INVITÉ
    // ========================================================

    const guestSession: JardiScanSession = {

      isLoggedIn: false,

      mode: 'guest',

      token: null,

      user: null,

      loginAt:
        new Date().toISOString()
    };

    // ========================================================
    // 💾 MODE
    // ========================================================

    localStorage.setItem(
      this.MODE_STORAGE_KEY,
      'guest'
    );

    // ========================================================
    // 💾 SESSION
    // ========================================================

    localStorage.setItem(
      this.SESSION_STORAGE_KEY,
      JSON.stringify(
        guestSession
      )
    );

    // ========================================================
    // 🚀 REDIRECTION
    // ========================================================

    setTimeout(() => {

      void this.router.navigate([
        '/accueil'
      ]);

    }, 250);
  }

  // ==========================================================
  // 📧 VALIDATION EMAIL
  // ==========================================================

  private isValidEmail(
    email: string
  ): boolean {

    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      .test(email);
  }

  // ==========================================================
  // ❌ MESSAGE ERREUR BACKEND
  // ==========================================================

  private getErrorMessage(
    error: HttpErrorResponse
  ): string {

    if (error.status === 0) {

      return (
        error.error?.message ??
        this.t('serverUnavailable')
      );
    }

    if (error.status === 400) {

      return (
        error.error?.message ??
        this.t('invalidInformation')
      );
    }

    if (error.status === 401) {

      return (
        error.error?.message ??
        this.t('invalidCredentials')
      );
    }

    if (error.status === 403) {

      return (
        error.error?.message ??
        this.t('accountUnavailable')
      );
    }

    if (error.status === 404) {

      return (
        error.error?.message ??
        this.t('accountNotFound')
      );
    }

    if (error.status === 500) {

      return (
        error.error?.message ??
        this.t('serverError')
      );
    }

    return (
      error.error?.message ??
      this.t('loginError')
    );
  }

  // ==========================================================
  // 👁️ AFFICHER / CACHER MOT DE PASSE
  // ==========================================================

  togglePassword(): void {

    this.showPassword =
      !this.showPassword;
  }

  // ==========================================================
  // ❌ EMAIL INVALIDE
  // ==========================================================

  isEmailInvalid(): boolean {

    return (
      this.submitted &&
      (
        !this.email.trim() ||
        !this.isValidEmail(
          this.email.trim()
        )
      )
    );
  }

  // ==========================================================
  // ❌ MOT DE PASSE INVALIDE
  // ==========================================================

  isPasswordInvalid(): boolean {

    return (
      this.submitted &&
      (
        !this.password ||
        this.password.length < 6
      )
    );
  }

  // ==========================================================
  // 🔐 FORCE MOT DE PASSE
  // ==========================================================

  getPasswordStrength(): number {

    if (!this.password) {
      return 0;
    }

    let strength = 0;

    // ========================================================
    // 6 CARACTÈRES
    // ========================================================

    if (
      this.password.length >= 6
    ) {
      strength++;
    }

    // ========================================================
    // 10 CARACTÈRES
    // ========================================================

    if (
      this.password.length >= 10
    ) {
      strength++;
    }

    // ========================================================
    // MAJUSCULE
    // ========================================================

    if (
      /[A-Z]/.test(
        this.password
      )
    ) {
      strength++;
    }

    // ========================================================
    // CHIFFRE
    // ========================================================

    if (
      /[0-9]/.test(
        this.password
      )
    ) {
      strength++;
    }

    // ========================================================
    // CARACTÈRE SPÉCIAL
    // ========================================================

    if (
      /[^A-Za-z0-9]/.test(
        this.password
      )
    ) {
      strength++;
    }

    return Math.min(
      strength,
      5
    );
  }

  // ==========================================================
  // 🏷️ LABEL FORCE MOT DE PASSE
  // ==========================================================

  getPasswordStrengthLabel(): string {

    const strength =
      this.getPasswordStrength();

    if (strength === 0) {
      return '';
    }

    if (strength <= 1) {
      return this.t('weak');
    }

    if (strength <= 2) {
      return this.t('medium');
    }

    if (strength <= 3) {
      return this.t('good');
    }

    return this.t('excellent');
  }

  // ==========================================================
  // ✅ TOAST SUCCÈS
  // ==========================================================

  private showSuccessNotification(
    message: string,
    duration = 4000
  ): void {

    this.showNotificationMessage(
      message,
      'success',
      duration
    );
  }

  // ==========================================================
  // ❌ TOAST ERREUR
  // ==========================================================

  private showErrorNotification(
    message: string,
    duration = 5000
  ): void {

    this.showNotificationMessage(
      message,
      'error',
      duration
    );
  }

  // ==========================================================
  // 🔔 AFFICHER NOTIFICATION
  // ==========================================================

  private showNotificationMessage(
    message: string,
    type: NotificationType,
    duration: number
  ): void {

    // ========================================================
    // 🧹 NETTOYAGE ANCIEN TIMER
    // ========================================================

    if (this.notificationTimeout) {

      clearTimeout(
        this.notificationTimeout
      );

      this.notificationTimeout = null;
    }

    // ========================================================
    // 🔔 NOUVELLE NOTIFICATION
    // ========================================================

    this.notificationMessage =
      message;

    this.notificationType =
      type;

    this.showNotification =
      true;

    // ========================================================
    // ⏱️ AUTO FERMETURE
    // ========================================================

    this.notificationTimeout =
      setTimeout(() => {

        this.closeNotification();

      }, duration);
  }

  // ==========================================================
  // ❌ FERMER NOTIFICATION
  // ==========================================================

  closeNotification(): void {

    if (this.notificationTimeout) {

      clearTimeout(
        this.notificationTimeout
      );

      this.notificationTimeout = null;
    }

    this.showNotification =
      false;
  }

  // ==========================================================
  // 📧 VALIDATION EMAIL TEMPLATE
  // ==========================================================

  isValidEmailForTemplate(): boolean {

    return this.isValidEmail(
      this.email.trim()
    );
  }
}