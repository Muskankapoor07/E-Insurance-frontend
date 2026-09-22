import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { UserRole } from '../models/models';

export const authGuard: CanActivateFn = () => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (authService.isAuthenticated()) {
    return true;
  }

  router.navigate(['/auth/login']);
  return false;
};

export const roleGuard = (allowedRoles: UserRole[]): CanActivateFn => {
  return () => {
    const authService = inject(AuthService);
    const router = inject(Router);
    const currentRole = authService.userRole();

    if (currentRole && allowedRoles.includes(currentRole)) {
      return true;
    }

    // Redirect to respective dashboard or login
    if (currentRole) {
      authService.redirectToDashboard(currentRole);
    } else {
      router.navigate(['/auth/login']);
    }
    return false;
  };
};
