import { CommonModule } from '@angular/common';
import { Component, inject, Input } from '@angular/core';
import { SubscriptionStatusPipe } from '../../../shared/pipes/subscription-status-pipe';
import { Subscription } from '../Subscription';
import { ModalService } from '../../../core/services/modal-service';
import { SubscriptionStatus } from '../SubscriptionStatus';

@Component({
  selector: 'app-subscription-detail-component',
  standalone: true,
  imports: [CommonModule, SubscriptionStatusPipe],
  templateUrl: './subscriptions-details.html',
  styleUrl: './subscriptions-details.css'
})
export class SubscriptionDetailComponent {

  @Input() subscription!: Subscription;
  public modalService = inject(ModalService);

  // Calcula la diferencia exacta en días
  getDaysRemaining(): number {
    if (!this.subscription?.endDate) return 0;

    const end = new Date(this.subscription.endDate);
    const today = new Date();

    // Limpiamos las horas para que la diferencia sea de días exactos
    today.setHours(0, 0, 0, 0);
    end.setHours(0, 0, 0, 0);

    const diffTime = end.getTime() - today.getTime();
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  }

  // Convierte los días en un texto amigable para el administrador
  getRemainingText(): string {
    if (this.subscription.status === SubscriptionStatus.CANCELLED) {
      return 'Suscripción Cancelada';
    }

    const days = this.getDaysRemaining();

    if (days < 0) return `Expiró hace ${Math.abs(days)} días`;
    if (days === 0) return 'Expira hoy (¡Atención!)';

    // Si faltan más de 30 días, lo mostramos en meses para que sea más fácil de leer
    if (days > 30) {
      const months = Math.floor(days / 30);
      const extraDays = days % 30;
      return `Faltan ${months} mes(es) ${extraDays > 0 ? 'y ' + extraDays + ' días' : ''}`;
    }

    return `Faltan ${days} días`;
  }

  // Devuelve un color (clase de Bootstrap/Tailwind) dependiendo de la urgencia
  getUrgencyClass(): string {
    if (this.subscription?.status === SubscriptionStatus.CANCELLED) return 'text-muted';

    const days = this.getDaysRemaining();
    if (days < 0) return 'text-danger fw-bold'; // Ya expiró
    if (days <= 15) return 'text-warning fw-bold'; // Urgente (menos de 15 días)
    return 'text-success fw-bold'; // Todo bien
  }

}
