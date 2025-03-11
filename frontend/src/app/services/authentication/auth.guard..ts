import { inject } from '@angular/core';
import { ActivatedRouteSnapshot, Router, RouterStateSnapshot } from '@angular/router';
import { AuthService } from './auth.service';

export const checkIfAuthenticated = (
  route: ActivatedRouteSnapshot,
  state: RouterStateSnapshot
) => {
    const authService = inject(AuthService);
    const router = inject(Router);
    console.log(authService.isLoggedIn)

    if (authService.isLoggedIn) {
        return true;
    }
    return router.parseUrl('/login')
};
