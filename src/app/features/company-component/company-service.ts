import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, map, throwError } from 'rxjs';
import { Observable } from 'rxjs/internal/Observable';
import { CompanyResponseDTO } from '../../features/company-component/company-response-dto';
import { Company } from '../../features/company-component/company';

@Injectable({
  providedIn: 'root'
})
export class CompanyService {

  private urlEndpoint = 'http://localhost:8085/api/companies';

  constructor(private http: HttpClient, private router: Router) { }


  get(page: number): Observable<any> {
    return this.http.get(this.urlEndpoint + '/page/' + page).pipe(
      map((response: any) => {
        return response as CompanyResponseDTO;
      }),
      catchError(e => {
        if (e.status == 400) {
          return throwError(() => e);
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
          this.router.navigate(['/companies/page/0']);
        }
        return throwError(() => e);
      })
    );
  }


  findById(id: number): Observable<any> {
    return this.http.get<Company>(`${this.urlEndpoint}/${id}`).pipe(
      catchError(e => {
        if (e.status != 401 && e.error.mensaje) {
          this.router.navigate(['/companies']);
        }
        return throwError(() => e);
      })
    );
  }


  create(company: Company): Observable<Company> {
    return this.http.post(this.urlEndpoint + '/register', company)
      .pipe(
        map((response: any) => {
          return response.Company as Company;
        }),
        catchError(e => {
          if (e.status == 400) {
            return throwError(() => e);
          }
          return throwError(() => e);
        })
      );
  }

  update(company: Company): Observable<Company> {
    return this.http.put<Company>(`${this.urlEndpoint}/${company.id}`, company)
      .pipe(
        map((response: any) => {          
          return response.Company as Company;
        }),
        catchError(e => {
          if (e.status == 400) {
            return throwError(() => e);
          }
          return throwError(() => e);
        })
      );
  }




}
