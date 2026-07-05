import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { Observable, tap } from 'rxjs';
import { Subscription } from './Subscription';

@Injectable({
  providedIn: 'root'
})
export class SubscriptionService {

  private http = inject(HttpClient);
  private urlEndpoint = 'http://localhost:8085/api/subscriptions';

  subscription = signal<Subscription | null>(null);

  get(page: number): Observable<any> {
    return this.http.get<any>(`${this.urlEndpoint}/page/${page}`);
  }

  getByCompanyId(companyId: number, page: number): Observable<any> {
    const params = new HttpParams()
      .set('page', page.toString())
    return this.http.get<any>(`${this.urlEndpoint}/company/${companyId}`, { params });
  }


  find(termino: string, page: number = 0): Observable<any> {
    let params = new HttpParams();
    params = params.append('page', page.toString());
    params = params.append('name', termino);
    return this.http.get(`${this.urlEndpoint}/find`, { params: params });
  }



  getById(id: number): Observable<Subscription> {
    return this.http.get<Subscription>(`${this.urlEndpoint}/${id}`);
  }

  create(subscription: Subscription): Observable<Subscription> {
    return this.http.post<Subscription>(this.urlEndpoint, subscription).pipe(
      tap(savedSubscription => this.subscription.set(savedSubscription))
    );
  }

  update(id: number, subscription: Subscription): Observable<Subscription> {
    return this.http.put<Subscription>(`${this.urlEndpoint}/${id}`, subscription);
  }

  cancel(id: number): Observable<Subscription> {
    return this.http.delete<Subscription>(`${this.urlEndpoint}/${id}`).pipe(
      tap(cancelledSubscription => this.subscription.set(cancelledSubscription))
    );
  }

}
