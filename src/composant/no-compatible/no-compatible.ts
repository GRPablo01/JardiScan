
import { Component, HostListener, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { ThemeService } from '../../../Backend/Services/theme.service';


@Component({
  selector: 'app-no-compatible',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './no-compatible.html',
  styleUrl: './no-compatible.css'
})
export class NoCompatible {
  readonly themeService = inject(ThemeService);

  private readonly router = inject(Router);
  private readonly largeurMinimale = 325;

  @HostListener('window:resize')
  onResize(): void {
    this.verifierCompatibilite();
  }

  verifierCompatibilite(): void {
    if (window.innerWidth >= this.largeurMinimale) {
      void this.router.navigateByUrl('/');
    }
  }
}
