import {
  Component,
  OnInit
} from '@angular/core';

import { RouterLink } from '@angular/router';

import { CommonModule } from '@angular/common';

import { Icon } from '../../../Public/icon/icon';

import { ThemeService } from '../../../../../Backend/Services/theme.service';


// ============================================================
// 🌐 LANGUAGE SERVICE
// ============================================================

import {
  LanguageService,
  Language
} from '../../../../../Backend/Services/language.service';
import { LogoBienvenue } from '../logo-bienvenue/logo-bienvenue';
import { Theme } from '../../Icon/theme/theme';
import { Language2 } from '../../Icon/language/language';
import { Aide } from '../../Icon/aide/aide';
import { Contact } from '../../Icon/contact/contact';
import { ActionsMobileTablette } from '../../../Public/actions-mobile-tablette/actions-mobile-tablette';
import { ListeIcon } from "../../Icon/liste-icon/liste-icon";
import { NavWelcome } from '../nav-welcome/nav-welcome';
import { BoutonBienvenue } from "../bouton-bienvenue/bouton-bienvenue";
import { TailleEcran } from "../../../Public/taille-ecran/taille-ecran";



// ============================================================
// 🌿 TYPES DES TEXTES
// ============================================================

type TranslationKey =
  | 'discover'
  | 'discoverJardiScan'
  | 'newProducts'
  | 'plants'
  | 'viewPlants'
  | 'tips'
  | 'viewTips';


// ============================================================
// 🌿 WELCOME HEADER — JARDISCAN
// ============================================================

@Component({
  selector: 'app-header-bienvenue',

  standalone: true,

  imports: [
    Icon,
    RouterLink,
    CommonModule,
    LogoBienvenue,
    Theme,
    Language2,
    Aide,
    Contact,
    ActionsMobileTablette,
    ListeIcon,
    NavWelcome,
    BoutonBienvenue,
    TailleEcran
],

  templateUrl: './header-bienvenue.html',

  styleUrl: './header-bienvenue.css',
})


export class HeaderBienvenue implements OnInit {

  // ==========================================================
  // 👤 UTILISATEUR
  // ==========================================================

  user: any = null;


  // ==========================================================
  // 🌐 LANGUE
  // ==========================================================

  /**
   * Langue actuellement utilisée.
   *
   * On conserve le LanguageService comme source principale.
   */
  get currentLanguage(): Language {
    return this.languageService.currentLanguage;
  }


  // ==========================================================
  // 💉 CONSTRUCTEUR
  // ==========================================================

  constructor(
    public themeService: ThemeService,

    // 🌐 Service de langue
    public languageService: LanguageService
  ) {}


  // ==========================================================
  // 🚀 INITIALISATION
  // ==========================================================

  ngOnInit(): void {

    // ========================================================
    // 🔍 VÉRIFIER LE LOCALSTORAGE
    // ========================================================

    const userLocalStorage =
      localStorage.getItem('utilisateur');


    // ========================================================
    // 📦 AFFICHER LA VALEUR RÉCUPÉRÉE
    // ========================================================

    console.log(
      '📦 Valeur récupérée depuis localStorage :',
      userLocalStorage
    );


    // ========================================================
    // ❌ AUCUN UTILISATEUR
    // ========================================================

    if (!userLocalStorage) {

      console.warn(
        '⚠️ Aucun utilisateur trouvé dans localStorage avec la clé "utilisateur".'
      );

      this.user = null;

      return;
    }


    // ========================================================
    // 🔄 CONVERSION JSON
    // ========================================================

    try {

      this.user = JSON.parse(userLocalStorage);


      // ======================================================
      // 🔑 INFORMATIONS UTILISATEUR
      // ======================================================

      console.log(
        '👤 Pseudo :',
        this.user?.pseudo
      );

      console.log(
        '👤 Key :',
        this.user?.Key
      );

      console.log(
        '📛 Nom :',
        this.user?.nom
      );

      console.log(
        '📝 Prénom :',
        this.user?.prenom
      );

      console.log(
        '📧 Email :',
        this.user?.email
      );

      console.log(
        '🎭 Rôle :',
        this.user?.role
      );

      console.log(
        '🖼️ Avatar :',
        this.user?.avatar
      );


      // ======================================================
      // 🌐 LANGUE ACTUELLE
      // ======================================================

      console.log(
        '🌐 Langue JardiScan :',
        this.languageService.currentLanguage
      );

    } catch (error) {

      // ======================================================
      // ❌ ERREUR JSON
      // ======================================================

      console.error(
        '❌ Erreur lors du parsing JSON de l’utilisateur :',
        error
      );

      console.error(
        '📦 Valeur qui a provoqué l’erreur :',
        userLocalStorage
      );

      this.user = null;
    }
  }


  // ==========================================================
  // 👤 INITIALES UTILISATEUR
  // ==========================================================

  getUserInitials(): string {

    if (!this.user) {
      return '';
    }

    const prenom =
      this.user?.prenom?.trim() || '';

    const nom =
      this.user?.nom?.trim() || '';


    const initialePrenom =
      prenom
        ? prenom.charAt(0).toUpperCase()
        : '';


    const initialeNom =
      nom
        ? nom.charAt(0).toUpperCase()
        : '';


    return initialePrenom + initialeNom;
  }


  // ==========================================================
  // 🌐 CHANGEMENT DE LANGUE
  // ==========================================================

  toggleLanguage(): void {
    this.languageService.toggleLanguage();
  }


  // ==========================================================
  // 🇫🇷 VÉRIFIER FRANÇAIS
  // ==========================================================

  isFrench(): boolean {
    return this.languageService.is('fr');
  }


  // ==========================================================
  // 🇬🇧 VÉRIFIER ANGLAIS
  // ==========================================================

  isEnglish(): boolean {
    return this.languageService.is('en');
  }


  // ==========================================================
  // 🌐 TRADUCTION DES TEXTES DU HEADER
  // ==========================================================

  /**
   * Cette fonction retourne automatiquement le texte
   * correspondant à la langue sélectionnée.
   *
   * IMPORTANT :
   * Le LanguageService reste la source de vérité.
   *
   * Exemple :
   *
   * translate('discover')
   *
   * FR → Découvrir
   * EN → Discover
   */

  translate(key: TranslationKey): string {

    const translations: Record<
      Language,
      Record<TranslationKey, string>
    > = {

      // ======================================================
      // 🇫🇷 FRANÇAIS
      // ======================================================

      fr: {

        discover:
          'Découvrir',

        discoverJardiScan:
          'Découvrir JardiScan',

        newProducts:
          'Nouveautés JardiScan',

        plants:
          'Plantes',

        viewPlants:
          'Voir les plantes',

        tips:
          'Conseils',

        viewTips:
          'Voir les conseils'
      },


      // ======================================================
      // 🇬🇧 ENGLISH
      // ======================================================

      en: {

        discover:
          'Discover',

        discoverJardiScan:
          'Discover JardiScan',

        newProducts:
          'JardiScan News',

        plants:
          'Plants',

        viewPlants:
          'View plants',

        tips:
          'Tips',

        viewTips:
          'View tips'
      }
    };


    return translations[
      this.languageService.currentLanguage
    ][key];
  }
}
