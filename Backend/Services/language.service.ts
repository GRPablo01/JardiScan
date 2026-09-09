import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export type Language = 'fr' | 'en';

@Injectable({
  providedIn: 'root'
})
export class LanguageService {

  private readonly STORAGE_KEY = 'jardiscan_language';

  private readonly defaultLanguage: Language = 'fr';

  private languageSubject = new BehaviorSubject<Language>(
    this.getStoredLanguage()
  );

  readonly language$ = this.languageSubject.asObservable();

  constructor() {}

  /**
   * 🌐 Langue actuelle
   */
  get currentLanguage(): Language {
    return this.languageSubject.value;
  }

  /**
   * 🇫🇷 / 🇬🇧 Changer la langue
   */
  setLanguage(language: Language): void {

    if (this.currentLanguage === language) {
      return;
    }

    localStorage.setItem(this.STORAGE_KEY, language);

    this.languageSubject.next(language);
  }

  /**
   * 🔄 Basculer entre les langues
   */
  toggleLanguage(): void {

    const nextLanguage: Language =
      this.currentLanguage === 'fr' ? 'en' : 'fr';

    this.setLanguage(nextLanguage);
  }

  /**
   * 🔎 Vérifier la langue
   */
  is(language: Language): boolean {
    return this.currentLanguage === language;
  }

  /**
   * 🏷️ Nom de la langue
   */
  getLanguageName(language: Language): string {

    return language === 'fr'
      ? 'Français'
      : 'English';
  }

  /**
   * 🏳️ Drapeau
   */
  getLanguageFlag(language: Language): string {

    return language === 'fr'
      ? '🇫🇷'
      : '🇬🇧';
  }

  /**
   * 💾 Récupérer la langue sauvegardée
   */
  private getStoredLanguage(): Language {

    const stored = localStorage.getItem(this.STORAGE_KEY);

    if (stored === 'fr' || stored === 'en') {
      return stored;
    }

    return this.defaultLanguage;
  }
}