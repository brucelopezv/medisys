import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { Observable, tap } from 'rxjs';
import { PageResponse } from '../../../utils/PageResponse';
import { User } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private http = inject(HttpClient);
  private apiUrl = 'http://localhost:8085/api/users';

  user = signal<User | null>(null);

  get(page: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/page/${page}`);
  }

  find(name: string, page: number): Observable<any> {
    const params = new HttpParams()
      .set('name', name)
      .set('page', page.toString());
    return this.http.get<any>(`${this.apiUrl}/find`, { params });
  }

  getById(id: number): Observable<User> {
    return this.http.get<User>(`${this.apiUrl}/view/${id}`);
  }

  create(user: User): Observable<User> {
    return this.http.post<User>(this.apiUrl, user).pipe(
      tap(savedUser => this.user.set(savedUser))
    );
  }

  update(id: number, user: User): Observable<User> {
    return this.http.put<User>(`${this.apiUrl}/${id}`, user);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }


  updateFirstPassword(userId: number, newPassword: string): Observable<User> {
    // Creamos el body exacto que espera nuestro controlador en Spring
    const payload = {
      userId: userId,
      newPassword: newPassword
    };
    return this.http.post<User>(`${this.apiUrl}/update-password`, payload);
  }

}
