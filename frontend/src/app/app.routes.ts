import { Routes } from '@angular/router';
import { Register } from './pages/register/register';
import { Dashboard } from './dashboard/dashboard';
import { Login } from './pages/login/login';

export const routes: Routes = [
  { path: 'register', component: Register },
  { path: 'dashboard', component: Dashboard },
  { path: 'login', component: Login },
];