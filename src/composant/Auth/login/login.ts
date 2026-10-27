// login.ts

import { CommonModule } from '@angular/common';
import {
  HttpClient,
  HttpErrorResponse
} from '@angular/common/http';
import {
  Component,
  OnDestroy,
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
import { WelcomeLogoComponent } from '../../Share/Page-Header/welcome-logo/welcome-logo';


// ============================================================
// UTILISATEUR
// ============================================================

interface LoginUser {
  _id?: string;
  key?: string;
  resetPasswordKey?: string | null;
  resetPasswordExpire?: string | null;
  pseudo?: string;
  nom?: string;
  prenom?: string;
  email?: string;
  motDePasse?: string;
  avatar?: string;
  bannerColor?: string;
  role?: string;
  estActif?: boolean;
  jardiDex?: unknown[];
  createdAt?: string;
  updatedAt?: string;
  __v?: number;
  [key: string]: unknown;
}

// ============================================================
// RÉPONSE API
// ============================================================

interface LoginResponse {
  message?: string;
  token?: string;
  user?: LoginUser;
  utilisateur?: LoginUser;
  [key: string]: unknown;
}

// ============================================================
// SESSION ARBORIA
// ============================================================

interface ArboriaSession {
  isLoggedIn: boolean;
  mode: 'user' | 'guest';
  token: string | null;
  user: LoginUser | null;
  loginAt: string;
  response?: Record<string, unknown>;
}

type NotificationType = 'success' | 'error';

// ============================================================
// COMPOSANT CONNEXION ARBORIA
// ============================================================

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterLink,
    WelcomeLogoComponent
],
  templateUrl: './login.html',
  styleUrl: './login.css'
})
export class Login implements OnDestroy {

  // ==========================================================
  // SERVICES
  // ==========================================================

  public readonly themeService = inject(ThemeService);
  public readonly languageService = inject(LanguageService);

  private readonly http = inject(HttpClient);
  private readonly router = inject(Router);

  // ==========================================================
  // API
  // ==========================================================

  private readonly API_URL = 'http://localhost:3000/api/users';
  private readonly LOGIN_URL = `${this.API_URL}/login`;

  // ==========================================================
  // STOCKAGE
  // ==========================================================

  private readonly SESSION_STORAGE_KEY = 'jardiscan_session';
  private readonly USER_STORAGE_KEY = 'user';
  private readonly UTILISATEUR_STORAGE_KEY = 'utilisateur';
  private readonly TOKEN_STORAGE_KEY = 'token';
  private readonly MODE_STORAGE_KEY = 'mode';

  // ==========================================================
  // FORMULAIRE
  // ==========================================================

  email = '';
  password = '';
  rememberMe = false;

  // ==========================================================
  // ÉTATS
  // ==========================================================

  isLoading = false;
  submitted = false;
  showPassword = false;

  errorMessage = '';
  successMessage = '';

  guestLoading = false;

  // ==========================================================
  // NOTIFICATIONS
  // ==========================================================

  showNotification = false;
  notificationMessage = '';
  notificationType: NotificationType = 'success';

  private notificationTimeout: ReturnType<typeof setTimeout> | null = null;
  private redirectTimeout: ReturnType<typeof setTimeout> | null = null;

  // ==========================================================
  // LANGUE
  // ==========================================================

  get currentLanguage(): Language {
    return this.languageService.currentLanguage;
  }

  setLanguage(language: Language): void {
    this.languageService.setLanguage(language);
  }

  toggleLanguage(): void {
    this.languageService.toggleLanguage();
  }

  get currentLanguageFlag(): string {
    return this.languageService.getLanguageFlag(this.currentLanguage);
  }

  get currentLanguageName(): string {
    return this.languageService.getLanguageName(this.currentLanguage);
  }

  // ==========================================================
  // TRADUCTIONS FR / EN
  // ==========================================================

  t(key: string): string {
    const translations: Record<Language, Record<string, string>> = {
      fr: {
        login: 'Connexion',
        welcome: 'Bienvenue sur Arboria',
        subtitle: 'Connectez-vous pour retrouver votre univers végétal.',
        email: 'Adresse e-mail',
        emailPlaceholder: 'vous@exemple.fr',
        password: 'Mot de passe',
        passwordPlaceholder: 'Votre mot de passe',
        forgotPassword: 'Mot de passe oublié ?',
        connect: 'Se connecter à Arboria',
        connecting: 'Connexion en cours...',
        guest: 'Continuer comme invité',
        guestLoading: 'Accès invité...',
        noAccount: 'Vous découvrez Arboria ?',
        register: 'Créer un compte',
        weak: 'Faible',
        medium: 'Moyen',
        good: 'Bon',
        excellent: 'Excellent',
        emailRequired: 'Veuillez renseigner votre adresse e-mail.',
        emailInvalid: 'Veuillez renseigner une adresse e-mail valide.',
        passwordRequired: 'Veuillez renseigner votre mot de passe.',
        passwordMin: 'Le mot de passe doit contenir au moins 6 caractères.',
        loginSuccess: 'Connexion réussie.',
        serverUnavailable: 'Impossible de contacter le serveur. Vérifiez que le backend Arboria est démarré.',
        invalidInformation: 'Veuillez vérifier les informations renseignées.',
        invalidCredentials: 'Adresse e-mail ou mot de passe incorrect.',
        accountUnavailable: 'Votre compte ne peut pas être utilisé actuellement.',
        accountNotFound: 'Aucun compte ne correspond à cette adresse e-mail.',
        serverError: 'Une erreur serveur est survenue. Veuillez réessayer.',
        loginError: 'Impossible de vous connecter. Veuillez réessayer.'
      },
      en: {
        login: 'Login',
        welcome: 'Welcome to Arboria',
        subtitle: 'Log in to rediscover your botanical world.',
        email: 'Email address',
        emailPlaceholder: 'you@example.com',
        password: 'Password',
        passwordPlaceholder: 'Your password',
        forgotPassword: 'Forgot your password?',
        connect: 'Sign in to Arboria',
        connecting: 'Signing in...',
        guest: 'Continue as guest',
        guestLoading: 'Opening guest access...',
        noAccount: 'New to Arboria?',
        register: 'Create an account',
        weak: 'Weak',
        medium: 'Medium',
        good: 'Good',
        excellent: 'Excellent',
        emailRequired: 'Please enter your email address.',
        emailInvalid: 'Please enter a valid email address.',
        passwordRequired: 'Please enter your password.',
        passwordMin: 'Your password must contain at least 6 characters.',
        loginSuccess: 'Login successful.',
        serverUnavailable: 'Unable to contact the server. Check that the Arboria backend is running.',
        invalidInformation: 'Please check the information provided.',
        invalidCredentials: 'Incorrect email address or password.',
        accountUnavailable: 'Your account cannot currently be used.',
        accountNotFound: 'No account matches this email address.',
        serverError: 'A server error occurred. Please try again.',
        loginError: 'Unable to log in. Please try again.'
      }
    };

    return translations[this.currentLanguage]?.[key]
      ?? translations.fr[key]
      ?? key;
  }

  // ==========================================================
  // ANNÉE COURANTE
  // ==========================================================

  get anneeActuelle(): number {
    return new Date().getFullYear();
  }

  // ==========================================================
  // RÔLES
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

  isAdmin(role?: string): boolean {
    return (role ?? '').toUpperCase() === 'ADMIN';
  }

  // ==========================================================
  // UTILISATEUR STOCKÉ
  // ==========================================================

  getStoredUser(): LoginUser | null {
    try {
      const storedUser =
        localStorage.getItem(this.UTILISATEUR_STORAGE_KEY)
        ?? localStorage.getItem(this.USER_STORAGE_KEY);

      return storedUser
        ? JSON.parse(storedUser) as LoginUser
        : null;
    } catch {
      return null;
    }
  }

  getStoredUserRole(): string {
    return this.getStoredUser()?.role ?? 'VISITEUR';
  }

  isStoredUserAdmin(): boolean {
    return this.isAdmin(this.getStoredUserRole());
  }

  getStoredJardiDex(): unknown[] {
    return this.getStoredUser()?.jardiDex ?? [];
  }

  // ==========================================================
  // VALIDATION
  // ==========================================================

  private isValidEmail(value: string): boolean {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
  }

  isValidEmailForTemplate(): boolean {
    return this.isValidEmail(this.email.trim());
  }

  isEmailInvalid(): boolean {
    const value = this.email.trim();

    return this.submitted &&
      (!value || !this.isValidEmail(value));
  }

  isPasswordInvalid(): boolean {
    return this.submitted &&
      (!this.password || this.password.length < 6);
  }

  // ==========================================================
  // CONNEXION
  // ==========================================================

  connecter(): void {
    this.submitted = true;
    this.errorMessage = '';
    this.successMessage = '';

    if (this.isLoading || this.guestLoading) {
      return;
    }

    const email = this.email.trim().toLowerCase();
    const password = this.password;

    if (!email) {
      this.setError(this.t('emailRequired'));
      return;
    }

    if (!this.isValidEmail(email)) {
      this.setError(this.t('emailInvalid'));
      return;
    }

    if (!password) {
      this.setError(this.t('passwordRequired'));
      return;
    }

    if (password.length < 6) {
      this.setError(this.t('passwordMin'));
      return;
    }

    this.isLoading = true;

    this.http.post<LoginResponse>(
      this.LOGIN_URL,
      {
        email,
        motDePasse: password
      }
    ).subscribe({
      next: (response) => {
        this.isLoading = false;

        const utilisateur =
          response?.user ??
          response?.utilisateur ??
          null;

        if (!utilisateur) {
          this.setError(this.t('loginError'));
          return;
        }

        try {
          this.saveUserSession(response, utilisateur);
        } catch {
          this.setError(this.t('loginError'));
          return;
        }

        this.successMessage =
          response?.message ?? this.t('loginSuccess');

        this.showSuccessNotification(this.successMessage, 1800);

        this.clearRedirectTimeout();

        this.redirectTimeout = setTimeout(() => {
          this.redirectTimeout = null;
          void this.router.navigate(['/accueil']);
        }, 900);
      },

      error: (error: HttpErrorResponse) => {
        this.isLoading = false;
        this.setError(this.getErrorMessage(error));
      }
    });
  }

  // Alias conservé pour les templates utilisant seConnecter().
  seConnecter(): void {
    this.connecter();
  }

  private setError(message: string): void {
    this.errorMessage = message;
    this.successMessage = '';
    this.showErrorNotification(message);
  }

  // ==========================================================
  // SAUVEGARDE SESSION
  // ==========================================================

  private saveUserSession(
    response: LoginResponse,
    utilisateur: LoginUser
  ): void {
    const utilisateurComplet: LoginUser = {
      ...utilisateur
    };

    const token = response?.token ?? null;

    if (token) {
      localStorage.setItem(this.TOKEN_STORAGE_KEY, token);
    } else {
      localStorage.removeItem(this.TOKEN_STORAGE_KEY);
    }

    localStorage.setItem(
      this.USER_STORAGE_KEY,
      JSON.stringify(utilisateurComplet)
    );

    localStorage.setItem(
      this.UTILISATEUR_STORAGE_KEY,
      JSON.stringify(utilisateurComplet)
    );

    localStorage.setItem(this.MODE_STORAGE_KEY, 'user');

    const session: ArboriaSession = {
      isLoggedIn: true,
      mode: 'user',
      token,
      user: utilisateurComplet,
      loginAt: new Date().toISOString(),
      response: response as Record<string, unknown>
    };

    localStorage.setItem(
      this.SESSION_STORAGE_KEY,
      JSON.stringify(session)
    );
  }

  // ==========================================================
  // RÉCUPÉRATION SESSION
  // ==========================================================

  getStoredSession(): ArboriaSession | null {
    try {
      const value = localStorage.getItem(this.SESSION_STORAGE_KEY);

      return value
        ? JSON.parse(value) as ArboriaSession
        : null;
    } catch {
      return null;
    }
  }

  // ==========================================================
  // MODE INVITÉ
  // ==========================================================

  continuerCommeInvite(): void {
    if (this.isLoading || this.guestLoading) {
      return;
    }

    this.guestLoading = true;
    this.errorMessage = '';
    this.successMessage = '';

    try {
      localStorage.removeItem(this.TOKEN_STORAGE_KEY);
      localStorage.removeItem(this.USER_STORAGE_KEY);
      localStorage.removeItem(this.UTILISATEUR_STORAGE_KEY);

      const guestSession: ArboriaSession = {
        isLoggedIn: false,
        mode: 'guest',
        token: null,
        user: null,
        loginAt: new Date().toISOString()
      };

      localStorage.setItem(this.MODE_STORAGE_KEY, 'guest');
      localStorage.setItem(
        this.SESSION_STORAGE_KEY,
        JSON.stringify(guestSession)
      );
    } catch {
      this.guestLoading = false;
      this.setError(this.t('loginError'));
      return;
    }

    this.clearRedirectTimeout();

    this.redirectTimeout = setTimeout(() => {
      this.redirectTimeout = null;

      void this.router.navigate(['/accueil']).finally(() => {
        this.guestLoading = false;
      });
    }, 200);
  }

  // ==========================================================
  // MOT DE PASSE
  // ==========================================================

  togglePassword(): void {
    this.showPassword = !this.showPassword;
  }

  getPasswordStrength(): number {
    if (!this.password) {
      return 0;
    }

    let strength = 0;

    if (this.password.length >= 6) strength++;
    if (this.password.length >= 10) strength++;
    if (/[A-Z]/.test(this.password)) strength++;
    if (/[0-9]/.test(this.password)) strength++;
    if (/[^A-Za-z0-9]/.test(this.password)) strength++;

    return Math.min(strength, 5);
  }

  getPasswordStrengthLabel(): string {
    const strength = this.getPasswordStrength();

    if (strength === 0) return '';
    if (strength <= 1) return this.t('weak');
    if (strength <= 2) return this.t('medium');
    if (strength <= 3) return this.t('good');

    return this.t('excellent');
  }

  // ==========================================================
  // GESTION DES ERREURS API
  // ==========================================================

  private getErrorMessage(error: HttpErrorResponse): string {
    const serverMessage =
      typeof error.error?.message === 'string'
        ? error.error.message
        : null;

    if (error.status === 0) {
      return serverMessage ?? this.t('serverUnavailable');
    }

    if (error.status === 400) {
      return serverMessage ?? this.t('invalidInformation');
    }

    if (error.status === 401) {
      return serverMessage ?? this.t('invalidCredentials');
    }

    if (error.status === 403) {
      return serverMessage ?? this.t('accountUnavailable');
    }

    if (error.status === 404) {
      return serverMessage ?? this.t('accountNotFound');
    }

    if (error.status >= 500) {
      return serverMessage ?? this.t('serverError');
    }

    return serverMessage ?? this.t('loginError');
  }

  // ==========================================================
  // NOTIFICATIONS
  // ==========================================================

  private showSuccessNotification(
    message: string,
    duration = 4000
  ): void {
    this.showNotificationMessage(message, 'success', duration);
  }

  private showErrorNotification(
    message: string,
    duration = 5000
  ): void {
    this.showNotificationMessage(message, 'error', duration);
  }

  private showNotificationMessage(
    message: string,
    type: NotificationType,
    duration: number
  ): void {
    if (this.notificationTimeout) {
      clearTimeout(this.notificationTimeout);
    }

    this.notificationMessage = message;
    this.notificationType = type;
    this.showNotification = true;

    this.notificationTimeout = setTimeout(() => {
      this.closeNotification();
    }, duration);
  }

  closeNotification(): void {
    if (this.notificationTimeout) {
      clearTimeout(this.notificationTimeout);
      this.notificationTimeout = null;
    }

    this.showNotification = false;
  }

  private clearRedirectTimeout(): void {
    if (this.redirectTimeout) {
      clearTimeout(this.redirectTimeout);
      this.redirectTimeout = null;
    }
  }

  // ==========================================================
  // NETTOYAGE
  // ==========================================================

  ngOnDestroy(): void {
    if (this.notificationTimeout) {
      clearTimeout(this.notificationTimeout);
      this.notificationTimeout = null;
    }

    this.clearRedirectTimeout();
  }
}