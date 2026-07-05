import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../../features/auth/services/auth-service';



export const authGuard: CanActivateFn = (route, state) => {
    const authService = inject(AuthService);
    const router = inject(Router);

    // Si hay un token en el signal, permitimos el acceso
    if (authService.token()) {
        return true;
    }

    // Si no está logueado, redirigimos al login
    return router.parseUrl('/login');
};