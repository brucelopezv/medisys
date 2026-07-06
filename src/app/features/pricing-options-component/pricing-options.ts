import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, ParamMap, Router, RouterLink } from '@angular/router';
import { ModalService } from '../../core/services/modal-service';
import { NotificationService } from '../../core/services/notification-service';
import { PricingOption } from './pricing-option';
import { BillingCycle } from './BillingCycle';
import { CommonModule } from '@angular/common';
import { Paginator } from '../../shared/components/paginator/paginator';
import { BillingCycleTranslatePipe } from '../../shared/pipes/billing-cycle-translate-pipe';
import { map, switchMap } from 'rxjs';
import { SearchbarComponent } from '../../shared/components/searchbar-component/searchbar-component';
import { PricingOptionService } from './pricing-option-service';


@Component({
  selector: 'app-pricing-options-component',
  standalone: true,
  imports: [CommonModule, RouterLink, BillingCycleTranslatePipe, Paginator, SearchbarComponent],
  templateUrl: './pricing-options.html',
  styleUrl: './pricing-options.css'
})
export class PricingOptionsComponent implements OnInit {

  pricings: PricingOption[] | null = [];
  paginador: any;
  selected: PricingOption | undefined;
  terminoBusqueda: string = '';
  pricingSearched: PricingOption[] | null = [];
  BillingCycle = BillingCycle;


  constructor(
    private router: Router,
    private service: PricingOptionService,
    private activatedRoute: ActivatedRoute,
    private cdr: ChangeDetectorRef,
    private notif: NotificationService) { }

  ngOnInit(): void {
    this.load();
  }

  load(): void {
    this.activatedRoute.paramMap.pipe(
      map(params => this.getValidPage(params)),
      switchMap(page => this.loadData(page))
    ).subscribe(this.handleResponse.bind(this));
  }

  private getValidPage(params: ParamMap): number {
    const page = Number(params.get('page'));
    return isNaN(page) || page < 0 ? 0 : page;
  }

  private loadData(page: number) {
    const actualPage = this.terminoBusqueda ? 0 : page;
    return this.terminoBusqueda ? this.service.find(this.terminoBusqueda, actualPage) : this.service.get(actualPage);
  }

  private handleResponse(response: any): void {
    console.log(response);
    if (this.terminoBusqueda) {
      this.pricingSearched = response.content;
    } else {
      this.pricings = response.content;
      this.pricingSearched = response.content;
    }
    this.paginador = { ...response };
    this.cdr.markForCheck();
  }


  onPaginaSeleccionada(page: number): void {
    this.router.navigate(['/pricing/page', page]);
  }

  onBuscar(termino: string): void {
    this.terminoBusqueda = termino;
    this.load();
  }
  onLimpiarBusqueda(): void {
    this.terminoBusqueda = '';
    this.load();
  }


}
