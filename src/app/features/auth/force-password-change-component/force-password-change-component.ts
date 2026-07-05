import { Component, computed, inject, signal } from '@angular/core';
import { FormBuilder, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { finalize } from 'rxjs';
import { CommonModule } from '@angular/common';
import { AuthService } from '../services/auth-service';
import { NotificationService } from '../../../core/services/notification-service';

@Component({
  selector: 'app-force-password-change-component',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './force-password-change-component.html',
  styleUrl: './force-password-change-component.css'
})
export class ForcePasswordChangeComponent {

  private fb = inject(FormBuilder);
  public authService = inject(AuthService);
  private router = inject(Router);
  private notif = inject(NotificationService);


  showPassword = signal(false);
  isLoading = signal(false);

  passwordForm = this.fb.nonNullable.group({
    newPassword: ['', [Validators.required, Validators.minLength(8)]],
    confirmPassword: ['', [Validators.required]]
  }, {
    validators: (group) => {
      const pass = group.get('newPassword')?.value;
      const confirm = group.get('confirmPassword')?.value;
      return pass === confirm ? null : { notMatching: true };
    }
  });


  onSubmit() {
    if (this.passwordForm.valid) {
      this.isLoading.set(true);
      const newPassword = this.passwordForm.getRawValue().newPassword;

      this.authService.updatePassword(newPassword)
        .pipe(finalize(() => this.isLoading.set(false)))
        .subscribe({
          next: () => {
            this.notif.success('Contraseña actualizada correctamente');
            const user = this.authService.currentUser();
            if (user) {
              const updatedUser = { ...user, mustChangePassword: false };
              this.authService.currentUser.set(updatedUser);
              if (typeof window !== 'undefined') {
                localStorage.setItem('user_data', JSON.stringify(updatedUser));
              }
            }
            this.router.navigate(['/dashboard']);
          },
          error: (err) => {
            this.notif.error(err.error?.message || 'Error al actualizar la contraseña');
          }
        });
    }
  }

  togglePassword() {
    this.showPassword.update(v => !v);
  }

  logout() {
    this.authService.logout();
  }

}
