// ============================================================
// 🌐 ARBORIA — LANGUAGE SERVICE
// ============================================================
//
// • Langues prises en charge : FR / EN
// • Synchronisation via BehaviorSubject
// • Persistance dans localStorage
// • API compatible avec les composants existants
// • Indépendant du ThemeService
// ============================================================

import {
  Injectable
} from '@angular/core';

import {
  BehaviorSubject
} from 'rxjs';

// ============================================================
// 🌍 LANGUAGE TYPE
// ============================================================

export type Language = 'fr' | 'en';

// ============================================================
// 🌐 SERVICE
// ============================================================

@Injectable({
  providedIn: 'root'
})

export class LanguageService {

  // ==========================================================
  // 💾 STORAGE
  // ==========================================================

  private readonly STORAGE_KEY = 'jardiscan_language';

  private readonly defaultLanguage: Language = 'fr';

  // ==========================================================
  // 🌐 INITIAL LANGUAGE
  // ==========================================================

  private readonly languageSubject =
    new BehaviorSubject<Language>(
      this.getStoredLanguage()
    );

  // Observable utilisé par les composants.
  readonly language$ =
    this.languageSubject.asObservable();

  // ==========================================================
  // 🧩 CONSTRUCTOR
  // ==========================================================

  constructor() {}

  // ==========================================================
  // 🌐 CURRENT LANGUAGE
  // ==========================================================

  get currentLanguage(): Language {

    return this.languageSubject.value;
  }

  // ==========================================================
  // 🇫🇷 / 🇬🇧 SET LANGUAGE
  // ==========================================================

  setLanguage(language: Language): void {

    // Protection contre les valeurs non prises en charge.
    if (language !== 'fr' && language !== 'en') {
      return;
    }

    // Évite une émission inutile si la langue est identique.
    if (this.currentLanguage === language) {
      return;
    }

    // Mise à jour de la préférence enregistrée.
    try {
      if (typeof localStorage !== 'undefined') {
        localStorage.setItem(
          this.STORAGE_KEY,
          language
        );
      }
    } catch {
      // Le changement reste possible si le stockage est bloqué.
    }

    // Notification immédiate de tous les abonnés.
    this.languageSubject.next(language);
  }

  // ==========================================================
  // 🔄 TOGGLE LANGUAGE
  // ==========================================================

  toggleLanguage(): void {

    const nextLanguage: Language =
      this.currentLanguage === 'fr'
        ? 'en'
        : 'fr';

    this.setLanguage(nextLanguage);
  }

  // ==========================================================
  // 🔎 CHECK LANGUAGE
  // ==========================================================

  is(language: Language): boolean {

    return this.currentLanguage === language;
  }

  // ==========================================================
  // 🏷️ LANGUAGE NAME
  // ==========================================================

  getLanguageName(language: Language): string {

    return language === 'fr'
      ? 'Français'
      : 'English';
  }

  // ==========================================================
  // 🚩 LANGUAGE FLAG
  // ==========================================================

  getLanguageFlag(language: Language): string {

    return language === 'fr'
      ? '🇫🇷'
      : '🇬🇧';
  }

  // ==========================================================
  // 💾 READ SAVED LANGUAGE
  // ==========================================================

  private getStoredLanguage(): Language {

    try {
      if (typeof localStorage !== 'undefined') {

        const stored =
          localStorage.getItem(this.STORAGE_KEY);

        if (stored === 'fr' || stored === 'en') {
          return stored;
        }
      }
    } catch {
      // Utilise la langue par défaut si le stockage est inaccessible.
    }

    return this.defaultLanguage;
  }
}
