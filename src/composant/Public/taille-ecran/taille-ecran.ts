import {
  Component,
  HostListener,
  ChangeDetectionStrategy
} from '@angular/core';
import { CommonModule } from '@angular/common';

type TypeEcran =
  | 'Petit mobile'
  | 'Grand mobile'
  | 'Tablette'
  | 'Laptop'
  | 'Desktop';

@Component({
  selector: 'app-taille-ecran',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './taille-ecran.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TailleEcran {

  largeur = 0;
  hauteur = 0;

  typeEcran: TypeEcran = 'Desktop';

  orientation: 'Portrait' | 'Paysage' = 'Paysage';

  breakpointTailwind = '';

  ngOnInit(): void {
    this.actualiserTaille();
  }

  /**
   * Mise à jour automatique lorsque
   * la fenêtre est redimensionnée.
   */
  @HostListener('window:resize')
  actualiserTaille(): void {
    this.largeur = window.innerWidth;
    this.hauteur = window.innerHeight;

    this.detecterTypeEcran();
    this.detecterOrientation();
    this.detecterBreakpointTailwind();
  }

  /**
   * Détection de la catégorie d'écran
   */
  private detecterTypeEcran(): void {

    if (this.largeur < 375) {

      this.typeEcran = 'Petit mobile';

    } else if (this.largeur < 640) {

      this.typeEcran = 'Grand mobile';

    } else if (this.largeur < 1024) {

      this.typeEcran = 'Tablette';

    } else if (this.largeur < 1440) {

      this.typeEcran = 'Laptop';

    } else {

      this.typeEcran = 'Desktop';
    }
  }

  /**
   * Détection portrait / paysage
   */
  private detecterOrientation(): void {

    this.orientation =
      this.hauteur >= this.largeur
        ? 'Portrait'
        : 'Paysage';
  }

  /**
   * Détection du breakpoint Tailwind
   */
  private detecterBreakpointTailwind(): void {

    if (this.largeur < 640) {

      this.breakpointTailwind = 'base';

    } else if (this.largeur < 768) {

      this.breakpointTailwind = 'sm';

    } else if (this.largeur < 1024) {

      this.breakpointTailwind = 'md';

    } else if (this.largeur < 1280) {

      this.breakpointTailwind = 'lg';

    } else if (this.largeur < 1536) {

      this.breakpointTailwind = 'xl';

    } else {

      this.breakpointTailwind = '2xl';
    }
  }

  /**
   * Emoji correspondant au type d'écran
   */
  get emojiEcran(): string {

    switch (this.typeEcran) {

      case 'Petit mobile':
        return '📱';

      case 'Grand mobile':
        return '📱';

      case 'Tablette':
        return '📲';

      case 'Laptop':
        return '💻';

      case 'Desktop':
        return '🖥️';

      default:
        return '🖥️';
    }
  }

  /**
   * Plage correspondant au type d'écran
   */
  get plageEcran(): string {

    switch (this.typeEcran) {

      case 'Petit mobile':
        return '320 – 374 px';

      case 'Grand mobile':
        return '375 – 639 px';

      case 'Tablette':
        return '640 – 1023 px';

      case 'Laptop':
        return '1024 – 1439 px';

      case 'Desktop':
        return '1440 px et +';

      default:
        return '';
    }
  }
}