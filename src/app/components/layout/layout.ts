import { Component } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [RouterOutlet, RouterLink, RouterLinkActive, CommonModule],
  templateUrl: './layout.html',
  styleUrl: './layout.css',
})
export class Layout {
  menuItems = [
    { label: 'Agences', icon: '🏢', route: '/dashboard/agences' },
    { label: 'Trajets', icon: '🗺️', route: '/dashboard/trajets' },
    { label: 'Offres', icon: '🏷️', route: '/dashboard/offres' },
    { label: 'Réservations', icon: '🎫', route: '/dashboard/reservations' },
    { label: 'Statistiques', icon: '📊', route: '/dashboard/statistiques' },
    { label: 'Rapports', icon: '📋', route: '/dashboard/rapports' },
  ];

  logout() {
    // Navigation vers login
  }
}