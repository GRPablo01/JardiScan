import {
  Component,
  HostListener,
  OnDestroy,
  OnInit
} from '@angular/core';

import { CommonModule } from '@angular/common';

import { Router } from '@angular/router';

import { Subscription } from 'rxjs';
import { ThemeService } from '../../../../../Backend/Services/theme.service';
import { LanguageService } from '../../../../../Backend/Services/language.service';
import { PopupService } from '../../../../../Backend/Services/popup.service';



// ============================================================
// ✉️ CONTACT — JARDISCAN
//
// • Popup de contact
// • Nous contacter
// • Signaler un problème
// • Faire une suggestion
// • Centre de contact
// • Light / Dark
// • Français / English
// • Changement de langue instantané
// • Clic n'importe où → fermeture
// • ESC → fermeture
// • Une seule popup ouverte à la fois
// • Compatible avec Language / Theme / Aide
// ============================================================

@Component({
  selector: 'app-contact',

  standalone: true,

  imports: [
    CommonModule
  ],

  templateUrl: './contact.html',

  styleUrl: './contact.css'
})


export class Contact implements OnInit, OnDestroy {


  // ============================================================
  // ✉️ POPUP
  //
  // L'état est géré par PopupService.
  //
  // Cela permet d'avoir :
  //
  // Theme
  // Language
  // Aide
  // Contact
  //
  // avec une seule popup ouverte à la fois.
  // ============================================================

  get isOpen(): boolean {
    return this.popupService.isOpen('contact');
  }


  // ============================================================
  // 🎯 TYPE DE CONTACT ACTIF
  //
  // Permet de mémoriser :
  //
  // • problem
  // • suggestion
  //
  // ============================================================

  selectedContact: string | null = null;


  // ============================================================
  // 🌐 LANGUE ACTUELLE
  // ============================================================

  currentLanguage: 'fr' | 'en' = 'fr';


  // ============================================================
  // 🔄 SUBSCRIPTION LANGUE
  // ============================================================

  private languageSubscription?: Subscription;


  // ============================================================
  // 🧭 CONSTRUCTEUR
  // ============================================================

  constructor(
    public themeService: ThemeService,

    public languageService: LanguageService,

    private router: Router,

    private popupService: PopupService
  ) {}


  // ============================================================
  // 🚀 INITIALISATION
  // ============================================================

  ngOnInit(): void {

    // ----------------------------------------------------------
    // 🌐 Récupère la langue actuellement sélectionnée
    // ----------------------------------------------------------

    this.currentLanguage =
      this.languageService.currentLanguage;


    // ----------------------------------------------------------
    // 🌐 Écoute les changements de langue
    //
    // Le contenu de la popup est automatiquement actualisé
    // sans recharger la page.
    // ----------------------------------------------------------

    this.languageSubscription =
      this.languageService.language$.subscribe(language => {

        this.currentLanguage = language;

      });
  }


  // ============================================================
  // ✉️ TOGGLE POPUP
  //
  // PopupService garantit qu'une seule popup est ouverte.
  //
  // Exemple :
  //
  // Language ouverte
  //       ↓
  // clic Contact
  //       ↓
  // PopupService.open('contact')
  //       ↓
  // Language fermée
  //       ↓
  // Contact ouverte
  // ============================================================

  togglePopup(event?: Event): void {

    // ----------------------------------------------------------
    // Empêche document:click de fermer immédiatement
    // la popup lors du clic sur le bouton.
    // ----------------------------------------------------------

    event?.stopPropagation();


    // ----------------------------------------------------------
    // Si Contact est déjà ouverte → fermeture
    // ----------------------------------------------------------

    if (this.isOpen) {

      this.popupService.close('contact');

      this.selectedContact = null;

      return;
    }


    // ----------------------------------------------------------
    // Ouvre Contact.
    //
    // Toute autre popup ouverte est automatiquement remplacée.
    // ----------------------------------------------------------

    this.popupService.open('contact');


    // ----------------------------------------------------------
    // Nouvelle ouverture → aucune sélection
    // ----------------------------------------------------------

    this.selectedContact = null;
  }

  


  // ============================================================
  // ❌ FERMER LA POPUP
  // ============================================================

  closePopup(): void {

    this.popupService.close('contact');

    this.selectedContact = null;
  }


  // ============================================================
  // 🖱️ CLIC EN DEHORS DU COMPOSANT
  //
  // N'importe quel clic extérieur ferme Contact.
  // ============================================================

  @HostListener('document:click')

  onDocumentClick(): void {

    if (!this.isOpen) {
      return;
    }

    this.closePopup();
  }


  // ============================================================
  // ⌨️ ÉCHAP — FERMER LA POPUP
  // ============================================================

  @HostListener('document:keydown.escape')

  onEscape(): void {

    if (!this.isOpen) {
      return;
    }

    this.closePopup();
  }


  // ============================================================
  // ✉️ NOUS CONTACTER
  //
  // Ouvre la page complète de contact.
  // ============================================================

  openContact(event?: Event): void {

    event?.stopPropagation();


    // ----------------------------------------------------------
    // Navigation vers la page de contact
    // ----------------------------------------------------------

    this.router.navigate([
      '/contact'
    ]);


    // ----------------------------------------------------------
    // Fermeture de la popup
    // ----------------------------------------------------------

    this.closePopup();
  }


  // ============================================================
  // 🐛 SIGNALER UN PROBLÈME
  //
  // Ouvre la page Contact avec :
  //
  // ?type=problem
  // ============================================================

  openContactType(
    type: 'problem' | 'suggestion',
    event?: Event
  ): void {

    event?.stopPropagation();


    // ----------------------------------------------------------
    // Mémorise le type sélectionné
    // ----------------------------------------------------------

    this.selectedContact = type;


    // ----------------------------------------------------------
    // Navigation vers le formulaire correspondant
    // ----------------------------------------------------------

    this.router.navigate(
      ['/contact'],
      {
        queryParams: {
          type
        }
      }
    );


    // ----------------------------------------------------------
    // Fermeture de la popup
    // ----------------------------------------------------------

    this.closePopup();
  }


  // ============================================================
  // 🐛 SIGNALER UN PROBLÈME
  // ============================================================

  openProblem(
    event?: Event
  ): void {

    this.openContactType(
      'problem',
      event
    );
  }


  // ============================================================
  // 💡 FAIRE UNE SUGGESTION
  // ============================================================

  openSuggestion(
    event?: Event
  ): void {

    this.openContactType(
      'suggestion',
      event
    );
  }


  // ============================================================
  // 📮 CENTRE DE CONTACT
  //
  // Ouvre la page générale Contact sans type particulier.
  // ============================================================

  openContactCenter(
    event?: Event
  ): void {

    event?.stopPropagation();


    // ----------------------------------------------------------
    // Navigation vers le centre de contact
    // ----------------------------------------------------------

    this.router.navigate([
      '/contact'
    ]);


    // ----------------------------------------------------------
    // Fermeture de la popup
    // ----------------------------------------------------------

    this.closePopup();
  }


  // ============================================================
  // 🧹 DESTRUCTION
  // ============================================================

  ngOnDestroy(): void {

    // ----------------------------------------------------------
    // Ferme la popup si le composant est détruit.
    // ----------------------------------------------------------

    if (this.isOpen) {

      this.popupService.close('contact');

    }


    // ----------------------------------------------------------
    // Nettoyage de la subscription
    // ----------------------------------------------------------

    this.languageSubscription?.unsubscribe();
  }
}