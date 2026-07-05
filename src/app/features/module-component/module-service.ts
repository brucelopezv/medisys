import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, map, Observable, throwError } from 'rxjs';
import { ModuleApp } from '../../features/module-component/moduleapp';
import { ModuleSelect } from '../../features/module-component/ModuleSelect';

@Injectable({
  providedIn: 'root'
})
export class ModuleService {

  private urlEndpoint: string = 'http://localhost:8085/api/modules'

  constructor(private http: HttpClient, private router: Router) { }

  get(page: number): Observable<any> {
    return this.http.get(this.urlEndpoint + '/page/' + page).pipe(
      map((response: any) => {
        (response.content as ModuleApp[]).map(licenseType => {
          licenseType.name = licenseType.name.toUpperCase();
          return licenseType;
        });
        return response;
      }
      )
    );
  }

  getAllModules(): Observable<ModuleApp[]> {
    return this.http.get<ModuleApp[]>(`${this.urlEndpoint}/all`);
  }

  getAllOptions(): Observable<any> {
    return this.http.get(this.urlEndpoint + '/options').pipe(
      map((response: any) => {
        return response as ModuleSelect[];
      }
      )
    );
  }



  create(module: ModuleApp): Observable<ModuleApp> {
    return this.http.post(this.urlEndpoint, module)
      .pipe(
        map((response: any) => {
          return response.Module as ModuleApp;
        }),
        catchError(e => {
          if (e.status == 400) {
            return throwError(() => e);
          }
          return throwError(() => e);
        })
      );
  }

  update(module: ModuleApp): Observable<ModuleApp> {
    return this.http.put<ModuleApp>(`${this.urlEndpoint}/${module.id}`, module)
      .pipe(
        map((response: any) => {
          console.log(response);
          return response.module as ModuleApp;
        }),
        catchError(e => {
          if (e.status == 400) {
            return throwError(() => e);
          }
          return throwError(() => e);
        })
      );
  }

  delete(id: number): Observable<ModuleApp> {
    return this.http.delete<ModuleApp>(`${this.urlEndpoint}/${id}`).pipe(
      catchError(e => {
        console.error(e.error.mensaje);
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
        if (response.content) {
          (response.content as ModuleApp[]).map(module => {
            module.name = module.name.toUpperCase();
            return module;
          });
        }
        return response;
      }),
      catchError(e => {
        if (e.status != 401 && e.error.mensaje) {
          this.router.navigate(['/modules']);
        }
        return throwError(() => e);
      })
    );
  }

  findById(id: number): Observable<any> {
    return this.http.get<ModuleApp>(`${this.urlEndpoint}/${id}`).pipe(
      catchError(e => {
        if (e.status != 401 && e.error.mensaje) {
          this.router.navigate(['/modules']);
        }
        return throwError(() => e);
      })
    );
  }

}
