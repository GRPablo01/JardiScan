import { Component } from '@angular/core';
import { Theme } from "../../Share/Icon/theme/theme";
import { Language2 } from "../../Share/Icon/language/language";
import { Aide } from "../../Share/Icon/aide/aide";
import { Contact } from "../../Share/Icon/contact/contact";

@Component({
  selector: 'app-liste-icon',
  imports: [Theme, Language2, Aide, Contact],
  templateUrl: './liste-icon.html',
  styleUrl: './liste-icon.css',
})
export class ListeIcon {

}
