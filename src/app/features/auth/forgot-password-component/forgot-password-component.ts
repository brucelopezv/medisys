import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { finalize } from 'rxjs';
import { CommonModule } from '@angular/common';
import { AuthService } from '../services/auth-service';
import { NotificationService } from '../../../core/services/notification-service';

@Component({
  selector: 'app-forgot-password-component',
  imports: [ReactiveFormsModule, CommonModule, RouterModule],
  templateUrl: './forgot-password-component.html',
  styleUrl: './forgot-password-component.css'
})
export class ForgotPasswordComponent {

  private fb = inject(FormBuilder);
  public authService = inject(AuthService);
  private router = inject(Router);
  private notif = inject(NotificationService);

  email = signal(false);
  isLoading = signal(false);

  emailForm = this.fb.nonNullable.group({
    email: ['', [Validators.email, Validators.required]],
  });


  onSubmit() {
    if (this.emailForm.valid) {
      this.isLoading.set(true);
      const email = this.emailForm.getRawValue().email;

      this.authService.resetPassword(email)
        .pipe(finalize(() => this.isLoading.set(false)))
        .subscribe({
          next: () => {
            this.notif.success('Contraseña temporal ha sido enviada al correo correctamente');
            this.router.navigate(['/login']);
          },
          error: (err) => {
            this.notif.error(err.error?.message || 'Error al intentar recuperar la contraseña');
          }
        });
    }
  }


}
