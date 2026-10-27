import { Component } from '@angular/core';
import { LanguageDesktop } from '../../Share/Icon/language-desktop/language-desktop';
import { Language2 } from '../../Share/Icon/language/language';

@Component({
  selector: 'app-bouton-language',
  imports: [LanguageDesktop, Language2],
  templateUrl: './bouton-language.html',
  styleUrl: './bouton-language.css',
})
export class BoutonLanguage {

}
