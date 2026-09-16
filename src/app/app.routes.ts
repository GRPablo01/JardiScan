import { Routes } from '@angular/router';
import { Bienvenue } from '../Page/bienvenue/bienvenue';
import { ScanerPlante } from '../Page/scaner-plante/scaner-plante';
import { MyPlants } from '../Page/my-plants/my-plants';
import { Paramettre } from '../Page/paramettre/paramettre';
import { CentreAide } from '../Page/centre-aide/centre-aide';
import { Connexion } from '../Page/connexion/connexion';
import { Inscription } from '../Page/inscription/inscription';
import { Accueil } from '../Page/accueil/accueil';
import { ChangePassword } from '../Page/change-password/change-password';


export const routes: Routes = [
    { path: '', component: Bienvenue },
    { path: 'scannerplante', component: ScanerPlante },
    { path: 'myplants', component: MyPlants},
    { path: 'centreaide', component: CentreAide},
    { path: 'parametres', component: Paramettre},
    { path: 'login', component: Connexion},
    { path: 'register', component: Inscription},
    { path: 'accueil', component: Accueil},
    { path: 'change-password', component: ChangePassword },
];
