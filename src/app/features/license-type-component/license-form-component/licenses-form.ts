import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { LicenseTypeService } from '../license-type-service';
import { NotificationService } from '../../../core/services/notification-service';
import { LicenseType } from '../license-type';
import { ModuleApp } from '../../module-component/moduleapp';
import { CommonModule } from '@angular/common';
import { ModuleStatus } from '../../module-component/ModuleStatus';
import { Subscription } from 'rxjs';
import { ModuleService } from '../../module-component/module-service';

@Component({
  selector: 'app-license-form-component',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './licenses-form.html',
  styleUrl: './licenses-form.css'
})
export class LicenseFormComponent implements OnInit, OnDestroy {
  public license: LicenseType = {} as LicenseType;
  public selected: LicenseType = {} as LicenseType;
  public errores!: string[];
  selectedModuleIds: number[] = [];
  modules: ModuleApp[] = [];
  filteredModules: ModuleApp[] = [];
  searchTerm: string = '';
  ModuleStatus = ModuleStatus;
  private routeSubscription!: Subscription;

  constructor(
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private serv: LicenseTypeService,
    private moduleService: ModuleService,
    private cdr: ChangeDetectorRef,
    private notif: NotificationService
  ) { }

  ngOnInit(): void {
    this.load();
  }

  ngOnDestroy(): void {
    if (this.routeSubscription) {
      this.routeSubscription.unsubscribe();
    }
  }

  public cancel(): void {
    this.license = {} as LicenseType;
    this.selectedModuleIds = [];
    this.router.navigate(['/licenses/page/0']);
  }

  public load(): void {
    this.routeSubscription = this.activatedRoute.params.subscribe(params => {
      const id = params['id'];      
      if (id) {
        this.serv.findById(id).subscribe({
          next: (license) => {            
            this.license = license;
            this.license.modules = this.license.modules || [];            
            this.loadAllModules();
          },
          error: (error) => {            
            this.notif.error('No se pudo cargar la licencia.');
          }
        });
      } else {
        this.license.modules = [];
        this.loadAllModules();
      }
    });
  }

  loadAllModules(): void {
    this.moduleService.getAllModules().subscribe({
      next: (modules) => {
        this.modules = modules;
        this.filteredModules = modules;
        this.selectedModuleIds = this.license.modules?.map(m => m.id) || [];        
        this.cdr.detectChanges();
      },
      error: (error) => {
        console.error('Error loading modules:', error);
        this.notif.error('No se pudo cargar los módulos.');
      }
    });
  }

  onModuleChange(moduleId: number, event: Event): void {
    const target = event.target as HTMLInputElement;
    if (target.checked) {
      this.selectedModuleIds.push(moduleId);
    } else {
      this.selectedModuleIds = this.selectedModuleIds.filter(id => id !== moduleId);
    }
  }

  onSearchModules(term: string): void {
    this.searchTerm = term.toLowerCase();
    if (!this.searchTerm) {
      this.filteredModules = this.modules;
    } else {
      this.filteredModules = this.modules.filter(module =>
        module.name.toLowerCase().includes(this.searchTerm) ||
        (module.description && module.description.toLowerCase().includes(this.searchTerm))
      );
    }
  }

  public create(): void {
    this.license.modules = this.modules.filter(m => this.selectedModuleIds.includes(m.id));
    this.serv.create(this.license).subscribe({
      next: (license) => {
        console.log(license);
        this.notif.success(`La licencia "${license.name}" se ha creado correctamente.`);
        this.router.navigate(['/licenses/page/0']);
      },
      error: (err) => {
        this.notif.error(err.error?.message || 'No se pudo crear la licencia.');
      }
    });
  }

  public update(): void {
    this.license.modules = this.modules.filter(m => this.selectedModuleIds.includes(m.id));
    console.log(this.license);
    this.serv.update(this.license).subscribe({
      next: (license) => {
        this.notif.success(`La licencia "${license.name}" se actualizó correctamente.`);
        this.router.navigate(['/licenses/page/0']);
      },
      error: (err) => {
        this.notif.error(err.error?.message || 'No se pudo actualizar la licencia.');
      }
    });
  }
}