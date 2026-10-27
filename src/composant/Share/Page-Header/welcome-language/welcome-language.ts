// ============================================================
// 🌐 ARBORIA — WELCOME LANGUAGE
// Angular Standalone • TypeScript
//
// • LanguageService centralisé
// • Synchronisation automatique FR / EN
// • Persistance via localStorage
// • Compatible avec les événements existants
// • ThemeService conservé
// • Aucun changement de langue inutile
// ============================================================

import { CommonModule } from '@angular/common';
import {
  Component,
  EventEmitter,
  Input,
  Output,
  OnDestroy,
  OnInit
} from '@angular/core';

import { Subscription } from 'rxjs';

import { ThemeService } from '../../../../../Backend/Services/theme.service';
import {
  LanguageService,
  Language
} from '../../../../../Backend/Services/language.service';

@Component({
  selector: 'app-welcome-language',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './welcome-language.html',
  styleUrl: './welcome-language.css'
})
export class WelcomeLanguage implements OnInit, OnDestroy {

  // ==========================================================
  // 🌐 LANGUE ACTUELLE
  // ==========================================================

  @Input() langueActuelle: Language = 'fr';

  // ==========================================================
  // 📤 ÉVÉNEMENT COMPATIBLE AVEC LES COMPOSANTS EXISTANTS
  // ==========================================================

  @Output() langueChangee = new EventEmitter<Language>();

  // ==========================================================
  // 🔔 ABONNEMENT À LA LANGUE GLOBALE
  // ==========================================================

  private languageSubscription?: Subscription;

  // ==========================================================
  // 🧩 CONSTRUCTOR
  // ==========================================================

  constructor(
    public themeService: ThemeService,
    public languageService: LanguageService
  ) {}

  // ==========================================================
  // 🚀 INITIALISATION
  // ==========================================================

  ngOnInit(): void {
    // Récupère la langue réellement utilisée par l'application.
    this.langueActuelle = this.languageService.currentLanguage;

    // Synchronise le composant avec les changements globaux.
    this.languageSubscription = this.languageService.language$.subscribe(
      (language: Language) => {
        this.langueActuelle = language;
      }
    );
  }

  // ==========================================================
  // 🇫🇷 / 🇬🇧 CHANGEMENT DE LANGUE
  // ==========================================================

  changerLangue(langue: Language): void {
    // Ignore les langues non prises en charge.
    if (langue !== 'fr' && langue !== 'en') {
      return;
    }

    // Évite les changements inutiles.
    if (langue === this.languageService.currentLanguage) {
      return;
    }

    // Met à jour la langue globale et localStorage.
    this.languageService.setLanguage(langue);

    // Conserve la compatibilité avec le parent existant.
    this.langueChangee.emit(langue);
  }

  // ==========================================================
  // 🏷️ NOM DE LA LANGUE
  // ==========================================================

  getNomLangue(langue: Language): string {
    return this.languageService.getLanguageName(langue);
  }

  // ==========================================================
  // 🚩 DRAPEAU DE LA LANGUE
  // ==========================================================

  getDrapeauLangue(langue: Language): string {
    return this.languageService.getLanguageFlag(langue);
  }

  // ==========================================================
  // 🧹 NETTOYAGE
  // ==========================================================

  ngOnDestroy(): void {
    this.languageSubscription?.unsubscribe();
  }
}