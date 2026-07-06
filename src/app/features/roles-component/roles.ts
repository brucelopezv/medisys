import { ChangeDetectorRef, Component } from '@angular/core';
import { Role } from './Role';
import { SearchbarComponent } from '../../shared/components/searchbar-component/searchbar-component';
import { Paginator } from '../../shared/components/paginator/paginator';
import { ActivatedRoute, ParamMap, Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { NotificationService } from '../../core/services/notification-service';
import { map, switchMap } from 'rxjs';
import { RoleService } from './role-service';

@Component({
  selector: 'app-roles-component',
  standalone: true,
  imports: [CommonModule, RouterLink, Paginator, SearchbarComponent],
  templateUrl: './roles.html',
  styleUrl: './roles.css'
})
export class RolesComponent {


  roles: Role[] | null = [];
  paginador: any;
  selected: Role | undefined;
  terminoBusqueda: string = '';
  roleSearched: Role[] | null = [];

  constructor(
    private router: Router,
    private service: RoleService,
    private activatedRoute: ActivatedRoute,
    private cdr: ChangeDetectorRef,
    private notif: NotificationService
  ) { }


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
      this.roleSearched = response.content;
    } else {
      this.roles = response.content;
      this.roleSearched = response.content;
    }
    this.paginador = { ...response };
    this.cdr.markForCheck();
  }


  onPaginaSeleccionada(page: number): void {
    this.router.navigate(['/roles/page', page]);
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
