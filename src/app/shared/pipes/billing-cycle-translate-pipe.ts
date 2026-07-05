import { Pipe, PipeTransform } from '@angular/core';
import { BillingCycle } from '../../features/pricing-options-component/BillingCycle';

@Pipe({
  name: 'billingCycleTranslatePipe',
  standalone: true
})
export class BillingCycleTranslatePipe implements PipeTransform {

  transform(value: BillingCycle): string {
    switch (value) {
      case BillingCycle.MONTHLY: return 'Mensual';
      case BillingCycle.ANNUAL_MONTHLY: return 'Anual pago mensual';
      case BillingCycle.ANNUAL_UPFRONT: return 'Anual pago único';
      default: return value;
    }
  }
  
}
