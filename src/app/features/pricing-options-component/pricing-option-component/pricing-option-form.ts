import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { NotificationService } from '../../../core/services/notification-service';
import { PricingOption } from '../pricing-option';
import { FormsModule } from '@angular/forms';
import { LicenseType } from '../../license-type-component/license-type';
import { LicenseTypeService } from '../../license-type-component/license-type-service';
import { BillingCycle } from '../BillingCycle';
import { LicenseTypeSelect } from '../../license-type-component/LicenseTypeSelect';
import { PricingOptionService } from '../pricing-option-service';

@Component({
  selector: 'app-pricing-option-component',
  standalone: true,
  imports: [FormsModule, RouterLink],
  templateUrl: './pricing-option-form.html',
  styleUrl: './pricing-option-form.css'
})
export class PricingOptionFormComponent implements OnInit {

  public pricingOption: PricingOption = {} as PricingOption;
  public licensesTypes: LicenseTypeSelect[] = [];

  constructor(
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private cdr: ChangeDetectorRef,
    private notif: NotificationService,
    private servicePricing: PricingOptionService,
    private serviceLicense: LicenseTypeService
  ) {

  }
  ngOnInit(): void {
    this.load();

  }

  public load(): void {
    this.activatedRoute.params.subscribe(params => {
      let id = params['id'];
      if (id) {
        this.servicePricing.findById(id).subscribe({
          next: pricingOption => {
            console.log(pricingOption);
            this.pricingOption = pricingOption;
            console.log(this.pricingOption);
            this.cdr.markForCheck();
          }, error: err => {
            this.notif.error(err.error?.message || 'No se pudo cargar el precio');
          }
        })
      }
    });
    this.loadLicenses();
  }

  public loadLicenses(): void {
    this.serviceLicense.getAllOptions().subscribe({
      next: (licenseType) => {
        console.log(licenseType);
        this.licensesTypes = licenseType;
        this.cdr.markForCheck();
      },
      error: (err) => {
        this.notif.error(err.error?.message || 'No se pudo cargar el tipo de licencia');
        this.licensesTypes = []; // ← En caso de error, mantener como array vacío
      }
    });
  }

  compareLicenseType(o1: LicenseTypeSelect, o2: LicenseTypeSelect): boolean {
    if (o1 === undefined && o2 === undefined) {
      return true;
    }
    return o1 === null || o2 === null || o1 === undefined || o2 === undefined ? false : o1.id === o2.id;
  }

  public create(): void {
    this.servicePricing.create(this.pricingOption).subscribe({
      next: (pricingOption) => {
        const billingCycleText = this.transformBillingCycle(pricingOption.billingCycle);
        this.notif.success(`La licencia "${billingCycleText}" se ha creado correctamente.`);
        this.router.navigate(['/pricing/page/0']);
      },
      error: (err) => {
        this.notif.error(err.error?.message || 'No se pudo crear la licencia.');
      }
    });
  }

  public update(): void {


    this.servicePricing.update(this.pricingOption).subscribe({
      next: (pricingOption) => {
        const billingCycleText = this.transformBillingCycle(pricingOption.billingCycle);
        this.notif.success(`La licencia "${billingCycleText}" se actualizó correctamente.`);
        this.router.navigate(['/pricing/page/0']);
      },
      error: (err) => {
        this.notif.error(err.error?.message || 'No se pudo actualizar la licencia.');
      }
    });
  }

  private transformBillingCycle(value: BillingCycle): string {
    switch (value) {
      case BillingCycle.MONTHLY:
        return 'Mensual';
      case BillingCycle.ANNUAL_MONTHLY:
        return 'Anual pago mensual';
      case BillingCycle.ANNUAL_UPFRONT:
        return 'Anual pago único';
      default:
        return value;
    }
  }


}
