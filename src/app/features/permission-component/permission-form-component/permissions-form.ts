import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { NotificationService } from '../../../core/services/notification-service';
import { PermissionService } from '../../../core/services/permission-service';
import { Permission } from '../Permission';
import { ModuleSelect } from '../../module-component/ModuleSelect';
import { ModuleApp } from '../../module-component/moduleapp';
import { ModuleService } from '../../module-component/module-service';


@Component({
  selector: 'app-permission-form-component',
  standalone: true,
  imports: [FormsModule, RouterLink],
  templateUrl: './permissions-form.html',
  styleUrl: './permissions-form.css'
})
export class PermissionFormComponent implements OnInit {

  public permission: Permission = {} as Permission;
  public selected!: Permission;
  public errores!: string[];
  public modules: ModuleSelect[] = [];

  constructor(
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private serv: PermissionService,
    private cdr: ChangeDetectorRef,
    private notif: NotificationService,
    private servModule: ModuleService
  ) { }

  ngOnInit(): void {
    this.load();
  }


  public load(): void {
    this.activatedRoute.params.subscribe(params => {
      let id = params['id'];
      if (id) {
        this.serv.findById(id).subscribe(
          ((permission) => {
            this.permission = permission;
            this.cdr.detectChanges();
          })
        )
      }
    });
    this.loadModules();
  }

  public loadModules(): void {
    this.servModule.getAllOptions().subscribe({
      next: (modules) => {
        console.log(modules);
        this.modules = modules;
        this.cdr.markForCheck();
      },
      error: (err) => {
        this.notif.error(err.error?.message || 'No se pudo cargar el modulo');
        this.modules = []; // ← En caso de error, mantener como array vacío
      }
    });
  }


  public create(): void {
    this.serv.create(this.permission).subscribe({
      next: permission => {
        this.notif.success(`El permiso con acción "${permission.action}" se ha creado correctamente.`);
        this.router.navigate(['/permissions/page/0']);
      }, error: err => {
        this.notif.error(err.error?.error || 'No se pudo crear el permiso.');
      }
    });
  }

  public update(): void {
    console.log(this.permission);
    this.serv.update(this.permission).subscribe({
      next: permission => {
        this.notif.success(`El permiso con acción "${permission.action}" se actualizó correctamente.`);
        this.router.navigate(['/permissions/page/0']);
      },
      error: err => {
        this.notif.error(err.error?.message || 'No se pudo actualizar el permiso.');
      }
    });
  }

}
