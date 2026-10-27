import { Component } from '@angular/core';
import { HeaderBienvenue } from '../Share/Page-Bienvenue/header-bienvenue/header-bienvenue';
import { Header } from '../Public/header/header';
import { Welcome } from '../Share/Page-Accueil/welcome/welcome';
import { Pourquoi } from '../Share/Page-Accueil/pourquoi/pourquoi';


@Component({
  selector: 'app-teste',
  imports: [HeaderBienvenue, Header, Welcome, Pourquoi],
  templateUrl: './teste.html',
  styleUrl: './teste.css',
})
export class Teste {

}
