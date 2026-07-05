import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../../features/auth/services/auth-service';


export const publicGuard: CanActivateFn = (route, state) => {
    const authService = inject(AuthService);
    const router = inject(Router);

    // Si el usuario YA está logueado, no lo dejamos entrar al Login
    if (authService.token()) {
        return router.parseUrl('/dashboard'); // O la ruta principal de tu app
    }

    // Si no está logueado, lo dejamos pasar al Login
    return true;
};