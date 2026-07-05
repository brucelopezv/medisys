import { CommonModule, } from '@angular/common';
import { Component, HostListener, OnInit, OnDestroy, Renderer2, inject } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SideBarService } from '../../services/side-bar-service';
import { Subscription } from 'rxjs';
import { AuthService } from '../../../features/auth/services/auth-service';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './sidebar.html',
  styleUrl: './sidebar.css'
})
export class Sidebar implements OnInit, OnDestroy {
  isSidebarActive = false;
  public authService = inject(AuthService);

  private subscription: Subscription | undefined;

  constructor(private sidebarService: SideBarService) { }

  ngOnInit(): void {
    this.checkScreenSize();
    this.subscription = this.sidebarService.isSidebarActive$.subscribe(state => {
      this.isSidebarActive = state;
    });
  }

  logout(): void {
    this.authService.logout();
  }

  ngOnDestroy(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  toggleSidebar(): void {
    this.sidebarService.toggleSidebar();
  }

  closeSidebar(): void {
    if (window.innerWidth < 992) {
      this.sidebarService.setSidebarState(false);
    }
  }

  @HostListener('window:resize')
  checkScreenSize(): void {
    if (typeof window !== "undefined") {
      if (window.innerWidth >= 992) {
        this.sidebarService.setSidebarState(false);
      }
    }

  }
}
