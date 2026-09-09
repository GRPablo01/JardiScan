import {
  Component,
  HostListener,
  OnInit,
  OnDestroy
} from '@angular/core';

import { CommonModule } from '@angular/common';

import {
  Router,
  NavigationEnd,
  RouterLink
} from '@angular/router';

import { Subscription } from 'rxjs';

import { ThemeService } from '../../../../../Backend/Services/theme.service';

import {
  LanguageService
} from '../../../../../Backend/Services/language.service';

import {
  PopupService
} from '../../../../../Backend/Services/popup.service';


// ============================================================
// ❓ AIDE — JARDISCAN
//
// • Popup d'aide
// • Détection automatique de la page actuelle
// • Aide contextuelle
// • Centre d'aide complet
// • Light / Dark
// • Français / English
// • Changement de langue instantané
// • Clic n'importe où → fermeture
// • ESC → fermeture
// • Une seule popup ouverte à la fois
// • Compatible avec Language / Theme / Contact
// • Positionnement responsive identique au Language Popup
// • Animation droite → gauche
// ============================================================

@Component({
  selector: 'app-aide',

  standalone: true,

  imports: [
    CommonModule,
    RouterLink
  ],

  templateUrl: './aide.html',

  styleUrl: './aide.css'
})


export class Aide implements OnInit, OnDestroy {

  // ============================================================
  // ❓ POPUP
  //
  // L'état est entièrement géré par PopupService.
  // ============================================================

  get isOpen(): boolean {
    return this.popupService.isOpen('aide');
  }


  // ============================================================
  // 📍 POSITION DU POPUP
  //
  // Identique au système du Language Popup.
  //
  // Desktop :
  // → sous le bouton
  //
  // Mobile / tablette :
  // → à droite du bouton
  // ============================================================

  popupTop = 0;

  popupLeft = 0;

  popupTransform = '';


  // ============================================================
  // 📍 PAGE ACTUELLE
  // ============================================================

  currentPage = 'accueil';


  // ============================================================
  // 🎯 SECTION D'AIDE ACTIVE
  // ============================================================

  selectedHelp: string | null = null;


  // ============================================================
  // 🌐 LANGUE ACTUELLE
  // ============================================================

  currentLanguage: 'fr' | 'en' = 'fr';


  // ============================================================
  // 🔄 SUBSCRIPTIONS
  // ============================================================

  private languageSubscription?: Subscription;

  private routerSubscription?: Subscription;


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
    // 🌐 Langue actuelle
    // ----------------------------------------------------------

    this.currentLanguage =
      this.languageService.currentLanguage;


    // ----------------------------------------------------------
    // 🌐 Écoute des changements de langue
    //
    // Permet de mettre à jour instantanément
    // tous les textes de la popup.
    // ----------------------------------------------------------

    this.languageSubscription =
      this.languageService.language$.subscribe(
        language => {

          this.currentLanguage = language;

        }
      );


    // ----------------------------------------------------------
    // 📍 Détection immédiate de la page actuelle
    // ----------------------------------------------------------

    this.updateCurrentPage(
      this.router.url
    );


    // ----------------------------------------------------------
    // 🧭 Détection des changements de route
    // ----------------------------------------------------------

    this.routerSubscription =
      this.router.events.subscribe(
        event => {

          if (event instanceof NavigationEnd) {

            this.updateCurrentPage(
              event.urlAfterRedirects
            );

          }

        }
      );

  }


  // ============================================================
  // 📍 DÉTECTION DE LA PAGE ACTUELLE
  // ============================================================

  private updateCurrentPage(
    url: string
  ): void {

    const cleanUrl =
      url
        .split('?')[0]
        .split('#')[0]
        .toLowerCase();


    // ==========================================================
    // 🌱 SCANNER
    // ==========================================================

    if (
      cleanUrl.includes('scanner') ||
      cleanUrl.includes('scan')
    ) {

      this.currentPage = 'scanner';

      return;

    }


    // ==========================================================
    // 🌿 PLANTES
    // ==========================================================

    if (
      cleanUrl.includes('plantes') ||
      cleanUrl.includes('plants') ||
      cleanUrl.includes('myplants')
    ) {

      this.currentPage = 'plants';

      return;

    }


    // ==========================================================
    // 🔎 IDENTIFICATION
    // ==========================================================

    if (
      cleanUrl.includes('identification') ||
      cleanUrl.includes('identify')
    ) {

      this.currentPage = 'identification';

      return;

    }


    // ==========================================================
    // 📚 COLLECTION
    // ==========================================================

    if (
      cleanUrl.includes('collection')
    ) {

      this.currentPage = 'collection';

      return;

    }


    // ==========================================================
    // ⚙️ PARAMÈTRES
    // ==========================================================

    if (
      cleanUrl.includes('parametres') ||
      cleanUrl.includes('settings')
    ) {

      this.currentPage = 'settings';

      return;

    }


    // ==========================================================
    // 🏠 ACCUEIL
    // ==========================================================

    this.currentPage = 'accueil';

  }


  // ============================================================
  // 📐 CALCUL DE POSITION DU POPUP
  //
  // Même logique que le Language Popup.
  // ============================================================

  private updatePopupPosition(
    button: HTMLElement
  ): void {
  
    if (!button) {
      return;
    }
  
    const rect = button.getBoundingClientRect();
  
    const viewportWidth = window.innerWidth;
    const viewportPadding = 12;
    const popupWidth = 285;
    const gap = 10;
  
    const isDesktop =
      viewportWidth >= 1024;
  
  
    // ==========================================================
    // 💻 LAPTOP / DESKTOP
    //
    // Popup sous le bouton
    // ==========================================================
  
    if (isDesktop) {
  
      this.popupTop =
        rect.bottom + gap;
  
      /*
       * Centre le popup sous le bouton.
       */
  
      let left =
        rect.left + (rect.width / 2);
  
  
      /*
       * Empêche le popup de dépasser
       * à gauche de l'écran.
       */
  
      const minLeft =
        (popupWidth / 2) + viewportPadding;
  
  
      /*
       * Empêche le popup de dépasser
       * à droite de l'écran.
       */
  
      const maxLeft =
        viewportWidth -
        (popupWidth / 2) -
        viewportPadding;
  
  
      left =
        Math.max(
          minLeft,
          Math.min(
            left,
            maxLeft
          )
        );
  
  
      this.popupLeft = left;
  
      this.popupTransform =
        'translateX(-50%)';
  
      return;
    }
  
  
    // ==========================================================
    // 📱 MOBILE / TABLETTE
    //
    // Popup à droite du bouton
    //
    // MAIS :
    // → s'il n'y a pas assez de place à droite,
    //   il est automatiquement décalé vers la gauche.
    // ==========================================================
  
    this.popupTop =
      rect.top + (rect.height / 2);
  
  
    /*
     * Position idéale :
     * juste à droite du bouton.
     */
  
    let left =
      rect.right + gap;
  
  
    /*
     * Position maximale permettant de garder
     * toute la popup dans l'écran.
     */
  
    const maxLeft =
      viewportWidth -
      popupWidth -
      viewportPadding;
  
  
    /*
     * Si la popup dépasserait à droite,
     * on la déplace automatiquement vers la gauche.
     */
  
    left =
      Math.min(
        left,
        maxLeft
      );
  
  
    /*
     * Sécurité supplémentaire pour les
     * très petits écrans.
     */
  
    left =
      Math.max(
        viewportPadding,
        left
      );
  
  
    this.popupLeft =
      left;
  
  
    /*
     * Sur mobile :
     * le popup reste centré verticalement
     * par rapport au bouton.
     */
  
    this.popupTransform =
      'translateY(-50%)';
  }


  // ============================================================
  // 🔄 RECALCUL DU POPUP
  //
  // Permet de conserver le popup correctement positionné
  // lors d'un resize ou d'un scroll.
  // ============================================================

  private repositionPopup(): void {

    if (!this.isOpen) {
      return;
    }


    const button =
      document.querySelector(
        'app-aide button[aria-label], app-aide > button'
      ) as HTMLElement | null;


    if (button) {

      this.updatePopupPosition(button);

    }

  }


  // ============================================================
  // 🖥️ RESIZE
  // ============================================================

  @HostListener('window:resize')
  onWindowResize(): void {

    this.repositionPopup();

  }


  // ============================================================
  // 📜 SCROLL
  // ============================================================

  @HostListener('window:scroll')
  onWindowScroll(): void {

    this.repositionPopup();

  }


  // ============================================================
  // ❓ TOGGLE POPUP
  // ============================================================

  togglePopup(
    event?: Event
  ): void {

    // ----------------------------------------------------------
    // Empêche le document:click de fermer immédiatement
    // la popup lorsque l'utilisateur clique sur le bouton.
    // ----------------------------------------------------------

    event?.stopPropagation();


    // ----------------------------------------------------------
    // Si Aide est déjà ouverte → fermeture
    // ----------------------------------------------------------

    if (this.isOpen) {

      this.popupService.close('aide');

      this.selectedHelp = null;

      return;

    }


    // ----------------------------------------------------------
    // Recherche du bouton déclencheur
    // ----------------------------------------------------------

    const button =
      event?.currentTarget as HTMLElement | null;


    // ----------------------------------------------------------
    // Calcul de la position AVANT l'ouverture.
    //
    // Cela évite un déplacement visible du popup.
    // ----------------------------------------------------------

    if (button) {

      this.updatePopupPosition(button);

    }


    // ----------------------------------------------------------
    // Ouvre Aide.
    //
    // PopupService ferme automatiquement
    // les autres popups.
    // ----------------------------------------------------------

    this.popupService.open('aide');


    // ----------------------------------------------------------
    // Nouvelle ouverture → nouvelle sélection
    // ----------------------------------------------------------

    this.selectedHelp = null;

  }


  // ============================================================
  // ❌ FERMER LA POPUP
  // ============================================================

  closePopup(): void {

    this.popupService.close('aide');

    this.selectedHelp = null;

  }


  // ============================================================
  // 🖱️ CLIC EN DEHORS DU COMPOSANT
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
  // 🎯 AIDE DE LA PAGE ACTUELLE
  // ============================================================

  openCurrentPageHelp(
    event?: Event
  ): void {

    event?.stopPropagation();


    // ----------------------------------------------------------
    // Mémorise la section actuelle
    // ----------------------------------------------------------

    this.selectedHelp =
      this.currentPage;


    // ----------------------------------------------------------
    // Ferme la popup
    // ----------------------------------------------------------

    this.closePopup();

  }


  // ============================================================
  // 📚 OUVRIR UNE CATÉGORIE D'AIDE
  // ============================================================

  openHelp(
    section: string,
    event?: Event
  ): void {

    event?.stopPropagation();


    // ----------------------------------------------------------
    // Mémorise la section sélectionnée
    // ----------------------------------------------------------

    this.selectedHelp =
      section;


    // ----------------------------------------------------------
    // Ferme la popup
    // ----------------------------------------------------------

    this.closePopup();

  }


  // ============================================================
  // 📖 CENTRE D'AIDE COMPLET
  // ============================================================

  openHelpCenter(
    event?: Event
  ): void {

    event?.stopPropagation();


    // ----------------------------------------------------------
    // Navigation vers le centre d'aide
    // ----------------------------------------------------------

    this.router.navigate([
      '/aide'
    ]);


    // ----------------------------------------------------------
    // Ferme la popup
    // ----------------------------------------------------------

    this.closePopup();

  }


  // ============================================================
  // 🧹 DESTRUCTION
  // ============================================================

  ngOnDestroy(): void {

    // ----------------------------------------------------------
    // Ferme la popup si le composant est détruit
    // ----------------------------------------------------------

    if (this.isOpen) {

      this.popupService.close('aide');

    }


    // ----------------------------------------------------------
    // Nettoyage des subscriptions
    // ----------------------------------------------------------

    this.languageSubscription?.unsubscribe();

    this.routerSubscription?.unsubscribe();

  }

}