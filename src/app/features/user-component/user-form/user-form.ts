import { Component, inject, OnInit, signal, computed } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { NotificationService } from '../../../core/services/notification-service';
import { UserService } from '../user-service';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { Role } from '../../roles-component/Role';
import { AuthService } from '../../auth/services/auth-service';
import { User } from '../User';
import { RoleService } from '../../roles-component/role-service';

@Component({
  selector: 'app-user-form',
  standalone: true,
  imports: [RouterModule, CommonModule, ReactiveFormsModule, FormsModule],
  templateUrl: './user-form.html',
  styleUrl: './user-form.css'
})
export class UserForm implements OnInit {
  private activatedRoute = inject(ActivatedRoute);
  private notif = inject(NotificationService);
  private router = inject(Router);
  private service = inject(UserService);
  private roleService = inject(RoleService);
  private authService = inject(AuthService);
  isLoading = signal<boolean>(false);

  // --- Signals de Estado ---
  user = signal<User>({
    username: '',
    firstName: '',
    lastName: '',
    email: '',
    companyId: '',
    companyName: '',
    status: 'PENDING',
    emailVerified: false,
    roles: [],
    mustChangePassword: true
  } as User);

  roles = signal<Role[]>([]);
  selectedRolesIds = signal<number[]>([]);
  searchTerm = signal<string>('');

  // --- Signal Computado: Filtrado en tiempo real ---
  filteredRoles = computed(() => {
    const term = this.searchTerm().toLowerCase().trim();
    if (!term) return this.roles();

    return this.roles().filter(r =>
      r.name.toLowerCase().includes(term) ||
      r.description?.toLowerCase().includes(term)
    );
  });

  ngOnInit(): void {
    this.loadAllRoles();
    this.loadUserData();
  }

  private loadAllRoles(): void {
    this.roleService.getAllRoles().subscribe({
      next: (data) => this.roles.set(data),
      error: () => this.notif.error('Error al cargar catálogo de roles')
    });
  }

  private loadUserData(): void {
    const id = this.activatedRoute.snapshot.params['id'];
    if (id) {
      this.service.getById(id).subscribe({
        next: (userData) => {
          this.user.set(userData);
          // Extraemos los IDs de los roles que ya tiene el usuario
          if (userData.roles) {
            this.selectedRolesIds.set(userData.roles.map(r => r.id));
          }
        },
        error: () => this.notif.error('Error al recuperar el usuario')
      });
    }
  }



  // --- Manejo de UI ---
  onRoleChange(roleId: number, event: Event): void {
    const isChecked = (event.target as HTMLInputElement).checked;
    this.selectedRolesIds.update(currentIds =>
      isChecked
        ? [...currentIds, roleId]
        : currentIds.filter(id => id !== roleId)
    );
  }

  onSearchRole(term: string): void {
    this.searchTerm.set(term);
  }

  // --- Lógica de Envío ---
  private getPayload() {
    // Creamos el DTO mezclando los datos del usuario con los IDs seleccionados
    return {
      ...this.user(),
      roleIds: this.selectedRolesIds()
    };
  }

  public create(): void {

    if (this.isLoading()) return;
    this.isLoading.set(true);

    this.service.create(this.getPayload()).subscribe({
      next: (res) => {
        this.notif.success(`Usuario ${res.username} creado correctamente`);
        this.router.navigate(['/users/page/0']);
      },
      error: (err) => {
        this.notif.error(err.error?.message || 'Error en la creación');
        this.isLoading.set(false); // Apagar si hay error
      },
      complete: () => this.isLoading.set(false)
    });
  }

  public resetPassword(email: string): void {
    if (this.isLoading()) return;
    this.isLoading.set(true);

    this.authService.resetPassword(email).subscribe({
      next: (response) => {
        console.log(response);
        this.notif.success(`Contraseña restaurada correctamente`);
      },
      error: (err) => {
        this.notif.error(err.error?.message || 'Error en la creación');
        this.isLoading.set(false); 
      },
      complete: () => this.isLoading.set(false)
    })
  }

  public update(): void {
    const payload = this.getPayload();
    if (payload.id) {
      this.service.update(payload.id, payload).subscribe({
        next: () => {
          this.notif.success('Usuario actualizado correctamente');
          this.router.navigate(['/users/page/0']);
        },
        error: (err) => this.notif.error(err.error?.message || 'Error al actualizar')
      });
    }
  }
}