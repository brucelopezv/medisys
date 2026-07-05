import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs/internal/Observable';
import { catchError, map } from 'rxjs/operators';
import { PricingOption } from '../../features/pricing-options-component/pricing-option';
import { throwError } from 'rxjs';
import { PricingOptionRequestDTO } from '../../features/pricing-options-component/PricingOptionRequestDTO';

@Injectable({
  providedIn: 'root'
})
export class PricingOptionService {

  private urlEndpoint: string = 'http://localhost:8085/api/pricing'

  constructor(private http: HttpClient, private router: Router) { }


  get(page: number): Observable<any> {
    return this.http.get(this.urlEndpoint + '/page/' + page)
      .pipe(
        map((response: any) => {
          return response;
        }),
        catchError(e => {
          if (e.status == 400) {
            return throwError(() => e);
          }
          return throwError(() => e);
        })
      )
  }

  findById(id: number): Observable<any> {
    return this.http.get<PricingOption>(`${this.urlEndpoint}/${id}`).pipe(
      catchError(e => {
        if (e.status != 401 && e.error.mensaje) {
          this.router.navigate(['/pricing']);
        }
        return throwError(() => e);
      })
    );
  }

  find(termino: string, page: number = 0): Observable<any> {
    let params = new HttpParams();
    params = params.append('page', page.toString());
    params = params.append('name', termino);

    return this.http.get(`${this.urlEndpoint}/find`, { params: params }).pipe(
      map((response: any) => {
        return response;
      }),
      catchError(e => {
        if (e.status != 401 && e.error.mensaje) {
          this.router.navigate(['/pricing/page/0']);
        }
        return throwError(() => e);
      })
    );
  }

  create(pricing: PricingOption): Observable<PricingOption> {
    const request = this.toRequestDTO(pricing);
    return this.http.post(this.urlEndpoint, request)
      .pipe(
        map((response: any) =>
        ({
          licenseTypeId: response.Pricing.licenseTypeId,
          licenseTypeName: response.Pricing.licenseTypeName,
          billingCycle: response.Pricing.billingCycle,
          contractDurationMonths: response.Pricing.contractDurationMonths,
          price: response.Pricing.price
        } as PricingOption)),
        catchError(e => {
          console.error('Error al crear el precio de la licencia:', e);
          if (e.status === 400) {
            return throwError(() => new Error(`Error de validación: ${e.error.message || 'Datos inválidos'}`));
          }
          return throwError(() => new Error('Error al crear el precio de la licencia'));
        })
      );
  }

  update(pricing: PricingOption): Observable<PricingOption> {
    return this.http.put<PricingOption>(`${this.urlEndpoint}/${pricing.id}`, pricing)
      .pipe(
        map((response: any) => {
          return response.Pricing as PricingOption;
        }),
        catchError(e => {
          if (e.status == 400) {
            return throwError(() => e);
          }
          return throwError(() => e);
        })
      );
  }


  private toRequestDTO(pricing: PricingOption): PricingOptionRequestDTO {
    return {
      licenseTypeId: pricing.licenseTypeId,
      billingCycle: pricing.billingCycle,
      contractDurationMonths: pricing.contractDurationMonths,
      price: pricing.price
    };
  }


}
