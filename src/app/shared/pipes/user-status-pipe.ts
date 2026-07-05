import { Pipe, PipeTransform } from '@angular/core';
import { UserStatus } from '../../features/user-component/UserStatus';


@Pipe({
  name: 'userStatusPipe'
})
export class UserStatusPipe implements PipeTransform {

  transform(value: UserStatus): string {
    switch (value) {
      case UserStatus.ACTIVE: return 'Activo';
      case UserStatus.INACTIVE: return 'Inactivo';
      case UserStatus.PENDING: return 'Pendiente';
      case UserStatus.SUSPENDEND: return 'Suspendido';
      default: return value;
    }
  }
}
