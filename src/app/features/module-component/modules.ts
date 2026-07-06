import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ModuleApp } from './moduleapp';
import { ActivatedRoute, ParamMap, Router, RouterLink, RouterModule } from '@angular/router';
import { Paginator } from "../../shared/components/paginator/paginator";
import { SearchbarComponent } from "../../shared/components/searchbar-component/searchbar-component";
import { ModuleStatus } from './ModuleStatus';
import { NotificationService } from '../../core/services/notification-service';
import { map, switchMap } from 'rxjs';
import { ModuleService } from './module-service';


@Component({
  selector: 'app-module-component',
  standalone: true,
  imports: [CommonModule, RouterLink, Paginator, RouterModule, SearchbarComponent],
  templateUrl: './modules.html',
  styleUrl: './modules.css',
  changeDetection: ChangeDetectionStrategy.OnPush // ← Agregar esto
})
export class ModuleComponent implements OnInit {

  modules: ModuleApp[] | null = [];
  modulesSearched: ModuleApp[] = [];
  paginador: any;
  selected: ModuleApp | undefined;
  terminoBusqueda: string = '';
  ModuleStatus = ModuleStatus;


  constructor(
    private router: Router,
    private service: ModuleService,
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
      this.modulesSearched = response.content;
    } else {
      this.modules = response.content;
      this.modulesSearched = response.content;
    }
    this.paginador = { ...response };
    this.cdr.markForCheck();
  }

  onPaginaSeleccionada(page: number): void {
    this.router.navigate(['/modules/page', page]);
  }

  onBuscar(termino: string): void {
    this.terminoBusqueda = termino;
    this.load();
  }
  onLimpiarBusqueda(): void {
    this.terminoBusqueda = '';
    this.load();
  }

  public update(module: ModuleApp): void {
    module.status = module.status === ModuleStatus.ACTIVO ? ModuleStatus.INACTIVO : ModuleStatus.ACTIVO;
    this.service.update(module).subscribe({
      next: (updatedModule) => {
        this.router.navigate(['/modules/page/0']);
        const action = updatedModule.status === ModuleStatus.ACTIVO ? 'habilitó' : 'deshabilitó';
        this.notif.success(`<strong>Éxito!</strong><br>El módulo ${updatedModule.name} se ${action} correctamente`);
        this.load(); // Recargar
      },
      error: (error) => {
        console.error('Error updating module:', error);
        this.notif.error('Ocurrió un error al actualizar el módulo');
        module.status = module.status === ModuleStatus.ACTIVO ? ModuleStatus.INACTIVO : ModuleStatus.ACTIVO;
      }
    });
  }

}
