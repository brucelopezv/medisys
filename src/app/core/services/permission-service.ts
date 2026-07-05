import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, map, Observable, throwError } from 'rxjs';
import { Permission } from '../../features/permission-component/Permission';

@Injectable({
  providedIn: 'root'
})
export class PermissionService {

  private urlEndpoint: string = 'http://localhost:8085/api/permissions'

  constructor(private http: HttpClient, private router: Router) { }

  get(page: number): Observable<any> {
    return this.http.get(this.urlEndpoint + '/page/' + page).pipe(
      map((response: any) => {
        return response as Permission;
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
          this.router.navigate(['/permissions/page/0']);
        }
        return throwError(() => e);
      })
    );
  }

  findById(id: number): Observable<any> {
    return this.http.get<Permission>(`${this.urlEndpoint}/${id}`).pipe(
      catchError(e => {
        if (e.status != 401 && e.error.mensaje) {
          this.router.navigate(['/permissions']);
        }
        return throwError(() => e);
      })
    );
  }

  create(permission: Permission): Observable<Permission> {
    return this.http.post(this.urlEndpoint, permission)
      .pipe(
        map((response: any) => {
          return response.Permission as Permission;
        }),
        catchError(e => {
          if (e.status == 400) {
            return throwError(() => e);
          }
          return throwError(() => e);
        })
      );
  }

  update(permission: Permission): Observable<Permission> {
    return this.http.put<Permission>(`${this.urlEndpoint}/${permission.id}`, permission)
      .pipe(
        map((response: any) => {
          return response.Permission as Permission;
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
