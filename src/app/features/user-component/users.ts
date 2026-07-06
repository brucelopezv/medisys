import { Component, inject, OnInit, signal } from '@angular/core';
import { UserService } from './user-service';
import { User } from './User';
import { NotificationService } from '../../core/services/notification-service';
import { Paginator } from "../../shared/components/paginator/paginator";
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { SearchbarComponent } from '../../shared/components/searchbar-component/searchbar-component';
import { map, switchMap } from 'rxjs';
import { ModalService } from '../../core/services/modal-service';
import { UserStatus } from './UserStatus';
import { UserStatusPipe } from '../../shared/pipes/user-status-pipe';
import { CommonModule } from '@angular/common';
import { UserDetailComponent } from "./user-detail-component/users-details";

@Component({
  selector: 'app-user-component',
  standalone: true,
  imports: [Paginator, RouterModule, SearchbarComponent, UserStatusPipe, CommonModule, UserDetailComponent],
  templateUrl: './users.html',
  styleUrl: './users.css'
})
export class UserComponent implements OnInit {

  private service = inject(UserService);
  private notif = inject(NotificationService);
  private activatedRoute = inject(ActivatedRoute);
  private router = inject(Router);
  private modal = inject(ModalService);

  userStatus = UserStatus;
  users = signal<User[]>([]);
  selectedUser = signal<User | null>(null);
  paginador = signal<any>(null);
  terminoBusqueda = signal<string>('');

  ngOnInit(): void {
    this.load();
  }

  load(): void {
    this.activatedRoute.paramMap.pipe(
      map(params => {
        const page = Number(params.get('page'));
        return isNaN(page) || page < 0 ? 0 : page;
      }),
      switchMap(page => {
        const term = this.terminoBusqueda();
        return term ? this.service.find(term, page) : this.service.get(page);
      })
    ).subscribe(response => {
      this.users.set(response.content);
      console.log(response);

      this.paginador.set({ ...response });
    });
  }

  onPaginaSeleccionada(page: number): void {
    this.router.navigate(['/users/page', page]);
  }

  onBuscar(termino: string): void {
    this.terminoBusqueda.set(termino);
    this.router.navigate(['/users/page', 0]).then(() => {
      if (this.activatedRoute.snapshot.params['page'] == 0) {
        this.load();
      }
    });
  }

  onLimpiarBusqueda(): void {
    this.terminoBusqueda.set('');
    this.router.navigate(['/users/page', 0]);
    this.load();
  }

  abrirModal(user: User) {   
    this.selectedUser.set(user);
    this.modal.abrirModal();
  }

  getStatusClass(status: UserStatus): string {
    const classes = {
      [UserStatus.ACTIVE]: 'badge-active',
      [UserStatus.INACTIVE]: 'badge-inactive',
      [UserStatus.SUSPENDEND]: 'badge-suspended',
      [UserStatus.PENDING]: 'badge-deprecated'
    };
    return classes[status] || '';
  }

}
