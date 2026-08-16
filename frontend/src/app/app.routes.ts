import { Routes } from '@angular/router';
import { Register } from './pages/register/register';
import { Dashboard } from './dashboard/dashboard';

export const routes: Routes = [
  { path: 'register', component: Register },
  { path: 'dashboard', component: Dashboard },
];