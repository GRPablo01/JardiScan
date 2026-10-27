
import { CommonModule } from '@angular/common';
import {
  HttpClient,
  HttpErrorResponse
} from '@angular/common/http';
import {
  Component,
  DestroyRef,
  inject
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
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
// ARBORIA — TYPES
// ============================================================

interface RegisterUser {
  _id: string;
  key: string;
  pseudo: string;
  nom: string;
  prenom: string;
  email: string;
  avatar: string;
  role: string;
  estActif: boolean;
  createdAt: string;
  updatedAt: string;
  [key: string]: unknown;
}

interface RegisterResponse {
  message: string;
  utilisateur?: RegisterUser;
  token?: string;
  [key: string]: unknown;
}

interface JardiScanSession {
  isLoggedIn: boolean;
  mode: 'user' | 'guest';
  token: string | null;
  user: RegisterUser | null;
  loginAt: string;
  response?: Record<string, unknown>;
}

type NotificationType = 'success' | 'error';

type TranslationDictionary = Record<string, string>;

// ============================================================
// COMPONENT
// ============================================================

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterLink,
    WelcomeLogoComponent,
  ],
  templateUrl: './register.html',
  styleUrl: './register.css'
})
export class Register {

  // ==========================================================
  // SERVICES
  // ==========================================================

  public readonly themeService = inject(ThemeService);
  public readonly languageService = inject(LanguageService);

  private readonly http = inject(HttpClient);
  private readonly router = inject(Router);
  private readonly destroyRef = inject(DestroyRef);

  // ==========================================================
  // API
  // ==========================================================

  private readonly API_URL = 'http://localhost:3000/api/users';
  private readonly REGISTER_URL = `${this.API_URL}/register`;

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

  pseudo = '';
  nom = '';
  prenom = '';
  email = '';
  password = '';
  confirmPassword = '';

  // ==========================================================
  // AVATAR
  // ==========================================================

  avatar: File | null = null;
  avatarPreview: string | null = null;

  // ==========================================================
  // ÉTAT
  // ==========================================================

  isLoading = false;
  errorMessage = '';
  successMessage = '';
  submitted = false;

  showPassword = false;
  showConfirmPassword = false;

  currentStep = 1;
  readonly totalSteps = 5;

  // ==========================================================
  // NOTIFICATIONS
  // ==========================================================

  showNotification = false;
  notificationMessage = '';
  notificationType: NotificationType = 'success';

  loginHover = false;

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
  // TRADUCTIONS
  // ==========================================================

  private readonly translations: Record<Language, TranslationDictionary> = {
    fr: {
      createAccount: 'Créer un compte',
      registerSubtitle: 'Rejoignez Arboria et prenez soin de vos plantes',
      step: 'Étape',
      of: 'sur',

      yourIdentity: 'Votre identité',
      identity: 'Votre identité',
      identityDescription: 'Commencez par renseigner vos informations personnelles.',
      username: 'Pseudo',
      usernamePlaceholder: 'Votre pseudo',
      usernameMin: 'Le pseudo doit contenir au moins 2 caractères.',
      usernameMax: 'Le pseudo ne peut pas dépasser 30 caractères.',
      usernameRequired: 'Veuillez renseigner votre pseudo.',
      lastName: 'Nom',
      lastNamePlaceholder: 'Votre nom',
      lastNameRequired: 'Veuillez renseigner votre nom.',
      lastNameMax: 'Le nom ne peut pas dépasser 50 caractères.',
      firstName: 'Prénom',
      firstNamePlaceholder: 'Votre prénom',
      firstNameRequired: 'Veuillez renseigner votre prénom.',
      firstNameMax: 'Le prénom ne peut pas dépasser 50 caractères.',

      secureAccount: 'Sécurisez votre compte',
      secureDescription: 'Choisissez votre adresse e-mail et votre mot de passe.',
      email: 'Adresse e-mail',
      emailPlaceholder: 'vous@exemple.com',
      emailRequired: 'Veuillez renseigner votre adresse e-mail.',
      emailInvalid: 'Veuillez renseigner une adresse e-mail valide.',
      password: 'Mot de passe',
      passwordPlaceholder: 'Votre mot de passe',
      passwordRequired: 'Veuillez renseigner un mot de passe.',
      passwordMin: 'Le mot de passe doit contenir au moins 6 caractères.',

      confirmPasswordTitle: 'Confirmez votre mot de passe',
      passwordConfirmation: 'Confirmation du mot de passe',
      confirmPasswordDescription: 'Une dernière vérification avant de terminer votre inscription.',
      confirmPassword: 'Confirmer le mot de passe',
      confirmPasswordPlaceholder: 'Confirmez votre mot de passe',
      passwordMismatch: 'Les deux mots de passe ne correspondent pas.',
      securePassword: 'Mot de passe sécurisé',
      securePasswordDescription: 'Choisissez un mot de passe suffisamment robuste pour protéger votre compte.',

      yourProfile: 'Votre profil',
      profile: 'Votre profil',
      profileDescription: 'Ajoutez une image à votre profil si vous le souhaitez.',
      avatar: 'Avatar',
      optional: 'optionnel',
      changePhoto: 'Modifier votre photo',
      addPhoto: 'Ajouter une photo',
      photoInstruction: 'Cliquez pour choisir une image depuis votre appareil',
      supportedImageFormats: 'JPG, PNG ou WEBP',
      removeImage: 'Supprimer l’image',
      optionalProfilePhoto: 'Votre photo de profil est optionnelle',
      optionalProfilePhotoDescription: 'Vous pouvez continuer sans image et la modifier plus tard depuis votre profil.',
      avatarPreview: 'Aperçu de votre avatar',

      summary: 'Récapitulatif',
      summaryDescription: 'Vérifiez vos informations avant de créer votre compte.',
      profilePhotoAdded: 'Photo de profil ajoutée',
      noPhoto: 'Aucune photo',
      personalInformation: 'Informations personnelles',
      connection: 'Connexion',
      accountReady: 'Votre compte est prêt à être créé',
      accountReadyDescription: 'Votre compte sera créé avec le rôle',
      visitorRole: 'VISITEUR',
      secureInformation: 'Vos informations seront enregistrées de manière sécurisée.',

      previous: 'Précédent',
      continue: 'Continuer',
      createMyAccount: 'Créer mon compte',
      creatingAccount: 'Création du compte...',
      alreadyAccount: 'Vous avez déjà un compte ?',
      login: 'Se connecter',

      weak: 'Faible',
      medium: 'Moyen',
      good: 'Bon',
      excellent: 'Excellent',
      sixCharactersMinimum: '6 caractères minimum',

      hidePassword: 'Masquer le mot de passe',
      showPassword: 'Afficher le mot de passe',
      hideConfirmation: 'Masquer la confirmation',
      showConfirmation: 'Afficher la confirmation',

      step1Error: 'Veuillez compléter correctement vos informations personnelles.',
      step2Error: 'Veuillez vérifier vos informations de connexion.',
      step3Error: 'Les deux mots de passe ne correspondent pas.',
      genericStepError: 'Veuillez vérifier les informations renseignées.',

      serverUnavailable: 'Impossible de contacter le serveur. Vérifiez que le backend Arboria est bien démarré.',
      invalidInformation: 'Les informations renseignées sont invalides.',
      accountAlreadyExists: 'Cette adresse e-mail ou ce pseudo est déjà utilisé.',
      serverError: 'Une erreur serveur est survenue lors de la création du compte.',
      registerError: 'Impossible de créer votre compte. Veuillez réessayer.',
      accountCreated: 'Votre compte a été créé avec succès.',

      invalidImageType: 'Veuillez sélectionner une image JPG, PNG ou WEBP.',
      imageTooLarge: 'L’image ne doit pas dépasser 5 Mo.',

      success: 'Succès',
      error: 'Erreur',
      closeNotification: 'Fermer la notification'
    },

    en: {
      createAccount: 'Create an account',
      registerSubtitle: 'Join Arboria and take care of your plants',
      step: 'Step',
      of: 'of',

      yourIdentity: 'Your identity',
      identity: 'Your identity',
      identityDescription: 'Start by entering your personal information.',
      username: 'Username',
      usernamePlaceholder: 'Your username',
      usernameMin: 'The username must contain at least 2 characters.',
      usernameMax: 'The username cannot exceed 30 characters.',
      usernameRequired: 'Please enter your username.',
      lastName: 'Last name',
      lastNamePlaceholder: 'Your last name',
      lastNameRequired: 'Please enter your last name.',
      lastNameMax: 'The last name cannot exceed 50 characters.',
      firstName: 'First name',
      firstNamePlaceholder: 'Your first name',
      firstNameRequired: 'Please enter your first name.',
      firstNameMax: 'The first name cannot exceed 50 characters.',

      secureAccount: 'Secure your account',
      secureDescription: 'Choose your email address and password.',
      email: 'Email address',
      emailPlaceholder: 'you@example.com',
      emailRequired: 'Please enter your email address.',
      emailInvalid: 'Please enter a valid email address.',
      password: 'Password',
      passwordPlaceholder: 'Your password',
      passwordRequired: 'Please enter a password.',
      passwordMin: 'The password must contain at least 6 characters.',

      confirmPasswordTitle: 'Confirm your password',
      passwordConfirmation: 'Password confirmation',
      confirmPasswordDescription: 'One final check before completing your registration.',
      confirmPassword: 'Confirm password',
      confirmPasswordPlaceholder: 'Confirm your password',
      passwordMismatch: 'The two passwords do not match.',
      securePassword: 'Secure password',
      securePasswordDescription: 'Choose a strong enough password to protect your account.',

      yourProfile: 'Your profile',
      profile: 'Your profile',
      profileDescription: 'Add a profile image if you wish.',
      avatar: 'Avatar',
      optional: 'optional',
      changePhoto: 'Change your photo',
      addPhoto: 'Add a photo',
      photoInstruction: 'Click to choose an image from your device',
      supportedImageFormats: 'JPG, PNG or WEBP',
      removeImage: 'Remove image',
      optionalProfilePhoto: 'Your profile photo is optional',
      optionalProfilePhotoDescription: 'You can continue without an image and change it later from your profile.',
      avatarPreview: 'Profile avatar preview',

      summary: 'Summary',
      summaryDescription: 'Check your information before creating your account.',
      profilePhotoAdded: 'Profile photo added',
      noPhoto: 'No photo',
      personalInformation: 'Personal information',
      connection: 'Login',
      accountReady: 'Your account is ready to be created',
      accountReadyDescription: 'Your account will be created with the role',
      visitorRole: 'VISITOR',
      secureInformation: 'Your information will be stored securely.',

      previous: 'Previous',
      continue: 'Continue',
      createMyAccount: 'Create my account',
      creatingAccount: 'Creating account...',
      alreadyAccount: 'Already have an account?',
      login: 'Sign in',

      weak: 'Weak',
      medium: 'Medium',
      good: 'Good',
      excellent: 'Excellent',
      sixCharactersMinimum: '6 characters minimum',

      hidePassword: 'Hide password',
      showPassword: 'Show password',
      hideConfirmation: 'Hide confirmation',
      showConfirmation: 'Show confirmation',

      step1Error: 'Please complete your personal information correctly.',
      step2Error: 'Please check your login information.',
      step3Error: 'The two passwords do not match.',
      genericStepError: 'Please check the information entered.',

      serverUnavailable: 'Unable to contact the server. Make sure the Arboria backend is running.',
      invalidInformation: 'The information provided is invalid.',
      accountAlreadyExists: 'This email address or username is already in use.',
      serverError: 'A server error occurred while creating your account.',
      registerError: 'Unable to create your account. Please try again.',
      accountCreated: 'Your account has been successfully created.',

      invalidImageType: 'Please select a JPG, PNG or WEBP image.',
      imageTooLarge: 'The image must not exceed 5 MB.',

      success: 'Success',
      error: 'Error',
      closeNotification: 'Close notification'
    }
  };

  t(key: string): string {
    return (
      this.translations[this.currentLanguage]?.[key] ??
      this.translations.fr[key] ??
      key
    );
  }

  // ==========================================================
  // INSCRIPTION
  // ==========================================================


inscrire(): void {
  if (this.isLoading) {
    return;
  }

  this.submitted = true;
  this.errorMessage = '';
  this.successMessage = '';

  const validationError = this.validateAllFields();

  if (validationError) {
    this.errorMessage = validationError;
    this.showErrorNotification(validationError);
    return;
  }

  this.isLoading = true;

  const formData = new FormData();

  formData.append('pseudo', this.pseudo.trim());
  formData.append('nom', this.nom.trim());
  formData.append('prenom', this.prenom.trim());
  formData.append('email', this.email.trim().toLowerCase());
  formData.append('motDePasse', this.password);
  formData.append('role', 'VISITEUR');

  if (this.avatar) {
    formData.append('avatar', this.avatar, this.avatar.name);
  }

  this.http
    .post<RegisterResponse>(this.REGISTER_URL, formData)
    .pipe(takeUntilDestroyed(this.destroyRef))
    .subscribe({
      next: (response) => {
        this.isLoading = false;

        const utilisateur = response?.utilisateur;

        if (!utilisateur) {
          this.errorMessage = this.t('registerError');
          this.showErrorNotification(this.errorMessage);
          return;
        }

        try {
          this.saveUserSession(response, utilisateur);
        } catch {
          this.errorMessage = this.t('registerError');
          this.showErrorNotification(this.errorMessage);
          return;
        }

        this.successMessage = response.message || this.t('accountCreated');
        this.showSuccessNotification(this.successMessage, 1500);

        this.password = '';
        this.confirmPassword = '';

        // Redirection immédiate vers la page d'accueil.
        void this.router.navigateByUrl('/accueil', {
          replaceUrl: true
        });
      },

      error: (error: HttpErrorResponse) => {
        this.isLoading = false;
        this.errorMessage = this.getErrorMessage(error);
        this.showErrorNotification(this.errorMessage);
      }
    });
}
  private validateAllFields(): string | null {
    const pseudo = this.pseudo.trim();
    const nom = this.nom.trim();
    const prenom = this.prenom.trim();
    const email = this.email.trim().toLowerCase();

    if (!pseudo) return this.t('usernameRequired');
    if (pseudo.length < 2) return this.t('usernameMin');
    if (pseudo.length > 30) return this.t('usernameMax');

    if (!nom) return this.t('lastNameRequired');
    if (nom.length > 50) return this.t('lastNameMax');

    if (!prenom) return this.t('firstNameRequired');
    if (prenom.length > 50) return this.t('firstNameMax');

    if (!email) return this.t('emailRequired');
    if (!this.isValidEmail(email)) return this.t('emailInvalid');

    if (!this.password) return this.t('passwordRequired');
    if (this.password.length < 6) return this.t('passwordMin');

    if (!this.confirmPassword || this.password !== this.confirmPassword) {
      return this.t('passwordMismatch');
    }

    return null;
  }

  // ==========================================================
  // SESSION
  // ==========================================================

  private saveUserSession(
    response: RegisterResponse,
    utilisateur: RegisterUser
  ): void {
    const token = response.token ?? null;

    if (token) {
      localStorage.setItem(this.TOKEN_STORAGE_KEY, token);
    } else {
      localStorage.removeItem(this.TOKEN_STORAGE_KEY);
    }

    localStorage.setItem(this.USER_STORAGE_KEY, JSON.stringify(utilisateur));
    localStorage.setItem(this.UTILISATEUR_STORAGE_KEY, JSON.stringify(utilisateur));
    localStorage.setItem(this.MODE_STORAGE_KEY, 'user');

    const session: JardiScanSession = {
      isLoggedIn: true,
      mode: 'user',
      token,
      user: utilisateur,
      loginAt: new Date().toISOString(),
      response
    };

    localStorage.setItem(this.SESSION_STORAGE_KEY, JSON.stringify(session));
  }

  getStoredSession(): JardiScanSession | null {
    try {
      const session = localStorage.getItem(this.SESSION_STORAGE_KEY);

      return session
        ? JSON.parse(session) as JardiScanSession
        : null;
    } catch {
      return null;
    }
  }

  // ==========================================================
  // AVATAR
  // ==========================================================

  onAvatarSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];

    if (!file) {
      return;
    }

    const allowedTypes = [
      'image/jpeg',
      'image/png',
      'image/webp'
    ];

    if (!allowedTypes.includes(file.type)) {
      this.removeAvatar();
      this.showErrorNotification(this.t('invalidImageType'));
      return;
    }

    const maxSize = 5 * 1024 * 1024;

    if (file.size > maxSize) {
      this.removeAvatar();
      this.showErrorNotification(this.t('imageTooLarge'));
      return;
    }

    this.releaseAvatarPreview();

    this.avatar = file;
    this.avatarPreview = URL.createObjectURL(file);
  }

  removeAvatar(): void {
    this.releaseAvatarPreview();
    this.avatar = null;
    this.avatarPreview = null;

    const input = document.getElementById('avatar') as HTMLInputElement | null;

    if (input) {
      input.value = '';
    }
  }

  private releaseAvatarPreview(): void {
    if (this.avatarPreview) {
      URL.revokeObjectURL(this.avatarPreview);
      this.avatarPreview = null;
    }
  }

  // ==========================================================
  // EMAIL
  // ==========================================================

  private isValidEmail(email: string): boolean {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }

  // ==========================================================
  // ERREURS BACKEND
  // ==========================================================

  private getErrorMessage(error: HttpErrorResponse): string {
    if (error.status === 0) {
      return this.t('serverUnavailable');
    }

    if (error.status === 400) {
      return error.error?.message || this.t('invalidInformation');
    }

    if (error.status === 409) {
      return error.error?.message || this.t('accountAlreadyExists');
    }

    if (error.status >= 500) {
      return error.error?.message || this.t('serverError');
    }

    return error.error?.message || this.t('registerError');
  }

  // ==========================================================
  // VISIBILITÉ DES MOTS DE PASSE
  // ==========================================================

  togglePassword(): void {
    this.showPassword = !this.showPassword;
  }

  toggleConfirmPassword(): void {
    this.showConfirmPassword = !this.showConfirmPassword;
  }

  // ==========================================================
  // CONNEXION
  // ==========================================================

  goToLogin(): void {
    if (this.isLoading) {
      return;
    }

    void this.router.navigate(['/connexion']);
  }

  // ==========================================================
  // VALIDATION DES CHAMPS
  // ==========================================================

  isFieldInvalid(value: string): boolean {
    return this.submitted && !value.trim();
  }

  isPasswordConfirmationInvalid(): boolean {
    return (
      this.submitted &&
      !!this.confirmPassword &&
      this.password !== this.confirmPassword
    );
  }

  // ==========================================================
  // FORCE DU MOT DE PASSE
  // ==========================================================

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
  // ÉTAPES
  // ==========================================================

  getStepLabel(): string {
    switch (this.currentStep) {
      case 1: return this.t('yourIdentity');
      case 2: return this.t('secureAccount');
      case 3: return this.t('passwordConfirmation');
      case 4: return this.t('yourProfile');
      case 5: return this.t('summary');
      default: return '';
    }
  }

  private isCurrentStepValid(): boolean {
    switch (this.currentStep) {
      case 1:
        return (
          this.pseudo.trim().length >= 2 &&
          this.pseudo.trim().length <= 30 &&
          this.nom.trim().length >= 1 &&
          this.nom.trim().length <= 50 &&
          this.prenom.trim().length >= 1 &&
          this.prenom.trim().length <= 50
        );

      case 2:
        return (
          this.isValidEmail(this.email.trim()) &&
          this.password.length >= 6
        );

      case 3:
        return (
          !!this.confirmPassword &&
          this.confirmPassword === this.password
        );

      case 4:
      case 5:
        return true;

      default:
        return false;
    }
  }

  submitCurrentStep(): void {
    if (this.isLoading) {
      return;
    }

    this.submitted = true;

    if (!this.isCurrentStepValid()) {
      const message = this.getCurrentStepErrorMessage();
      this.errorMessage = message;
      this.showErrorNotification(message);
      return;
    }

    if (this.currentStep < this.totalSteps) {
      this.nextStep();
      return;
    }

    this.inscrire();
  }

  private getCurrentStepErrorMessage(): string {
    switch (this.currentStep) {
      case 1: {
        const pseudo = this.pseudo.trim();
        const nom = this.nom.trim();
        const prenom = this.prenom.trim();

        if (!pseudo) return this.t('usernameRequired');
        if (pseudo.length < 2) return this.t('usernameMin');
        if (pseudo.length > 30) return this.t('usernameMax');
        if (!nom) return this.t('lastNameRequired');
        if (nom.length > 50) return this.t('lastNameMax');
        if (!prenom) return this.t('firstNameRequired');
        if (prenom.length > 50) return this.t('firstNameMax');

        return this.t('step1Error');
      }

      case 2:
        if (!this.email.trim()) return this.t('emailRequired');
        if (!this.isValidEmail(this.email.trim())) return this.t('emailInvalid');
        if (!this.password) return this.t('passwordRequired');
        if (this.password.length < 6) return this.t('passwordMin');

        return this.t('step2Error');

      case 3:
        return this.t('step3Error');

      default:
        return this.t('genericStepError');
    }
  }

  nextStep(): void {
    if (this.currentStep >= this.totalSteps || this.isLoading) {
      return;
    }

    this.submitted = false;
    this.errorMessage = '';
    this.successMessage = '';
    this.currentStep++;

    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  }

  previousStep(): void {
    if (this.currentStep <= 1 || this.isLoading) {
      return;
    }

    this.submitted = false;
    this.errorMessage = '';
    this.successMessage = '';
    this.currentStep--;

    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
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
      this.notificationTimeout = null;
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

  // ==========================================================
  // NETTOYAGE
  // ==========================================================

  ngOnDestroy(): void {
    this.releaseAvatarPreview();

    if (this.notificationTimeout) {
      clearTimeout(this.notificationTimeout);
      this.notificationTimeout = null;
    }

    if (this.redirectTimeout) {
      clearTimeout(this.redirectTimeout);
      this.redirectTimeout = null;
    }
  }
}
