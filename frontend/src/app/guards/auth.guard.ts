import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth';

export const authGuard: CanActivateFn = () => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (!authService.estConnecte()) {
    router.navigate(['/login']);
    return false;
  }

  if (authService.estEmploye()) {
    router.navigate(['/dashboard']);
    return false;
  }

  return true;
};