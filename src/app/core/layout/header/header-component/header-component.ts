import { Component, computed, inject } from '@angular/core';
import { SideBarService } from '../../../services/side-bar-service';
import { AuthService } from '../../../../features/auth/services/auth-service';


@Component({
  selector: 'app-header-component',
  standalone: true,
  templateUrl: './header-component.html',
  styleUrl: './header-component.css'
})
export class HeaderComponent {

  private sidebarService = inject(SideBarService);
  public authService = inject(AuthService);

  userInitials = computed(() => {
    const user = this.authService.currentUser();
    if (!user) return '??';
    return `${user.firstName.charAt(0)}${user.lastName.charAt(0)}`.toUpperCase();
  });

  toggleSidebar(): void {
    this.sidebarService.toggleSidebar();
  }
}
