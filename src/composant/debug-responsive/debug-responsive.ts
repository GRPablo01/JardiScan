import {
  Component,
  HostListener,
  OnInit,
  OnDestroy
} from '@angular/core';

@Component({
  selector: 'app-debug-responsive',
  standalone: true,
  templateUrl: './debug-responsive.html',
  styleUrls: ['./debug-responsive.css']
})
export class DebugResponsive implements OnInit, OnDestroy {

  largeur = 0;
  hauteur = 0;

  typeEcran = '';
  breakpoint = '';
  orientation = '';

  ratio = 0;

  heure = '';

  ngOnInit(): void {
    this.mettreAJour();
  }

  ngOnDestroy(): void {}

  @HostListener('window:resize')
  onResize(): void {
    this.mettreAJour();
  }

  @HostListener('window:orientationchange')
  onOrientationChange(): void {
    this.mettreAJour();
  }

  private mettreAJour(): void {

    this.largeur = window.innerWidth;
    this.hauteur = window.innerHeight;

    this.ratio = Number(
      (this.largeur / this.hauteur).toFixed(2)
    );

    this.orientation =
      this.largeur >= this.hauteur
        ? 'Paysage'
        : 'Portrait';

    /*
    ============================================================
    BREAKPOINTS JARDISCAN
    ============================================================
    */

    if (this.largeur < 640) {

      this.typeEcran = '📱 Mobile';
      this.breakpoint = '< 640px';

    } else if (this.largeur < 768) {

      this.typeEcran = '📱 Grande tablette';
      this.breakpoint = '640px → 767px';

    } else if (this.largeur < 1024) {

      this.typeEcran = '📱 Tablette';
      this.breakpoint = '768px → 1023px';

    } else if (this.largeur < 1280) {

      this.typeEcran = '💻 Petit laptop';
      this.breakpoint = '1024px → 1279px';

    } else if (this.largeur < 1536) {

      this.typeEcran = '🖥️ Desktop';
      this.breakpoint = '1280px → 1535px';

    } else {

      this.typeEcran = '🖥️ Grand écran';
      this.breakpoint = '≥ 1536px';

    }

    this.heure = new Date().toLocaleTimeString('fr-FR');
  }
}