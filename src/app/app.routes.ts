import { Routes } from '@angular/router';
import { Connexion } from '../Page/Auth/connexion/connexion';
import { Inscription } from '../Page/Auth/inscription/inscription';
import { Accueil } from '../Page/Share/accueil/accueil';
import { Rechercher } from '../Page/Share/rechercher/rechercher';
import { DashBoard } from '../Page/Share/dash-board/dash-board';
import { Diagnostiquer } from '../Page/diagnostiquer/diagnostiquer';
import { Assistant } from '../Page/Share/assistant/assistant';



export const routes: Routes = [
    { path: '', component: Connexion },
    { path: 'accueil', component: Accueil},
    { path: 'login', component: Connexion},
    { path: 'register', component: Inscription},
    { path: 'recherche', component: Rechercher},
    { path: 'dashboard', component: DashBoard},
    { path: 'diagnostic', component: Diagnostiquer },
    { path: 'assistant', component: Assistant },
    
    // { path: 'scannerplante', component: ScanerPlante },
    // { path: 'myplants', component: MyPlants},
    // { path: 'centreaide', component: CentreAide},
    // { path: 'parametres', component: Paramettre},
    
    
    // { path: 'change-password', component: ChangePassword },
    // { path: 'scan', component: Scan },
    // { path: 'profil', component: MonProfil },
    // { path: 'diagnostic', component: Diagnostiquer },
    // { path: 'saison', component: Saison},
    // { path: 'search', component: Rechercher},
    // { path: 'decouvrir', component: Decouvrir},
    // { path: 'recherche', component: WidgetSearch},
];
