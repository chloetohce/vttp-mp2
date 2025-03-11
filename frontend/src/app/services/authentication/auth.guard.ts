import { inject } from '@angular/core';
import { ActivatedRouteSnapshot, Router, RouterStateSnapshot } from '@angular/router';
import { AuthService } from './auth.service';
import { Store } from '@ngrx/store';
import { selectIsLoggedIn } from '../../store/authentication/auth.store';

export const checkIfAuthenticated = async (
  route: ActivatedRouteSnapshot,
  state: RouterStateSnapshot
) => {
    const authService = inject(AuthService);
    const authStore = inject(Store)
    const router = inject(Router);

    if (await authService.isAuthenticated()) {
        return true;
    }
    authService.logout()
    return router.parseUrl('/login')
};
