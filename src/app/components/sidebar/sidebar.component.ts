import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, ButtonModule, RouterModule],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.css'
})
export class SidebarComponent {
  isExpanded = false;

  // Exemplo de itens do menu
  menuItems = [
    { label: 'Dashboard', icon: 'pi pi-chart-bar', route: '/dashboard' },
    { label: 'Monitoramento', icon: 'pi pi-eye', route: '/monitoramento' },
    { label: 'Alertas', icon: 'pi pi-exclamation-triangle', route: '/alertas' },
    { label: 'Residências', icon: 'pi pi-home', route: '/residencias' }
  ];

  toggleSidebar() {
    this.isExpanded = !this.isExpanded;
  }
}
