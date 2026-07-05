import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { LicenseType } from './license-type';
import { LicenseTypeService } from './license-type-service';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ModalService } from '../../core/services/modal-service';
import { LicenseDetailComponent } from "./license-detail-component/license-detail-component";
import { SearchbarComponent } from '../../shared/components/searchbar-component/searchbar-component';
import { LicenseTypeStatus } from './LicenseTypeStatus';
import { NotificationService } from '../../core/services/notification-service';
import { StatusTranslatePipe } from '../../shared/pipes/status-translate-pipe';
import { Paginator } from '../../shared/components/paginator/paginator';

@Component({
  selector: 'app-license-type-component',
  standalone: true,
  imports: [CommonModule, LicenseDetailComponent, SearchbarComponent, RouterLink, StatusTranslatePipe, Paginator],
  templateUrl: './license-type-component.html',
  styleUrl: './license-type-component.css'
})
export class LicenseTypeComponent implements OnInit {

  licenses: LicenseType[] | null = [];
  paginador: any;
  selected: LicenseType | undefined;
  terminoBusqueda: string = '';
  licensesSearched: LicenseType[] | null = [];
  LicenseTypeStatus = LicenseTypeStatus;

  constructor(
    private router: Router,
    private service: LicenseTypeService,
    private activatedRoute: ActivatedRoute,
    private cdr: ChangeDetectorRef,
    private modalService: ModalService,
    private notif: NotificationService
  ) { }

  ngOnInit(): void {
    this.load();
  }

  load(): void {
    this.activatedRoute.paramMap.subscribe(params => {
      let page = Number(params.get('page'));
      if (isNaN(page) || page < 0) {
        page = 0;
      }

      if (this.terminoBusqueda) {
        page = 0;
        this.service.find(this.terminoBusqueda, page).subscribe(response => {
          this.licensesSearched = response.content;
          this.paginador = { ...response };
          this.cdr.detectChanges();
        });
      } else {
        this.service.get(page).subscribe(response => {
          this.licenses = response.content;
          this.licensesSearched = response.content;
          this.paginador = { ...response };
          this.cdr.detectChanges();
        });
      }
    });
  }

  abrirModal(licenseType: LicenseType) {
    this.selected = licenseType;
    this.modalService.abrirModal();
  }

  onPaginaSeleccionada(page: number): void {
    this.router.navigate(['/licenses/page', page]);
  }

  onBuscar(termino: string): void {
    this.terminoBusqueda = termino;
    this.load();
  }
  onLimpiarBusqueda(): void {
    this.terminoBusqueda = '';
    this.load();
  }

  public update(license: LicenseType): void {
    let enable = '';
    let flag = true;
    if (license.status === LicenseTypeStatus.ACTIVE) {
      license.status = LicenseTypeStatus.INACTIVE;
    } else {
      flag = false;
      license.status = LicenseTypeStatus.ACTIVE;
    }
    this.service.update(license).subscribe(
      updatedLicense => {
        this.router.navigate(['/licenses/page/0']);
        if (updatedLicense.status === LicenseTypeStatus.ACTIVE) {
          this.notif.success(`<strong>Éxito!</strong><br>La licencia ${updatedLicense.name} se habilitó correctamente`);
        } else {
          this.notif.success(`<strong>Éxito!</strong><br>La licencia ${updatedLicense.name} se deshabilitó correctamente`);
        }
      }
    );
  }

}