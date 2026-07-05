import { inject } from '@angular/core';
import { Router, CanActivateFn } from '@angular/router';
import { AuthService } from '../../features/auth/services/auth-service';



export const passwordChangeGuard: CanActivateFn = () => {
    const authService = inject(AuthService);
    const router = inject(Router);
    const user = authService.currentUser();

    console.log('Ejecutando Guard. Usuario actual:', user);

    if (user) {
        if (user.mustChangePassword === true) {
            return true;
        } else {
            router.navigate(['/dashboard']);
            return false;
        }
    }

    const savedUser = localStorage.getItem('user_data');
    if (savedUser) {
        const parsedUser = JSON.parse(savedUser);
        if (parsedUser.mustChangePassword === true) {
            return true;
        }
    }

    router.navigate(['/login']);
    return false;
};