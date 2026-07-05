import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../../features/auth/services/auth-service';



export const roleGuard: CanActivateFn = (route, state) => {
    const authService = inject(AuthService);
    const router = inject(Router);

    if (!authService.isLoggedIn()) {
        return router.createUrlTree(['/login']);
    }

    const user = authService.currentUser();
    if (user && user.mustChangePassword) {
        console.warn('Acceso restringido: Debes cambiar tu contraseña primero');
        return router.createUrlTree(['/force-password-change']);
    }


    const expectedRoles: string[] = route.data['expectedRoles'];
    if (expectedRoles && !authService.hasAnyRole(expectedRoles)) {
        console.warn('Acceso denegado: No tienes los roles requeridos');
        return router.createUrlTree(['/dashboard']);
    }

    return true;
};