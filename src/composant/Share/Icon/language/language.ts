import {
  Component,
  HostListener,
  OnDestroy
} from '@angular/core';

import { CommonModule } from '@angular/common';

import { ThemeService } from '../../../../../Backend/Services/theme.service';

import {
  LanguageService,
  Language
} from '../../../../../Backend/Services/language.service';

import {
  PopupService
} from '../../../../../Backend/Services/popup.service';

// ============================================================
// 🌐 LANGUAGE TOGGLE — JARDISCAN
//
// • Light / Dark
// • FR / EN
// • Popup responsive
// • Mobile / Tablette → à droite
// • Laptop / Desktop → sous le bouton
// • Clic ailleurs → fermeture
// • Une seule popup ouverte à la fois
// • ESC → fermeture
// • Resize → repositionnement
// • Scroll → repositionnement
// ============================================================

@Component({
  selector: 'app-language',
  standalone: true,
  imports: [
    CommonModule
  ],
  templateUrl: './language.html',
  styleUrl: './language.css'
})
export class Language2 implements OnDestroy {

  // ============================================================
  // 💉 CONSTRUCTEUR
  // ============================================================

  constructor(
    public themeService: ThemeService,
    public languageService: LanguageService,
    private popupService: PopupService
  ) {}

  // ============================================================
  // 🌐 POPUP OUVERTE ?
  // ============================================================

  get isOpen(): boolean {
    return this.popupService.isOpen('language');
  }

  // ============================================================
  // 📍 POSITION POPUP
  // ============================================================

  popupTop = 0;
  popupLeft = 0;

  popupTransform = 'translateY(-50%)';

  // ============================================================
  // 🌐 LANGUE ACTUELLE
  // ============================================================

  get currentLanguage(): Language {
    return this.languageService.currentLanguage;
  }

  // ============================================================
  // 🇫🇷 FRANÇAIS
  // ============================================================

  isFrench(): boolean {
    return this.languageService.is('fr');
  }

  // ============================================================
  // 🇬🇧 ANGLAIS
  // ============================================================

  isEnglish(): boolean {
    return this.languageService.is('en');
  }

  // ============================================================
  // 🏷️ NOM DE LA LANGUE
  // ============================================================

  getLanguageName(language: Language): string {
    return this.languageService.getLanguageName(language);
  }

  // ============================================================
  // 🏳️ DRAPEAU
  // ============================================================

  getLanguageFlag(language: Language): string {
    return this.languageService.getLanguageFlag(language);
  }

  // ============================================================
  // 🌐 TRADUCTIONS
  // ============================================================

  translate(
    key:
      | 'changeLanguage'
      | 'chooseLanguage'
      | 'french'
      | 'english'
  ): string {

    const translations: Record<
      Language,
      Record<
        | 'changeLanguage'
        | 'chooseLanguage'
        | 'french'
        | 'english',
        string
      >
    > = {

      // ========================================================
      // 🇫🇷 FRANÇAIS
      // ========================================================

      fr: {
        changeLanguage: 'Changer la langue',
        chooseLanguage: 'Choisir la langue',
        french: 'Français',
        english: 'Anglais'
      },

      // ========================================================
      // 🇬🇧 ENGLISH
      // ========================================================

      en: {
        changeLanguage: 'Change language',
        chooseLanguage: 'Choose language',
        french: 'French',
        english: 'English'
      }
    };

    return translations[
      this.languageService.currentLanguage
    ][key];
  }

  // ============================================================
  // 🌐 OUVRIR / FERMER
  // ============================================================

  togglePopup(event: MouseEvent): void {

    // Empêche le document click de fermer immédiatement
    event.stopPropagation();

    // ----------------------------------------------------------
    // Si déjà ouverte → fermeture
    // ----------------------------------------------------------

    if (this.isOpen) {
      this.popupService.close('language');
      return;
    }

    // ----------------------------------------------------------
    // Ouverture
    // ----------------------------------------------------------

    this.popupService.open('language');

    // ----------------------------------------------------------
    // Positionnement
    // ----------------------------------------------------------

    const button =
      event.currentTarget as HTMLElement;

    this.updatePopupPosition(button);
  }

  // ============================================================
  // 📍 POSITIONNEMENT
  //
  // Mobile / tablette
  // → à droite du bouton
  //
  // Desktop
  // → sous le bouton
  // ============================================================

  private updatePopupPosition(
    button: HTMLElement
  ): void {

    if (!button) {
      return;
    }

    const rect =
      button.getBoundingClientRect();

    const isDesktop =
      window.innerWidth >= 1024;

    // ==========================================================
    // 💻 LAPTOP / DESKTOP
    // ==========================================================

    if (isDesktop) {

      this.popupTop =
        rect.bottom + 10;

      this.popupLeft =
        rect.left + (rect.width / 2);

      this.popupTransform =
        'translateX(-50%)';

      return;
    }

    // ==========================================================
    // 📱 MOBILE / TABLETTE
    // ==========================================================

    this.popupTop =
      rect.top + (rect.height / 2);

    this.popupLeft =
      rect.right + 10;

    this.popupTransform =
      'translateY(-50%)';
  }

  // ============================================================
  // 🌐 CHOISIR UNE LANGUE
  // ============================================================

  selectLanguage(
    language: Language,
    event?: MouseEvent
  ): void {

    event?.stopPropagation();

    // Changement global
    this.languageService.setLanguage(language);

    // Fermeture
    this.popupService.close('language');
  }

  // ============================================================
  // 🔄 BASCULER FR / EN
  // ============================================================

  toggleLanguage(): void {
    this.languageService.toggleLanguage();
  }

  // ============================================================
  // 🖱️ CLIC DOCUMENT
  // ============================================================

  @HostListener('document:click')
  onDocumentClick(): void {

    if (!this.isOpen) {
      return;
    }

    this.popupService.close('language');
  }

  // ============================================================
  // ⌨️ ESC
  // ============================================================

  @HostListener('document:keydown.escape')
  closeWithEscape(): void {

    if (!this.isOpen) {
      return;
    }

    this.popupService.close('language');
  }

  // ============================================================
  // 📐 RESIZE
  // ============================================================

  @HostListener('window:resize')
  onResize(): void {

    if (!this.isOpen) {
      return;
    }

    const button =
      document.querySelector(
        '.language-button'
      ) as HTMLElement | null;

    if (button) {
      this.updatePopupPosition(button);
    }
  }

  // ============================================================
  // 📜 SCROLL
  // ============================================================

  @HostListener('window:scroll')
  onScroll(): void {

    if (!this.isOpen) {
      return;
    }

    const button =
      document.querySelector(
        '.language-button'
      ) as HTMLElement | null;

    if (button) {
      this.updatePopupPosition(button);
    }
  }

  // ============================================================
  // 🧹 DESTROY
  // ============================================================

  ngOnDestroy(): void {

    if (this.isOpen) {
      this.popupService.close('language');
    }
  }
}