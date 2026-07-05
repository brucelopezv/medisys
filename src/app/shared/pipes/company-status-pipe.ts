import { Pipe, PipeTransform } from '@angular/core';
import { CompanyStatus } from '../../features/company-component/CompanyStatus';

@Pipe({
  name: 'companyStatusPipe',
  standalone: true
})
export class CompanyStatusPipe implements PipeTransform {

  transform(value: CompanyStatus): string {
    switch (value) {
      case CompanyStatus.ACTIVE: return 'Activa';
      case CompanyStatus.INACTIVE: return 'Inactiva';
      case CompanyStatus.PENDING: return 'Pendiente';
      case CompanyStatus.SUSPENDED: return 'Suspendida';
      default: return value;
    }
  }

}
