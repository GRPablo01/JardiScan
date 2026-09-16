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
// RÉPONSE LOGIN
// ============================================================

interface LoginUser {

  _id?: string;

  key?: string;

  pseudo?: string;

  nom?: string;

  prenom?: string;

  email?: string;

  role?: string;

  avatar?: string;

  bannerColor?: string;

  estActif?: boolean;

  createdAt?: string;

  updatedAt?: string;

  // Permet de conserver d'autres informations
  // éventuellement renvoyées par le backend.
  [key: string]: unknown;
}

interface LoginResponse {

  message?: string;

  token?: string;

  user?: LoginUser;

  utilisateur?: LoginUser;

  // Permet de conserver d'autres données
  // éventuellement renvoyées par le backend.
  [key: string]: unknown;
}

// ============================================================
// SESSION LOCALSTORAGE
// ============================================================

interface JardiScanSession {

  isLoggedIn: boolean;

  mode: 'user' | 'guest';

  token: string | null;

  user: LoginUser | null;

  loginAt: string;

  // Données complètes renvoyées par le backend.
  response?: Record<string, unknown>;
}

// ============================================================
// TYPE NOTIFICATION
// ============================================================

type NotificationType = 'success' | 'error';

// ============================================================
// COMPONENT
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

  // ============================================================
  // SERVICES
  // ============================================================

  public readonly themeService =
    inject(ThemeService);

  public readonly languageService =
    inject(LanguageService);

  private readonly http =
    inject(HttpClient);

  private readonly router =
    inject(Router);

  // ============================================================
  // API
  // ============================================================

  /**
   * Le backend monte User.Route.js avec :
   *
   * app.use('/api/users', userRoutes);
   *
   * La route login devient donc :
   *
   * POST /api/users/login
   */

  private readonly API_URL =
    'http://localhost:3000/api/users';

  private readonly LOGIN_URL =
    `${this.API_URL}/login`;

  // ============================================================
  // CLÉS LOCALSTORAGE
  // ============================================================

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

  // ============================================================
  // FORMULAIRE
  // ============================================================

  email = '';

  password = '';

  // ============================================================
  // ÉTAT
  // ============================================================

  isLoading = false;

  submitted = false;

  errorMessage = '';

  successMessage = '';

  // ============================================================
  // MOT DE PASSE
  // ============================================================

  showPassword = false;

  // ============================================================
  // MODE INVITÉ
  // ============================================================

  guestLoading = false;

  // ============================================================
  // NOTIFICATION TOAST
  // ============================================================

  showNotification = false;

  notificationMessage = '';

  notificationType: NotificationType = 'success';

  private notificationTimeout:
    ReturnType<typeof setTimeout> | null = null;

  // ============================================================
  // LANGUE
  // ============================================================

  /**
   * 🌐 Langue actuelle
   */

  get currentLanguage(): Language {
    return this.languageService.currentLanguage;
  }

  /**
   * 🇫🇷 / 🇬🇧 Changer la langue.
   */

  setLanguage(language: Language): void {
    this.languageService.setLanguage(language);
  }

  /**
   * 🔄 Basculer entre français et anglais.
   */

  toggleLanguage(): void {
    this.languageService.toggleLanguage();
  }

  /**
   * 🏳️ Drapeau de la langue actuelle.
   */

  get currentLanguageFlag(): string {
    return this.languageService.getLanguageFlag(
      this.currentLanguage
    );
  }

  /**
   * 🏷️ Nom de la langue actuelle.
   */

  get currentLanguageName(): string {
    return this.languageService.getLanguageName(
      this.currentLanguage
    );
  }

  // ============================================================
  // TRADUCTION
  // ============================================================

  t(key: string): string {

    const translations: Record<
      Language,
      Record<string, string>
    > = {

      // ========================================================
      // FRANÇAIS
      // ========================================================

      fr: {

        login: 'Connexion',

        welcome:
          'Bienvenue sur JardiScan',

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

      // ========================================================
      // ENGLISH
      // ========================================================

      en: {

        login:
          'Login',

        welcome:
          'Welcome to JardiScan',

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

  // ============================================================
  // CONNEXION
  // ============================================================

  connecter(): void {

    this.submitted = true;

    this.errorMessage = '';

    this.successMessage = '';

    // ==========================================================
    // PROTECTION DOUBLE CLIC
    // ==========================================================

    if (
      this.isLoading ||
      this.guestLoading
    ) {
      return;
    }

    // ==========================================================
    // NETTOYAGE
    // ==========================================================

    const email =
      this.email
        .trim()
        .toLowerCase();

    const password =
      this.password;

    // ==========================================================
    // VALIDATION EMAIL
    // ==========================================================

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

    // ==========================================================
    // VALIDATION MOT DE PASSE
    // ==========================================================

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

    // ==========================================================
    // LOADING
    // ==========================================================

    this.isLoading = true;

    // ==========================================================
    // REQUÊTE LOGIN
    // ==========================================================

    this.http
      .post<LoginResponse>(
        this.LOGIN_URL,
        {
          email,

          // IMPORTANT :
          // Le backend attend "motDePasse"
          // et non "password".

          motDePasse: password
        }
      )
      .subscribe({

        // ========================================================
        // SUCCÈS
        // ========================================================

        next: (response) => {

          this.isLoading = false;

          // ======================================================
          // RÉCUPÉRATION UTILISATEUR
          // ======================================================

          const utilisateur =
            response?.user ||
            response?.utilisateur ||
            null;

          // ======================================================
          // VÉRIFICATION
          // ======================================================

          if (!utilisateur) {

            this.errorMessage =
              this.t('loginError');

            this.showErrorNotification(
              this.errorMessage
            );

            return;
          }

          // ======================================================
          // SAUVEGARDE DE LA SESSION COMPLÈTE
          // ======================================================

          this.saveUserSession(
            response,
            utilisateur
          );

          // ======================================================
          // MESSAGE
          // ======================================================

          this.successMessage =
            response?.message ||
            this.t('loginSuccess');

          this.showSuccessNotification(
            this.successMessage,
            2500
          );

          // ======================================================
          // REDIRECTION
          // ======================================================

          setTimeout(() => {

            this.router.navigate([
              '/accueil'
            ]);

          }, 1000);
        },

        // ========================================================
        // ERREUR
        // ========================================================

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

  // ============================================================
  // SAUVEGARDE SESSION
  // ============================================================

  private saveUserSession(
    response: LoginResponse,
    utilisateur: LoginUser
  ): void {

    // ==========================================================
    // TOKEN
    // ==========================================================

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

    // ==========================================================
    // UTILISATEUR
    // ==========================================================

    localStorage.setItem(
      this.USER_STORAGE_KEY,
      JSON.stringify(utilisateur)
    );

    // ==========================================================
    // ALIAS "UTILISATEUR"
    //
    // Permet aux autres composants de récupérer directement :
    //
    // localStorage.getItem('utilisateur')
    // ==========================================================

    localStorage.setItem(
      this.UTILISATEUR_STORAGE_KEY,
      JSON.stringify(utilisateur)
    );

    // ==========================================================
    // MODE
    // ==========================================================

    localStorage.setItem(
      this.MODE_STORAGE_KEY,
      'user'
    );

    // ==========================================================
    // SESSION COMPLÈTE
    // ==========================================================

    const session: JardiScanSession = {

      isLoggedIn: true,

      mode: 'user',

      token,

      user: utilisateur,

      loginAt:
        new Date().toISOString(),

      response:
        response as Record<string, unknown>
    };

    localStorage.setItem(
      this.SESSION_STORAGE_KEY,
      JSON.stringify(session)
    );
  }

  // ============================================================
  // RÉCUPÉRER LA SESSION
  // ============================================================

  getStoredSession(): JardiScanSession | null {

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

  // ============================================================
  // MODE INVITÉ
  // ============================================================

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

    // ==========================================================
    // NETTOYAGE SESSION UTILISATEUR
    // ==========================================================

    localStorage.removeItem(
      this.TOKEN_STORAGE_KEY
    );

    localStorage.removeItem(
      this.USER_STORAGE_KEY
    );

    localStorage.removeItem(
      this.UTILISATEUR_STORAGE_KEY
    );

    // ==========================================================
    // SESSION INVITÉ
    // ==========================================================

    const guestSession: JardiScanSession = {

      isLoggedIn: false,

      mode: 'guest',

      token: null,

      user: null,

      loginAt:
        new Date().toISOString()
    };

    localStorage.setItem(
      this.MODE_STORAGE_KEY,
      'guest'
    );

    localStorage.setItem(
      this.SESSION_STORAGE_KEY,
      JSON.stringify(guestSession)
    );

    // ==========================================================
    // REDIRECTION
    // ==========================================================

    setTimeout(() => {

      this.router.navigate([
        '/acceuil'
      ]);

    }, 250);
  }

  // ============================================================
  // EMAIL
  // ============================================================

  private isValidEmail(
    email: string
  ): boolean {

    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      .test(email);
  }

  // ============================================================
  // MESSAGE ERREUR BACKEND
  // ============================================================

  private getErrorMessage(
    error: HttpErrorResponse
  ): string {

    if (error.status === 0) {

      return (
        error.error?.message ||
        this.t('serverUnavailable')
      );
    }

    if (error.status === 400) {

      return (
        error.error?.message ||
        this.t('invalidInformation')
      );
    }

    if (error.status === 401) {

      return (
        error.error?.message ||
        this.t('invalidCredentials')
      );
    }

    if (error.status === 403) {

      return (
        error.error?.message ||
        this.t('accountUnavailable')
      );
    }

    if (error.status === 404) {

      return (
        error.error?.message ||
        this.t('accountNotFound')
      );
    }

    if (error.status === 500) {

      return (
        error.error?.message ||
        this.t('serverError')
      );
    }

    return (
      error.error?.message ||
      this.t('loginError')
    );
  }

  // ============================================================
  // MOT DE PASSE
  // ============================================================

  togglePassword(): void {

    this.showPassword =
      !this.showPassword;
  }

  // ============================================================
  // ÉTAT EMAIL
  // ============================================================

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

  // ============================================================
  // ÉTAT MOT DE PASSE
  // ============================================================

  isPasswordInvalid(): boolean {

    return (
      this.submitted &&
      (
        !this.password ||
        this.password.length < 6
      )
    );
  }

  // ============================================================
  // FORCE MOT DE PASSE
  // ============================================================

  getPasswordStrength(): number {

    if (!this.password) {
      return 0;
    }

    let strength = 0;

    if (
      this.password.length >= 6
    ) {
      strength++;
    }

    if (
      this.password.length >= 10
    ) {
      strength++;
    }

    if (
      /[A-Z]/.test(this.password)
    ) {
      strength++;
    }

    if (
      /[0-9]/.test(this.password)
    ) {
      strength++;
    }

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

  // ============================================================
  // LABEL FORCE
  // ============================================================

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

  // ============================================================
  // TOAST — SUCCÈS
  // ============================================================

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

  // ============================================================
  // TOAST — ERREUR
  // ============================================================

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

  // ============================================================
  // TOAST — AFFICHAGE
  // ============================================================

  private showNotificationMessage(
    message: string,
    type: NotificationType,
    duration: number
  ): void {

    // ==========================================================
    // NETTOYAGE ANCIEN TIMER
    // ==========================================================

    if (this.notificationTimeout) {

      clearTimeout(
        this.notificationTimeout
      );

      this.notificationTimeout = null;
    }

    // ==========================================================
    // NOUVELLE NOTIFICATION
    // ==========================================================

    this.notificationMessage =
      message;

    this.notificationType =
      type;

    this.showNotification =
      true;

    // ==========================================================
    // AUTO FERMETURE
    // ==========================================================

    this.notificationTimeout =
      setTimeout(() => {

        this.closeNotification();

      }, duration);
  }

  // ============================================================
  // FERMER TOAST
  // ============================================================

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

  // ============================================================
  // VALIDATION EMAIL TEMPLATE
  // ============================================================

  isValidEmailForTemplate(): boolean {

    return this.isValidEmail(
      this.email.trim()
    );
  }
}
