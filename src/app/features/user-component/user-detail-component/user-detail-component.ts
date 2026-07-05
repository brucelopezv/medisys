import { Component, inject, Input} from '@angular/core';
import { UserStatusPipe } from '../../../shared/pipes/user-status-pipe';
import { CommonModule } from '@angular/common';
import { User } from '../User';
import { ModalService } from '../../../core/services/modal-service';
import { UserStatus } from '../UserStatus';

@Component({
  selector: 'app-user-detail-component',
  standalone: true,
  imports: [CommonModule, UserStatusPipe],
  templateUrl: './user-detail-component.html',
  styleUrl: './user-detail-component.css'
})
export class UserDetailComponent {
  @Input() user!: User;

  public modal = inject(ModalService);

  cerrarModal() {
    this.modal.cerrarModal();
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
