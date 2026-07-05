import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class SideBarService {

  private isSidebarActiveSubject = new BehaviorSubject<boolean>(false);
  public isSidebarActive$: Observable<boolean> = this.isSidebarActiveSubject.asObservable();

  toggleSidebar(): void {
    this.isSidebarActiveSubject.next(!this.isSidebarActiveSubject.value);
  }

  setSidebarState(state: boolean): void {
    this.isSidebarActiveSubject.next(state);
  }

}
