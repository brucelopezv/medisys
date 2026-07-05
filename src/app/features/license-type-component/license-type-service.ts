import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, map, Observable, throwError } from 'rxjs';
import { LicenseType } from './license-type';
import { LicenseTypeRequestDTO } from './LicenseTypeRequestDTO';


@Injectable({
  providedIn: 'root'
})
export class LicenseTypeService {

  private urlEndpoint: string = 'http://localhost:8085/api/licenses'

  constructor(private http: HttpClient, private router: Router) { }

  get(page: number): Observable<any> {
    return this.http.get(this.urlEndpoint + '/page/' + page).pipe(
      map((response: any) => {
        (response.content as LicenseType[]).map(licenseType => {
          licenseType.name = licenseType.name.toUpperCase();
          return licenseType;
        });
        return response;
      }
      )
    );
  }

  getAll(): Observable<any> {
    return this.http.get(this.urlEndpoint + '/all').pipe(
      map((response: any) => {
        return response as LicenseType[];
      }
      )
    );
  }

  getAllOptions(): Observable<any> {
    return this.http.get(this.urlEndpoint + '/options').pipe(
      map((response: any) => {
        return response as LicenseType[];
      }
      )
    );
  }

  create(license: LicenseType): Observable<LicenseType> {
    return this.http.post<LicenseType>(this.urlEndpoint, this.toRequestDTO(license))
      .pipe(
        map((response: any) => ({          
          name: response.License.name,
          description: response.License.description,
          maxUsers: response.License.maxUsers,
          maxDoctors: response.License.maxDoctors,
          maxPatients: response.License.maxPatients,
          isCustom: response.License.isCustom,
          visibleToPublic: response.License.visibleToPublic,
          status: response.License.status,
          notes: response.License.notes,
          modules: response.License.modules || []
        } as LicenseType)),
        catchError(e => {
          console.error('Error al crear el tipo de licencia:', e);
          if (e.status === 400) {
            return throwError(() => new Error(`Error de validación: ${e.error.message || 'Datos inválidos'}`));
          }
          return throwError(() => new Error('Error al crear el tipo de licencia'));
        })
      );
  }

  update(license: LicenseType): Observable<LicenseType> {
    return this.http.put<LicenseType>(`${this.urlEndpoint}/${license.id}`, this.toRequestDTO(license))
      .pipe(
        map((response: any) => ({
          id: response.id,
          name: response.name,
          description: response.description,
          maxUsers: response.maxUsers,
          maxDoctors: response.maxDoctors,
          maxPatients: response.maxPatients,
          isCustom: response.isCustom,
          visibleToPublic: response.visibleToPublic,
          status: response.status,
          notes: response.notes,
          createdAt: response.createdAt,
          updatedAt: response.updatedAt,
          modules: response.modules || []
        } as LicenseType)),
        catchError(e => {
          console.error('Error al actualizar el tipo de licencia:', e);
          if (e.status === 400) {
            return throwError(() => new Error(`Error de validación: ${e.error.message || 'Datos inválidos'}`));
          }
          return throwError(() => new Error('Error al actualizar el tipo de licencia'));
        })
      );
  }

  delete(id: number): Observable<LicenseType> {
    return this.http.delete<LicenseType>(`${this.urlEndpoint}/${id}`).pipe(
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
          (response.content as LicenseType[]).map(module => {
            module.name = module.name.toUpperCase();
            return module;
          });
        }
        return response;
      }),
      catchError(e => {
        if (e.status != 401 && e.error.mensaje) {
          this.router.navigate(['/licenses']);
        }
        return throwError(() => e);
      })
    );
  }

  findById(id: number): Observable<any> {
    return this.http.get<LicenseType>(`${this.urlEndpoint}/${id}`).pipe(
      catchError(e => {
        if (e.status != 401 && e.error.mensaje) {
          this.router.navigate(['/licenses']);
        }
        return throwError(() => e);
      })
    );
  }

  private toRequestDTO(license: LicenseType): LicenseTypeRequestDTO {
    return {
      name: license.name,
      description: license.description,
      maxUsers: license.maxUsers,
      maxDoctors: license.maxDoctors,
      maxPatients: license.maxPatients,
      isCustom: license.isCustom,
      visibleToPublic: license.visibleToPublic,
      status: license.status,
      notes: license.notes,
      moduleIds: license.modules ? license.modules.map(module => module.id) : []
    };
  }

}
