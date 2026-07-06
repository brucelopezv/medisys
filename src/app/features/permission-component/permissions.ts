import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Permission } from './Permission';
import { ActivatedRoute, ParamMap, Router, RouterLink } from '@angular/router';
import { NotificationService } from '../../core/services/notification-service';
import { PermissionService } from '../../core/services/permission-service';
import { map, switchMap } from 'rxjs';
import { SearchbarComponent } from '../../shared/components/searchbar-component/searchbar-component';
import { Paginator } from '../../shared/components/paginator/paginator';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-permission-component',
  standalone: true,
  imports: [CommonModule, RouterLink, Paginator, SearchbarComponent],
  templateUrl: './permissions.html',
  styleUrl: './permissions.css'
})
export class PermissionComponent implements OnInit {

  permissions: Permission[] | null = [];
  paginador: any;
  selected: Permission | undefined;
  terminoBusqueda: string = '';
  permissionsSearched: Permission[] | null = [];

  constructor(
    private router: Router,
    private service: PermissionService,
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
      this.permissionsSearched = response.content;
    } else {
      this.permissions = response.content;
      this.permissionsSearched = response.content;
    }
    this.paginador = { ...response };
    this.cdr.markForCheck();
  }


  onPaginaSeleccionada(page: number): void {
    this.router.navigate(['/permissions/page', page]);
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
