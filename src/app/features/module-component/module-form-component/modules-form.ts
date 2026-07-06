import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ModuleApp } from '../moduleapp';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { NotificationService } from '../../../core/services/notification-service';
import { ModuleService } from '../module-service';


@Component({
  selector: 'app-module-form-component',
  standalone: true,
  imports: [FormsModule, RouterLink],
  templateUrl: './modules-form.html',
  styleUrl: './modules-form.css'
})
export class ModuleFormComponent implements OnInit {

  public module: ModuleApp = {} as ModuleApp;  
  public errores!: string[];

  constructor(
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private serv: ModuleService,
    private cdr: ChangeDetectorRef,
    private notif: NotificationService
  ) { }


  ngOnInit(): void {
    this.load();
  }

  public load(): void {
    this.activatedRoute.params.subscribe(params => {
      let id = params['id'];
      if (id) {
        this.serv.findById(id).subscribe(
          ((module) => {
            this.module = module;
            this.cdr.detectChanges();
          })
        )
      }
    });
  }
  

  public create(): void {
    this.serv.create(this.module).subscribe({
      next: module => {        
        this.notif.success(`El módulo "${module.name}" se ha creado correctamente.`);
        this.router.navigate(['/modules/page/0']);
      },error: err => {
        this.notif.error(err.error?.message || 'No se pudo crear el módulo.');
      }
    });
  }

  public update(): void {
    this.serv.update(this.module).subscribe({
      next: module => {        
        this.notif.success(`El módulo "${module.name}" se actualizó correctamente.`);
        this.router.navigate(['/modules/page/0']);
      },
      error: err => {
        this.notif.error(err.error?.message || 'No se pudo actualizar el módulo.');
      }
    });
  }


}
