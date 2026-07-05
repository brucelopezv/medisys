import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, map, Observable, throwError } from 'rxjs';
import { Role } from '../../features/roles-component/Role';

@Injectable({
  providedIn: 'root'
})
export class RoleService {

  private urlEndpoint: string = 'http://localhost:8085/api/roles'


  constructor(private http: HttpClient, private router: Router) { }

  get(page: number): Observable<any> {
    return this.http.get(this.urlEndpoint + '/page/' + page).pipe(
      map((response: any) => {
        return response as Role;
      }),
      catchError(e => {
        if (e.status == 400) {
          return throwError(() => e);
        }
        return throwError(() => e);
      })
    );
  }

  getAllRoles(): Observable<Role[]> {
    return this.http.get<Role[]>(`${this.urlEndpoint}/all`);
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
          this.router.navigate(['/roles/page/0']);
        }
        return throwError(() => e);
      })
    );
  }

  findById(id: number): Observable<any> {
    return this.http.get<Role>(`${this.urlEndpoint}/${id}`).pipe(
      catchError(e => {
        if (e.status != 401 && e.error.mensaje) {
          this.router.navigate(['/roles']);
        }
        return throwError(() => e);
      })
    );
  }

  create(role: Role): Observable<Role> {
    return this.http.post(this.urlEndpoint, role)
      .pipe(
        map((response: any) => {
          return response.Role as Role;
        }),
        catchError(e => {
          if (e.status == 400) {
            return throwError(() => e);
          }
          return throwError(() => e);
        })
      );
  }

  update(role: Role): Observable<Role> {
    return this.http.put<Role>(`${this.urlEndpoint}/${role.id}`, role)
      .pipe(
        map((response: any) => {
          return response.Role as Role;
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
