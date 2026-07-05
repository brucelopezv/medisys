import { Component, inject, signal, ViewChild } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Sidebar } from "./core/layout/sidebar/sidebar";
import { AuthService } from './features/auth/services/auth-service';
import { HeaderComponent } from './core/layout/header/header-component/header-component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, Sidebar, HeaderComponent],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('medsys');
  public authService = inject(AuthService);

  @ViewChild(Sidebar) sidebar!: Sidebar;

  get isSidebarActive(): boolean {
    return this.sidebar ? this.sidebar.isSidebarActive : false;
  }

}
