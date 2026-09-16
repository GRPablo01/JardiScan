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
// UTILISATEUR REGISTER
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

  // Permet de conserver d'éventuels champs
  // supplémentaires renvoyés par le backend.
  [key: string]: unknown;
}

// ============================================================
// RÉPONSE REGISTER
// ============================================================

interface RegisterResponse {

  message: string;

  utilisateur?: RegisterUser;

  token?: string;

  // Permet de conserver toute autre donnée
  // renvoyée par le backend.
  [key: string]: unknown;
}

// ============================================================
// SESSION LOCALSTORAGE
// ============================================================

interface JardiScanSession {

  isLoggedIn: boolean;

  mode: 'user' | 'guest';

  token: string | null;

  user: RegisterUser | null;

  loginAt: string;

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

  selector: 'app-register',

  standalone: true,

  imports: [
    CommonModule,
    FormsModule,
    RouterLink
  ],

  templateUrl: './register.html',

  styleUrl: './register.css'
})

export class Register {

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

  private readonly API_URL =
    'http://localhost:3000/api/users';

  private readonly REGISTER_URL =
    `${this.API_URL}/register`;

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

  pseudo = '';

  nom = '';

  prenom = '';

  email = '';

  password = '';

  confirmPassword = '';

  // ============================================================
  // AVATAR
  // ============================================================

  avatar: File | null = null;

  avatarPreview: string | null = null;

  // ============================================================
  // ÉTAT
  // ============================================================

  isLoading = false;

  errorMessage = '';

  successMessage = '';

  // ============================================================
  // MOT DE PASSE
  // ============================================================

  showPassword = false;

  showConfirmPassword = false;

  // ============================================================
  // VALIDATION
  // ============================================================

  submitted = false;

  // ============================================================
  // ÉTAPES
  // ============================================================

  currentStep = 1;

  readonly totalSteps = 5;

  // ============================================================
  // TOAST
  // ============================================================

  showNotification = false;

  notificationMessage = '';

  notificationType: NotificationType = 'success';

  private notificationTimeout:
    ReturnType<typeof setTimeout> | null = null;

  // ============================================================
  // LANGUE
  // ============================================================

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
    return this.languageService.getLanguageFlag(
      this.currentLanguage
    );
  }

  get currentLanguageName(): string {
    return this.languageService.getLanguageName(
      this.currentLanguage
    );
  }

  // ============================================================
  // TRADUCTIONS
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

        // ------------------------------------------------------
        // HEADER
        // ------------------------------------------------------

        createAccount:
          'Créer un compte',

        registerSubtitle:
          'Rejoignez JardiScan et prenez soin de vos plantes',

        // ------------------------------------------------------
        // PROGRESSION
        // ------------------------------------------------------

        step:
          'Étape',

        of:
          'sur',

        // ------------------------------------------------------
        // ÉTAPE 1
        // ------------------------------------------------------

        yourIdentity:
          'Votre identité',

        identity:
          'Votre identité',

        identityDescription:
          'Commencez par renseigner vos informations personnelles.',

        username:
          'Pseudo',

        usernamePlaceholder:
          'Votre pseudo',

        usernameMin:
          'Le pseudo doit contenir au moins 2 caractères.',

        usernameMax:
          'Le pseudo ne peut pas dépasser 30 caractères.',

        usernameRequired:
          'Veuillez renseigner votre pseudo.',

        lastName:
          'Nom',

        lastNamePlaceholder:
          'Votre nom',

        lastNameRequired:
          'Veuillez renseigner votre nom.',

        lastNameMax:
          'Le nom ne peut pas dépasser 50 caractères.',

        firstName:
          'Prénom',

        firstNamePlaceholder:
          'Votre prénom',

        firstNameRequired:
          'Veuillez renseigner votre prénom.',

        firstNameMax:
          'Le prénom ne peut pas dépasser 50 caractères.',

        // ------------------------------------------------------
        // ÉTAPE 2
        // ------------------------------------------------------

        secureAccount:
          'Sécurisez votre compte',

        secureDescription:
          'Choisissez votre adresse e-mail et votre mot de passe.',

        email:
          'Adresse e-mail',

        emailPlaceholder:
          'vous@exemple.com',

        emailRequired:
          'Veuillez renseigner votre adresse e-mail.',

        emailInvalid:
          'Veuillez renseigner une adresse e-mail valide.',

        password:
          'Mot de passe',

        passwordPlaceholder:
          'Votre mot de passe',

        passwordRequired:
          'Veuillez renseigner un mot de passe.',

        passwordMin:
          'Le mot de passe doit contenir au moins 6 caractères.',

        // ------------------------------------------------------
        // ÉTAPE 3
        // ------------------------------------------------------

        confirmPasswordTitle:
          'Confirmez votre mot de passe',

        passwordConfirmation:
          'Confirmation du mot de passe',

        confirmPasswordDescription:
          'Une dernière vérification avant de terminer votre inscription.',

        confirmPassword:
          'Confirmer le mot de passe',

        confirmPasswordPlaceholder:
          'Confirmez votre mot de passe',

        passwordMismatch:
          'Les deux mots de passe ne correspondent pas.',

        securePassword:
          'Mot de passe sécurisé',

        securePasswordDescription:
          "Votre mot de passe sera sécurisé avant d'être enregistré.",

        // ------------------------------------------------------
        // ÉTAPE 4
        // ------------------------------------------------------

        yourProfile:
          'Votre profil',

        profile:
          'Votre profil',

        profileDescription:
          'Ajoutez une image à votre profil si vous le souhaitez.',

        avatar:
          'Avatar',

        optional:
          'optionnel',

        changePhoto:
          'Modifier votre photo',

        addPhoto:
          'Ajouter une photo',

        photoInstruction:
          'Cliquez pour choisir une image depuis votre appareil',

        supportedImageFormats:
          'JPG, PNG ou WEBP',

        removeImage:
          "Supprimer l'image",

        optionalProfilePhoto:
          'Votre photo de profil est optionnelle',

        optionalProfilePhotoDescription:
          "Vous pouvez continuer sans ajouter d'image et la modifier plus tard depuis votre profil.",

        avatarPreview:
          'Aperçu de votre avatar',

        // ------------------------------------------------------
        // ÉTAPE 5
        // ------------------------------------------------------

        summary:
          'Récapitulatif',

        summaryDescription:
          'Vérifiez vos informations avant de créer votre compte.',

        profilePhotoAdded:
          'Photo de profil ajoutée',

        noPhoto:
          'Aucune photo',

        personalInformation:
          'Informations personnelles',

        connection:
          'Connexion',

        accountReady:
          'Votre compte est prêt à être créé',

        accountReadyDescription:
          'Votre compte sera créé avec le rôle',

        visitorRole:
          'VISITEUR',

        secureInformation:
          'Vos informations seront enregistrées de manière sécurisée.',

        // ------------------------------------------------------
        // NAVIGATION
        // ------------------------------------------------------

        previous:
          'Précédent',

        continue:
          'Continuer',

        createMyAccount:
          'Créer mon compte',

        creatingAccount:
          'Création du compte...',

        // ------------------------------------------------------
        // LOGIN
        // ------------------------------------------------------

        alreadyAccount:
          'Vous avez déjà un compte ?',

        login:
          'Se connecter',

        // ------------------------------------------------------
        // FORCE MOT DE PASSE
        // ------------------------------------------------------

        weak:
          'Faible',

        medium:
          'Moyen',

        good:
          'Bon',

        excellent:
          'Excellent',

        sixCharactersMinimum:
          '6 caractères minimum',

        // ------------------------------------------------------
        // VISIBILITÉ
        // ------------------------------------------------------

        hidePassword:
          'Masquer le mot de passe',

        showPassword:
          'Afficher le mot de passe',

        hideConfirmation:
          'Masquer la confirmation',

        showConfirmation:
          'Afficher la confirmation',

        // ------------------------------------------------------
        // VALIDATION
        // ------------------------------------------------------

        step1Error:
          'Veuillez compléter correctement vos informations personnelles.',

        step2Error:
          'Veuillez vérifier vos informations de connexion.',

        step3Error:
          'Les deux mots de passe ne correspondent pas.',

        genericStepError:
          'Veuillez vérifier les informations renseignées.',

        // ------------------------------------------------------
        // BACKEND
        // ------------------------------------------------------

        serverUnavailable:
          'Impossible de contacter le serveur. Vérifiez que le backend JardiScan est bien démarré.',

        invalidInformation:
          'Les informations renseignées sont invalides.',

        accountAlreadyExists:
          'Cette adresse e-mail ou ce pseudo est déjà utilisé.',

        serverError:
          'Une erreur serveur est survenue lors de la création du compte.',

        registerError:
          'Impossible de créer votre compte. Veuillez réessayer.',

        // ------------------------------------------------------
        // SUCCÈS
        // ------------------------------------------------------

        accountCreated:
          'Votre compte a été créé avec succès.',

        // ------------------------------------------------------
        // AVATAR
        // ------------------------------------------------------

        invalidImageType:
          'Veuillez sélectionner une image JPG, PNG ou WEBP.',

        imageTooLarge:
          'L’image ne doit pas dépasser 5 Mo.',

        // ------------------------------------------------------
        // TOAST
        // ------------------------------------------------------

        success:
          'Succès',

        error:
          'Erreur',

        closeNotification:
          'Fermer la notification'
      },

      // ========================================================
      // ENGLISH
      // ========================================================

      en: {

        // ------------------------------------------------------
        // HEADER
        // ------------------------------------------------------

        createAccount:
          'Create an account',

        registerSubtitle:
          'Join JardiScan and take care of your plants',

        // ------------------------------------------------------
        // PROGRESSION
        // ------------------------------------------------------

        step:
          'Step',

        of:
          'of',

        // ------------------------------------------------------
        // STEP 1
        // ------------------------------------------------------

        yourIdentity:
          'Your identity',

        identity:
          'Your identity',

        identityDescription:
          'Start by entering your personal information.',

        username:
          'Username',

        usernamePlaceholder:
          'Your username',

        usernameMin:
          'The username must contain at least 2 characters.',

        usernameMax:
          'The username cannot exceed 30 characters.',

        usernameRequired:
          'Please enter your username.',

        lastName:
          'Last name',

        lastNamePlaceholder:
          'Your last name',

        lastNameRequired:
          'Please enter your last name.',

        lastNameMax:
          'The last name cannot exceed 50 characters.',

        firstName:
          'First name',

        firstNamePlaceholder:
          'Your first name',

        firstNameRequired:
          'Please enter your first name.',

        firstNameMax:
          'The first name cannot exceed 50 characters.',

        // ------------------------------------------------------
        // STEP 2
        // ------------------------------------------------------

        secureAccount:
          'Secure your account',

        secureDescription:
          'Choose your email address and password.',

        email:
          'Email address',

        emailPlaceholder:
          'you@example.com',

        emailRequired:
          'Please enter your email address.',

        emailInvalid:
          'Please enter a valid email address.',

        password:
          'Password',

        passwordPlaceholder:
          'Your password',

        passwordRequired:
          'Please enter a password.',

        passwordMin:
          'The password must contain at least 6 characters.',

        // ------------------------------------------------------
        // STEP 3
        // ------------------------------------------------------

        confirmPasswordTitle:
          'Confirm your password',

        passwordConfirmation:
          'Password confirmation',

        confirmPasswordDescription:
          'One final check before completing your registration.',

        confirmPassword:
          'Confirm password',

        confirmPasswordPlaceholder:
          'Confirm your password',

        passwordMismatch:
          'The two passwords do not match.',

        securePassword:
          'Secure password',

        securePasswordDescription:
          'Your password will be securely protected before being saved.',

        // ------------------------------------------------------
        // STEP 4
        // ------------------------------------------------------

        yourProfile:
          'Your profile',

        profile:
          'Your profile',

        profileDescription:
          'Add a profile image if you wish.',

        avatar:
          'Avatar',

        optional:
          'optional',

        changePhoto:
          'Change your photo',

        addPhoto:
          'Add a photo',

        photoInstruction:
          'Click to choose an image from your device',

        supportedImageFormats:
          'JPG, PNG or WEBP',

        removeImage:
          'Remove image',

        optionalProfilePhoto:
          'Your profile photo is optional',

        optionalProfilePhotoDescription:
          'You can continue without adding an image and change it later from your profile.',

        avatarPreview:
          'Profile avatar preview',

        // ------------------------------------------------------
        // STEP 5
        // ------------------------------------------------------

        summary:
          'Summary',

        summaryDescription:
          'Check your information before creating your account.',

        profilePhotoAdded:
          'Profile photo added',

        noPhoto:
          'No photo',

        personalInformation:
          'Personal information',

        connection:
          'Login',

        accountReady:
          'Your account is ready to be created',

        accountReadyDescription:
          'Your account will be created with the role',

        visitorRole:
          'VISITOR',

        secureInformation:
          'Your information will be stored securely.',

        // ------------------------------------------------------
        // NAVIGATION
        // ------------------------------------------------------

        previous:
          'Previous',

        continue:
          'Continue',

        createMyAccount:
          'Create my account',

        creatingAccount:
          'Creating account...',

        // ------------------------------------------------------
        // LOGIN
        // ------------------------------------------------------

        alreadyAccount:
          'Already have an account?',

        login:
          'Sign in',

        // ------------------------------------------------------
        // PASSWORD STRENGTH
        // ------------------------------------------------------

        weak:
          'Weak',

        medium:
          'Medium',

        good:
          'Good',

        excellent:
          'Excellent',

        sixCharactersMinimum:
          '6 characters minimum',

        // ------------------------------------------------------
        // PASSWORD VISIBILITY
        // ------------------------------------------------------

        hidePassword:
          'Hide password',

        showPassword:
          'Show password',

        hideConfirmation:
          'Hide confirmation',

        showConfirmation:
          'Show confirmation',

        // ------------------------------------------------------
        // VALIDATION
        // ------------------------------------------------------

        step1Error:
          'Please complete your personal information correctly.',

        step2Error:
          'Please check your login information.',

        step3Error:
          'The two passwords do not match.',

        genericStepError:
          'Please check the information entered.',

        // ------------------------------------------------------
        // BACKEND
        // ------------------------------------------------------

        serverUnavailable:
          'Unable to contact the server. Make sure the JardiScan backend is running.',

        invalidInformation:
          'The information provided is invalid.',

        accountAlreadyExists:
          'This email address or username is already in use.',

        serverError:
          'A server error occurred while creating your account.',

        registerError:
          'Unable to create your account. Please try again.',

        // ------------------------------------------------------
        // SUCCESS
        // ------------------------------------------------------

        accountCreated:
          'Your account has been successfully created.',

        // ------------------------------------------------------
        // AVATAR
        // ------------------------------------------------------

        invalidImageType:
          'Please select a JPG, PNG or WEBP image.',

        imageTooLarge:
          'The image must not exceed 5 MB.',

        // ------------------------------------------------------
        // TOAST
        // ------------------------------------------------------

        success:
          'Success',

        error:
          'Error',

        closeNotification:
          'Close notification'
      }
    };

    return (
      translations[this.currentLanguage]?.[key] ??
      translations.fr[key] ??
      key
    );
  }

  // ============================================================
  // INSCRIPTION
  // ============================================================

  inscrire(): void {

    this.submitted = true;

    this.errorMessage = '';

    this.successMessage = '';

    // ----------------------------------------------------------
    // NETTOYAGE
    // ----------------------------------------------------------

    const pseudo =
      this.pseudo.trim();

    const nom =
      this.nom.trim();

    const prenom =
      this.prenom.trim();

    const email =
      this.email
        .trim()
        .toLowerCase();

    // ----------------------------------------------------------
    // VALIDATION PSEUDO
    // ----------------------------------------------------------

    if (!pseudo) {

      this.errorMessage =
        this.t('usernameRequired');

      this.showErrorNotification(
        this.errorMessage
      );

      return;
    }

    if (pseudo.length < 2) {

      this.errorMessage =
        this.t('usernameMin');

      this.showErrorNotification(
        this.errorMessage
      );

      return;
    }

    if (pseudo.length > 30) {

      this.errorMessage =
        this.t('usernameMax');

      this.showErrorNotification(
        this.errorMessage
      );

      return;
    }

    // ----------------------------------------------------------
    // VALIDATION NOM
    // ----------------------------------------------------------

    if (!nom) {

      this.errorMessage =
        this.t('lastNameRequired');

      this.showErrorNotification(
        this.errorMessage
      );

      return;
    }

    if (nom.length > 50) {

      this.errorMessage =
        this.t('lastNameMax');

      this.showErrorNotification(
        this.errorMessage
      );

      return;
    }

    // ----------------------------------------------------------
    // VALIDATION PRÉNOM
    // ----------------------------------------------------------

    if (!prenom) {

      this.errorMessage =
        this.t('firstNameRequired');

      this.showErrorNotification(
        this.errorMessage
      );

      return;
    }

    if (prenom.length > 50) {

      this.errorMessage =
        this.t('firstNameMax');

      this.showErrorNotification(
        this.errorMessage
      );

      return;
    }

    // ----------------------------------------------------------
    // VALIDATION EMAIL
    // ----------------------------------------------------------

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

    // ----------------------------------------------------------
    // VALIDATION MOT DE PASSE
    // ----------------------------------------------------------

    if (!this.password) {

      this.errorMessage =
        this.t('passwordRequired');

      this.showErrorNotification(
        this.errorMessage
      );

      return;
    }

    if (this.password.length < 6) {

      this.errorMessage =
        this.t('passwordMin');

      this.showErrorNotification(
        this.errorMessage
      );

      return;
    }

    // ----------------------------------------------------------
    // VALIDATION CONFIRMATION
    // ----------------------------------------------------------

    if (!this.confirmPassword) {

      this.errorMessage =
        this.t('passwordMismatch');

      this.showErrorNotification(
        this.errorMessage
      );

      return;
    }

    if (
      this.password !==
      this.confirmPassword
    ) {

      this.errorMessage =
        this.t('passwordMismatch');

      this.showErrorNotification(
        this.errorMessage
      );

      return;
    }

    // ----------------------------------------------------------
    // PROTECTION DOUBLE CLIC
    // ----------------------------------------------------------

    if (this.isLoading) {
      return;
    }

    this.isLoading = true;

    // ----------------------------------------------------------
    // FORMDATA
    // ----------------------------------------------------------

    const formData =
      new FormData();

    formData.append(
      'pseudo',
      pseudo
    );

    formData.append(
      'nom',
      nom
    );

    formData.append(
      'prenom',
      prenom
    );

    formData.append(
      'email',
      email
    );

    formData.append(
      'motDePasse',
      this.password
    );

    formData.append(
      'role',
      'VISITEUR'
    );

    // ----------------------------------------------------------
    // AVATAR OPTIONNEL
    // ----------------------------------------------------------

    if (this.avatar) {

      formData.append(
        'avatar',
        this.avatar,
        this.avatar.name
      );
    }

    // ----------------------------------------------------------
    // APPEL BACKEND
    // ----------------------------------------------------------

    this.http
      .post<RegisterResponse>(
        this.REGISTER_URL,
        formData
      )
      .subscribe({

        // ======================================================
        // SUCCÈS
        // ======================================================

        next: (response) => {

          this.isLoading = false;

          // ----------------------------------------------------
          // RÉCUPÉRATION UTILISATEUR
          // ----------------------------------------------------

          const utilisateur =
            response?.utilisateur ||
            null;

          // ----------------------------------------------------
          // VÉRIFICATION
          // ----------------------------------------------------

          if (!utilisateur) {

            this.errorMessage =
              this.t('registerError');

            this.showErrorNotification(
              this.errorMessage
            );

            return;
          }

          // ----------------------------------------------------
          // CRÉATION SESSION
          // ----------------------------------------------------

          this.saveUserSession(
            response,
            utilisateur
          );

          // ----------------------------------------------------
          // MESSAGE SUCCÈS
          // ----------------------------------------------------

          this.successMessage =
            response?.message ||
            this.t('accountCreated');

          this.showSuccessNotification(
            this.successMessage,
            3000
          );

          // ----------------------------------------------------
          // NETTOYAGE MOTS DE PASSE
          // ----------------------------------------------------

          this.password = '';

          this.confirmPassword = '';

          // ----------------------------------------------------
          // REDIRECTION
          // ----------------------------------------------------

          setTimeout(() => {

            this.router.navigate([
              '/accueil'
            ]);

          }, 1500);
        },

        // ======================================================
        // ERREUR
        // ======================================================

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
    response: RegisterResponse,
    utilisateur: RegisterUser
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
    // UTILISATEUR COMPLET
    // ==========================================================

    localStorage.setItem(
      this.USER_STORAGE_KEY,
      JSON.stringify(utilisateur)
    );

    // ==========================================================
    // ALIAS UTILISATEUR
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
  // RÉCUPÉRER SESSION
  // ============================================================

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

  // ============================================================
  // AVATAR — SÉLECTION
  // ============================================================

  onAvatarSelected(
    event: Event
  ): void {

    const input =
      event.target as HTMLInputElement;

    if (
      !input.files ||
      input.files.length === 0
    ) {
      return;
    }

    const file =
      input.files[0];

    // ----------------------------------------------------------
    // TYPES AUTORISÉS
    // ----------------------------------------------------------

    const allowedTypes = [
      'image/jpeg',
      'image/png',
      'image/webp'
    ];

    if (
      !allowedTypes.includes(
        file.type
      )
    ) {

      this.avatar = null;

      this.avatarPreview = null;

      this.showErrorNotification(
        this.t('invalidImageType')
      );

      input.value = '';

      return;
    }

    // ----------------------------------------------------------
    // TAILLE MAXIMALE — 5 MO
    // ----------------------------------------------------------

    const maxSize =
      5 * 1024 * 1024;

    if (
      file.size > maxSize
    ) {

      this.avatar = null;

      this.avatarPreview = null;

      this.showErrorNotification(
        this.t('imageTooLarge')
      );

      input.value = '';

      return;
    }

    // ----------------------------------------------------------
    // LIBÉRER ANCIEN APERÇU
    // ----------------------------------------------------------

    if (this.avatarPreview) {

      URL.revokeObjectURL(
        this.avatarPreview
      );
    }

    // ----------------------------------------------------------
    // ENREGISTRER FICHIER
    // ----------------------------------------------------------

    this.avatar =
      file;

    // ----------------------------------------------------------
    // APERÇU LOCAL
    // ----------------------------------------------------------

    this.avatarPreview =
      URL.createObjectURL(
        file
      );
  }

  // ============================================================
  // AVATAR — SUPPRESSION
  // ============================================================

  removeAvatar(): void {

    if (this.avatarPreview) {

      URL.revokeObjectURL(
        this.avatarPreview
      );
    }

    this.avatar = null;

    this.avatarPreview = null;

    const input =
      document.getElementById(
        'avatar'
      ) as HTMLInputElement | null;

    if (input) {
      input.value = '';
    }
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
  // ERREUR BACKEND
  // ============================================================

  private getErrorMessage(
    error: HttpErrorResponse
  ): string {

    if (error.status === 0) {

      return this.t(
        'serverUnavailable'
      );
    }

    if (error.status === 400) {

      return (
        error.error?.message ||
        this.t('invalidInformation')
      );
    }

    if (error.status === 409) {

      return (
        error.error?.message ||
        this.t('accountAlreadyExists')
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
      this.t('registerError')
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
  // CONFIRMATION MOT DE PASSE
  // ============================================================

  toggleConfirmPassword(): void {

    this.showConfirmPassword =
      !this.showConfirmPassword;
  }

  // ============================================================
  // RETOUR LOGIN
  // ============================================================

  goToLogin(): void {

    if (this.isLoading) {
      return;
    }

    this.router.navigate([
      '/login'
    ]);
  }

  // ============================================================
  // ÉTAT CHAMP
  // ============================================================

  isFieldInvalid(
    value: string
  ): boolean {

    return (
      this.submitted &&
      !value.trim()
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
      /[A-Z]/.test(
        this.password
      )
    ) {
      strength++;
    }

    if (
      /[0-9]/.test(
        this.password
      )
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
  // LABEL FORCE MOT DE PASSE
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
  // CONFIRMATION INVALIDE
  // ============================================================

  isPasswordConfirmationInvalid():
    boolean {

    return (
      this.submitted &&
      !!this.confirmPassword &&
      this.password !==
      this.confirmPassword
    );
  }

  // ============================================================
  // LABEL ÉTAPE
  // ============================================================

  getStepLabel(): string {

    switch (
      this.currentStep
    ) {

      case 1:

        return this.t(
          'yourIdentity'
        );

      case 2:

        return this.t(
          'secureAccount'
        );

      case 3:

        return this.t(
          'passwordConfirmation'
        );

      case 4:

        return this.t(
          'yourProfile'
        );

      case 5:

        return this.t(
          'summary'
        );

      default:

        return '';
    }
  }

  // ============================================================
  // VALIDATION ÉTAPE COURANTE
  // ============================================================

  private isCurrentStepValid():
    boolean {

    switch (
      this.currentStep
    ) {

      // --------------------------------------------------------
      // ÉTAPE 1
      // --------------------------------------------------------

      case 1:

        return (

          !!this.pseudo &&

          this.pseudo
            .trim()
            .length >= 2 &&

          this.pseudo
            .trim()
            .length <= 30 &&

          !!this.nom &&

          this.nom
            .trim()
            .length >= 1 &&

          this.nom
            .trim()
            .length <= 50 &&

          !!this.prenom &&

          this.prenom
            .trim()
            .length >= 1 &&

          this.prenom
            .trim()
            .length <= 50
        );

      // --------------------------------------------------------
      // ÉTAPE 2
      // --------------------------------------------------------

      case 2:

        return (

          !!this.email &&

          this.email
            .trim()
            .length > 0 &&

          this.isValidEmail(
            this.email.trim()
          ) &&

          !!this.password &&

          this.password.length >= 6
        );

      // --------------------------------------------------------
      // ÉTAPE 3
      // --------------------------------------------------------

      case 3:

        return (

          !!this.confirmPassword &&

          this.confirmPassword ===
          this.password
        );

      // --------------------------------------------------------
      // ÉTAPE 4
      // --------------------------------------------------------

      case 4:

        return true;

      // --------------------------------------------------------
      // ÉTAPE 5
      // --------------------------------------------------------

      case 5:

        return true;

      default:

        return false;
    }
  }

  // ============================================================
  // SOUMISSION ÉTAPE
  // ============================================================

  submitCurrentStep(): void {

    if (this.isLoading) {
      return;
    }

    this.submitted = true;

    // ----------------------------------------------------------
    // VALIDATION ÉTAPE
    // ----------------------------------------------------------

    if (
      !this.isCurrentStepValid()
    ) {

      this.showErrorNotification(
        this.getCurrentStepErrorMessage()
      );

      return;
    }

    // ----------------------------------------------------------
    // ÉTAPES 1 À 4 → SUIVANTE
    // ----------------------------------------------------------

    if (
      this.currentStep <
      this.totalSteps
    ) {

      this.nextStep();

      return;
    }

    // ----------------------------------------------------------
    // ÉTAPE 5 → INSCRIPTION
    // ----------------------------------------------------------

    this.inscrire();
  }

  // ============================================================
  // MESSAGE ERREUR ÉTAPE
  // ============================================================

  private getCurrentStepErrorMessage():
    string {

    switch (
      this.currentStep
    ) {

      case 1:

        if (!this.pseudo.trim()) {

          return this.t(
            'usernameRequired'
          );
        }

        if (
          this.pseudo
            .trim()
            .length < 2
        ) {

          return this.t(
            'usernameMin'
          );
        }

        if (
          this.pseudo
            .trim()
            .length > 30
        ) {

          return this.t(
            'usernameMax'
          );
        }

        if (!this.nom.trim()) {

          return this.t(
            'lastNameRequired'
          );
        }

        if (
          this.nom
            .trim()
            .length > 50
        ) {

          return this.t(
            'lastNameMax'
          );
        }

        if (!this.prenom.trim()) {

          return this.t(
            'firstNameRequired'
          );
        }

        if (
          this.prenom
            .trim()
            .length > 50
        ) {

          return this.t(
            'firstNameMax'
          );
        }

        return this.t(
          'step1Error'
        );

      case 2:

        if (!this.email.trim()) {

          return this.t(
            'emailRequired'
          );
        }

        if (
          !this.isValidEmail(
            this.email.trim()
          )
        ) {

          return this.t(
            'emailInvalid'
          );
        }

        if (!this.password) {

          return this.t(
            'passwordRequired'
          );
        }

        if (
          this.password.length < 6
        ) {

          return this.t(
            'passwordMin'
          );
        }

        return this.t(
          'step2Error'
        );

      case 3:

        return this.t(
          'step3Error'
        );

      default:

        return this.t(
          'genericStepError'
        );
    }
  }

  // ============================================================
  // ÉTAPE SUIVANTE
  // ============================================================

  nextStep(): void {

    if (
      this.currentStep >=
      this.totalSteps
    ) {

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

  // ============================================================
  // ÉTAPE PRÉCÉDENTE
  // ============================================================

  previousStep(): void {

    if (
      this.currentStep <= 1 ||
      this.isLoading
    ) {

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

    // ----------------------------------------------------------
    // ANNULER ANCIEN TIMER
    // ----------------------------------------------------------

    if (this.notificationTimeout) {

      clearTimeout(
        this.notificationTimeout
      );

      this.notificationTimeout = null;
    }

    // ----------------------------------------------------------
    // DONNÉES
    // ----------------------------------------------------------

    this.notificationMessage =
      message;

    this.notificationType =
      type;

    this.showNotification =
      true;

    // ----------------------------------------------------------
    // FERMETURE AUTOMATIQUE
    // ----------------------------------------------------------

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
}
