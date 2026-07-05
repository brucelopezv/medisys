import { Pipe, PipeTransform } from '@angular/core';
import { LicenseTypeStatus } from '../../features/license-type-component/LicenseTypeStatus';


@Pipe({
  name: 'statusTranslate',
  standalone: true 
})
export class StatusTranslatePipe implements PipeTransform {

  transform(value: LicenseTypeStatus): string {
    switch (value) {
      case LicenseTypeStatus.ACTIVE: return 'Activo';
      case LicenseTypeStatus.INACTIVE: return 'Inactivo';
      case LicenseTypeStatus.DEPRECATED: return 'Obsoleto';
      default: return value;
    }
  }
}