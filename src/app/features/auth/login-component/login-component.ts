import { Component, inject, OnInit, signal } from '@angular/core';
import { Router, RouterModule, RouterOutlet } from '@angular/router';
import { Usuario } from './Usuario';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { finalize } from 'rxjs';
import { AuthService } from '../services/auth-service';
import { NotificationService } from '../../../core/services/notification-service';

@Component({
  selector: 'app-login-component',
  standalone: true,
  imports: [RouterModule, CommonModule, ReactiveFormsModule],
  templateUrl: './login-component.html',
  styleUrl: './login-component.css'
})
export class LoginComponent {

  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);
  private notif = inject(NotificationService);
  isLoading = signal(false);
  errorMessage = signal<string | null>(null);

  loginForm = this.fb.nonNullable.group({
    username: ['', [Validators.required]],
    password: ['', [Validators.required, Validators.minLength(6)]]
  });

  onSubmit() {
    if (this.loginForm.valid) {
      this.isLoading.set(true);
      this.errorMessage.set(null);

      this.authService.login(this.loginForm.getRawValue())
        .pipe(
          finalize(() => this.isLoading.set(false))
        )
        .subscribe({
          next: (res) => { // 'res' es de tipo AuthResponse
            this.notif.success(`Bienvenido, ${res.user_info.firstName}`);
            if (res.user_info.mustChangePassword) {
              console.log("Usuario requiere cambio de clave, redirigiendo...");
              this.router.navigate(['/force-password-change']);
            } else {
              this.router.navigate(['/dashboard']);
            }
          },
          error: (err) => {
            this.errorMessage.set('Credenciales inválidas. Revisa tu usuario o contraseña.');
            this.notif.error(err.error?.message || 'Error en la autenticación');
          }
        });
    }
  }

}
