import { Routes } from '@angular/router';
import { Bienvenue } from '../Page/bienvenue/bienvenue';
import { ScanerPlante } from '../Page/scaner-plante/scaner-plante';
import { MyPlants } from '../Page/my-plants/my-plants';
import { Paramettre } from '../Page/paramettre/paramettre';

export const routes: Routes = [
    { path: '', component: Bienvenue },
    { path: 'scannerplante', component: ScanerPlante },
    { path: 'myplants', component: MyPlants},
    { path: 'parametres', component: Paramettre},
];
