import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ActivatedRoute, ParamMap, Router, RouterLink } from '@angular/router';
import { Paginator } from '../../shared/components/paginator/paginator';
import { SearchbarComponent } from '../../shared/components/searchbar-component/searchbar-component';
import { Company } from './company';
import { NotificationService } from '../../core/services/notification-service';
import { map, switchMap } from 'rxjs';
import { CompanyStatusPipe } from '../../shared/pipes/company-status-pipe';
import { CompanyStatus } from './CompanyStatus';
import { CompanyService } from './company-service';

@Component({
  selector: 'app-company-component',
  standalone: true,
  imports: [CommonModule, RouterLink, Paginator, SearchbarComponent, CompanyStatusPipe],
  templateUrl: './company-component.html',
  styleUrl: './company-component.css'
})
export class CompanyComponent implements OnInit {

  companies: Company[] | null = [];
  companiesSearched: Company[] | null = [];
  paginador: any;
  selected: Company | undefined;
  terminoBusqueda: string = '';
  CompanyStatus = CompanyStatus;

  constructor(
    private router: Router,
    private service: CompanyService,
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
    if (this.terminoBusqueda) {
      this.companiesSearched = response.content;
    } else {
      this.companies = response.content;
      this.companiesSearched = response.content;
    }
    this.paginador = { ...response };
    this.cdr.markForCheck();
  }


  onPaginaSeleccionada(page: number): void {
    this.router.navigate(['/companies/page', page]);
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
