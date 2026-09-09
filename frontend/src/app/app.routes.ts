import { AnnoncesAdmin } from './pages/annonces-admin/annonces-admin';
import { AnnonceDetail } from './pages/annonce-detail/annonce-detail';
import { APropos } from './pages/a-propos/a-propos';
import { ReclamationsAdmin } from './pages/reclamations-admin/reclamations-admin';
import { Rapports } from './pages/rapports/rapports';
import { CarteAdmin } from './pages/carte-admin/carte-admin';
import { Parametres } from './pages/parametres/parametres';
import { Routes } from '@angular/router';
import { Accueil } from './pages/accueil/accueil';
import { Register } from './pages/register/register';
import { Login } from './pages/login/login';
import { Dashboard } from './dashboard/dashboard';
import { DeposerPlainte } from './pages/deposer-plainte/deposer-plainte';
import { SuivrePlainte } from './pages/suivre-plainte/suivre-plainte';
import { authGuard } from './guards/auth.guard';
import { employeGuard } from './guards/employe.guard';

export const routes: Routes = [
  { path: 'annonces-admin', component: AnnoncesAdmin, canActivate: [employeGuard] },
  { path: 'annonce/:id', component: AnnonceDetail },
  { path: 'a-propos', component: APropos },
  { path: '', component: Accueil },
  { path: 'login', component: Login },
  { path: 'register', component: Register },
  { path: 'dashboard', component: Dashboard, canActivate: [employeGuard] },
  { path: 'deposer', component: DeposerPlainte, canActivate: [authGuard] },
  { path: 'suivre', component: SuivrePlainte },
  { path: 'reclamations-admin', component: ReclamationsAdmin, canActivate: [employeGuard] },
  { path: 'rapports', component: Rapports, canActivate: [employeGuard] },
  { path: 'carte-admin', component: CarteAdmin, canActivate: [employeGuard] },
  { path: 'parametres', component: Parametres, canActivate: [employeGuard] },
];