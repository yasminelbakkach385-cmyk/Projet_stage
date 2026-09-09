import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth';

export const employeGuard: CanActivateFn = () => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (!authService.estConnecte()) {
    router.navigate(['/login']);
    return false;
  }

  if (!authService.estEmploye()) {
    router.navigate(['/']);
    return false;
  }

  return true;
};