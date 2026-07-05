import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { Notyf } from 'notyf';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {

  private notyf: Notyf | undefined;

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {
    if (isPlatformBrowser(this.platformId)) {
      this.notyf = new Notyf({
        duration: 3000,
        dismissible: true,
        position: { x: 'right', y: 'top' } // 👈 esquina superior derecha
      });
    }
  }

  success(message: string) {
    this.notyf?.success(message);
  }

  error(message: string) {
    this.notyf?.error(message);
  }

  custom(title: string, body: string, type: string) {
    this.notyf?.open({
      type: type,
      message: `<strong>${title}</strong><br>${body}`,
      dismissible: true
    });
  }

}
