import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-welcome-scan',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './welcome-scan.html',
  styleUrl: './welcome-scan.css'
})
export class WelcomeScan {

  prenom = '';

  constructor(
    private router: Router
  ) {
    this.chargerUtilisateur();
  }


  /**
   * Récupère l'utilisateur connecté
   */
  private chargerUtilisateur(): void {

    const utilisateur = localStorage.getItem('utilisateur');

    if (!utilisateur) {
      return;
    }

    try {

      const user = JSON.parse(utilisateur);

      this.prenom =
        user?.prenom ||
        user?.firstName ||
        '';

    } catch (error) {

      console.error(
        'Impossible de récupérer l’utilisateur.',
        error
      );

    }
  }


  /**
   * Lance le scanner
   */
  commencerScan(): void {
    this.router.navigate(['/scan']);
  }

}