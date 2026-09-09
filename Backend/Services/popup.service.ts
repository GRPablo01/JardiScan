import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export type PopupName =
  | 'language'
  | 'aide'
  | 'contact'
  | null;

@Injectable({
  providedIn: 'root'
})
export class PopupService {

  private readonly openedPopupSubject =
    new BehaviorSubject<PopupName>(null);

  readonly openedPopup$ =
    this.openedPopupSubject.asObservable();


  // ============================================================
  // 🔍 POPUP ACTUELLEMENT OUVERTE
  // ============================================================

  get openedPopup(): PopupName {
    return this.openedPopupSubject.value;
  }


  // ============================================================
  // 🔓 OUVRIR UNE POPUP
  //
  // Si une autre popup est ouverte :
  // → elle est automatiquement considérée comme fermée.
  // ============================================================

  open(popup: Exclude<PopupName, null>): void {

    this.openedPopupSubject.next(popup);

  }


  // ============================================================
  // 🔒 FERMER UNE POPUP
  // ============================================================

  close(popup?: Exclude<PopupName, null>): void {

    // ----------------------------------------------------------
    // Si aucune popup précise n'est indiquée,
    // on ferme tout.
    // ----------------------------------------------------------

    if (!popup) {

      this.openedPopupSubject.next(null);

      return;

    }


    // ----------------------------------------------------------
    // On ne ferme que si cette popup est actuellement ouverte.
    // ----------------------------------------------------------

    if (this.openedPopup === popup) {

      this.openedPopupSubject.next(null);

    }

  }


  // ============================================================
  // 🔄 TOGGLE
  // ============================================================

  toggle(popup: Exclude<PopupName, null>): void {

    if (this.openedPopup === popup) {

      this.close(popup);

    } else {

      this.open(popup);

    }

  }


  // ============================================================
  // ❓ SAVOIR SI UNE POPUP EST OUVERTE
  // ============================================================

  isOpen(popup: Exclude<PopupName, null>): boolean {

    return this.openedPopup === popup;

  }

}