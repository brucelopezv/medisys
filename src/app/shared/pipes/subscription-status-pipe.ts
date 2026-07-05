import { Pipe, PipeTransform } from '@angular/core';
import { SubscriptionStatus } from '../../features/subscriptions-component/SubscriptionStatus';

@Pipe({
  name: 'subscriptionStatus'
})
export class SubscriptionStatusPipe implements PipeTransform {

  transform(value: SubscriptionStatus | string | undefined | null): string {
    if (!value) {
      return 'Desconocido';
    }
    switch (value) {
      case SubscriptionStatus.ACTIVE: return 'Activa';
      case SubscriptionStatus.CANCELLED: return 'Cancelada';
      case SubscriptionStatus.PENDING: return 'Pendiente';
      case SubscriptionStatus.EXPIRED: return 'Expirada';
      default: return value.toString();
    }
  }
}
