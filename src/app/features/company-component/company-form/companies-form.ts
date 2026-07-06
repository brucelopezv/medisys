import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { Company } from '../company';
import { NotificationService } from '../../../core/services/notification-service';
import { FormsModule } from '@angular/forms';
import { CompanyService } from '../company-service';

@Component({
  selector: 'app-company-form',
  standalone: true,
  imports: [FormsModule, RouterLink],
  templateUrl: './companies-form.html',
  styleUrl: './companies-form.css'
})
export class CompanyForm implements OnInit {

  public company: Company = {} as Company;
  public selected!: Company;
  public errores!: string[];

  constructor(
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private serv: CompanyService,
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
          ((company) => {
            console.log(company);
            this.company = company;
            this.cdr.detectChanges();
          })
        )
      }
    });
  }

  public create(): void {
    this.serv.create(this.company).subscribe({
      next: company => {
        this.notif.success(`La empresa "${company.name}" se ha creado correctamente.`);
        this.router.navigate(['/companies/page/0']);
      }, error: err => {
        this.notif.error(err.error?.error || 'No se pudo crear la empresa.');
      }
    });
  }

  public update(): void {
    console.log(this.company);
    this.serv.update(this.company).subscribe({
      next: company => {
        this.notif.success(`La empresa "${company.name}" se actualizó correctamente.`);
        this.router.navigate(['/companies/page/0']);
      },
      error: err => {
        this.notif.error(err.error?.message || 'No se pudo actualizar el módulo.');
      }
    });
  }


}
