import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { map, switchMap } from 'rxjs';

import { SubscriptionService } from './subscription-service';
import { Subscription } from './Subscription';
import { NotificationService } from '../../core/services/notification-service';
import { ModalService } from '../../core/services/modal-service';

import { Paginator } from "../../shared/components/paginator/paginator";
import { SearchbarComponent } from '../../shared/components/searchbar-component/searchbar-component';
import { SubscriptionStatus } from './SubscriptionStatus';
import { SubscriptionStatusPipe } from '../../shared/pipes/subscription-status-pipe';
import { SubscriptionDetailComponent } from "./subscription-detail-component/subscription-detail-component";

@Component({
  selector: 'app-subscriptions-component',
  standalone: true,
  imports: [CommonModule,
    RouterModule,
    Paginator,
    SearchbarComponent,
    SubscriptionStatusPipe, SubscriptionDetailComponent],
  templateUrl: './subscriptions-component.html',
  styleUrl: './subscriptions-component.css'
})
export class SubscriptionsComponent implements OnInit {

  private service = inject(SubscriptionService);
  private notif = inject(NotificationService);
  private activatedRoute = inject(ActivatedRoute);
  private router = inject(Router);
  private modal = inject(ModalService);

  subscriptionStatus = SubscriptionStatus;

  subscriptions = signal<Subscription[]>([]);
  selectedSubscription = signal<Subscription | null>(null);
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
        if (term) {
          return this.service.find(term, page);
        }
        return this.service.get(page);
      })
    ).subscribe({
      next: (response) => {
        this.subscriptions.set(response.content);
        this.paginador.set({ ...response });
      },
      error: (err) => {
        console.error('Error cargando suscripciones', err);
        this.notif.error('No se pudieron cargar las suscripciones');
      }
    });
  }

  onPaginaSeleccionada(page: number): void {
    this.router.navigate(['/subscriptions/page', page]);
  }

  onBuscar(termino: string): void {
    this.terminoBusqueda.set(termino);
    this.router.navigate(['/subscriptions/page', 0]).then(() => {
      if (this.activatedRoute.snapshot.params['page'] == 0) {
        this.load();
      }
    });
  }

  onLimpiarBusqueda(): void {
    this.terminoBusqueda.set('');
    this.router.navigate(['/subscriptions/page', 0]);
    this.load();
  }

  abrirModal(subscription: Subscription) {
    this.selectedSubscription.set(subscription);
    this.modal.abrirModal();
  }

  getStatusClass(status: SubscriptionStatus | string): string {
    const classes: Record<string, string> = {
      [SubscriptionStatus.ACTIVE]: 'badge-active',
      [SubscriptionStatus.CANCELLED]: 'badge-suspended', // Rojo (Cancelado)
      [SubscriptionStatus.EXPIRED]: 'badge-inactive',    // Gris (Expirado)
      [SubscriptionStatus.PENDING]: 'badge-deprecated'   // Amarillo (Pendiente)
    };
    return classes[status] || 'badge-secondary';
  }

}
