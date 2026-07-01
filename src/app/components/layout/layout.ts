import { Component } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive, Router } from '@angular/router';
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
    { label: 'Agences', icon: 'bi-building', route: '/dashboard/agences' },
    { label: 'Trajets', icon: 'bi-signpost-2', route: '/dashboard/trajets' },
    { label: 'Offres', icon: 'bi-tag', route: '/dashboard/offres' },
    { label: 'Réservations', icon: 'bi-ticket-perforated', route: '/dashboard/reservations' },
    { label: 'Statistiques', icon: 'bi-bar-chart', route: '/dashboard/statistiques' },
    { label: 'Rapports', icon: 'bi-file-text', route: '/dashboard/rapports' },
  ];

  constructor(private router: Router) {}

  logout() {
    this.router.navigate(['/login']);
  }
}