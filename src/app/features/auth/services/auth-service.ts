import { HttpClient, HttpHeaders } from '@angular/common/http';
import { inject, Injectable, PLATFORM_ID, signal } from '@angular/core';
import { catchError, Observable, tap, throwError, timeout } from 'rxjs';
import { isPlatformBrowser } from '@angular/common';
import { jwtDecode } from 'jwt-decode'; // Importación de la librería
import { Router } from '@angular/router';
import { JwtPayload } from '../login-component/JwtPayload';
import { User } from '../../user-component/User';

export interface AuthResponse {
  access_token: string;
  token_type: string;
  expires_in: number;
  timestamp: string;
  user_info: User;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private http = inject(HttpClient);
  private urlEndpoint: string = 'http://localhost:8085/api/auth'
  private platformId = inject(PLATFORM_ID); // Inyectamos el ID de la plataforma
  private router = inject(Router); // 2. Inyecta el Router

  token = signal<string | null>(null);
  currentUser = signal<User | null>(null);


  constructor() {
    if (isPlatformBrowser(this.platformId)) {
      const savedToken = localStorage.getItem('token');
      const savedUserData = localStorage.getItem('user_data'); // <-- Nueva llave
      if (savedToken) {
        this.token.set(savedToken);
        if (savedUserData) {
          try {
            this.currentUser.set(JSON.parse(savedUserData));
          } catch (e) {
            console.error("Error parseando user_data", e);
            this.decodeAndSetUser(savedToken); // Fallback al token si falla el JSON
          }
        } else {
          // 2. Si no hay user_data, usamos el token como antes
          this.decodeAndSetUser(savedToken);
        }
      }
    }
  }

  login(credentials: { username: string; password: string }) {
    return this.http.post<AuthResponse>(`${this.urlEndpoint}/login`, credentials).pipe(
      tap(res => {

        if (isPlatformBrowser(this.platformId)) {
          localStorage.setItem('token', res.access_token);
          localStorage.setItem('user_data', JSON.stringify(res.user_info));
        }
        this.currentUser.set(res.user_info);
        this.token.set(res.access_token);

        console.log('Login exitoso, flag mustChangePassword:', res.user_info);
      })
    );
  }

  updatePassword(newPassword: string) {
    const user = this.currentUser();
    if (!user || !user.id) throw new Error("No se encontró el ID del usuario");
    const url = `${this.urlEndpoint}/update-password`;
    return this.http.post(url, {
      userId: user.id,
      newPassword: newPassword
    });
  }

  resetPassword(email: string) {
    const url = `${this.urlEndpoint}/reset-password`;
    return this.http.post(url, {
      email: email
    });
  }

  logout() {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.removeItem('token');
    }
    this.token.set(null);
    this.currentUser.set(null);
    this.router.navigate(['/login']);
  }

  private decodeAndSetUser(token: string) {
    try {
      const decoded = jwtDecode<JwtPayload>(token);
      this.currentUser.set(decoded.user_info);
    } catch (error) {
      this.logout();
    }
  }

  hasRole(roleName: string): boolean {
    const user = this.currentUser();

    if (!user || !user.roles) return false;

    // Buscamos si existe algún objeto role cuyo campo 'name' coincida con el string
    return user.roles.some(role =>
      role.name.toUpperCase() === roleName.toUpperCase() ||
      role.name.toUpperCase() === `ROLE_${roleName.toUpperCase()}`
    );
  }

  hasAnyRole(expectedRoles: string[]): boolean {
    const user = this.currentUser();

    // Si no hay usuario o no tiene roles, no tiene acceso
    if (!user || !user.roles || user.roles.length === 0) {
      return false;
    }

    // Extraemos solo los nombres de los roles del usuario para comparar strings con strings
    const userRoleNames = user.roles.map(role => role.name.toUpperCase());

    return expectedRoles.some(expected => {
      const expectedUpper = expected.toUpperCase();

      // Verificamos coincidencia exacta o coincidencia con prefijo ROLE_
      return userRoleNames.includes(expectedUpper) ||
        userRoleNames.includes(`ROLE_${expectedUpper}`);
    });
  }

  isLoggedIn(): boolean {
    return !!this.token();
  }

  updateLocalUserStatus(partialUser: Partial<User>): void {
    const current = this.currentUser();
    if (current) {
      // Creamos un nuevo objeto combinando el actual con los cambios
      this.currentUser.set({ ...current, ...partialUser });

      // Si guardas el usuario en localStorage/sessionStorage, actualízalo también:
      localStorage.setItem('user', JSON.stringify(this.currentUser()));

      console.log('Estado de usuario local actualizado:', this.currentUser());
    }
  }

}
