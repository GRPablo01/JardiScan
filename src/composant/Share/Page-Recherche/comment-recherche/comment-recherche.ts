// À intégrer dans comment-recherche.ts
// Conserve ton mécanisme existant de thème si themeSombre
// est déjà défini dans ton composant.

import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

@Component({
  selector: 'app-comment-recherche',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './comment-recherche.html',
  styleUrl: './comment-recherche.css'
})
export class CommentRecherche {
  // Branche ici la valeur réelle de ton ThemeService.
  // Si ton composant parent possède déjà themeSombre,
  // garde cette propriété et sa synchronisation existantes.
  themeSombre = false;
}