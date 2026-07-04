import { Component, ChangeDetectorRef } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive, Router, NavigationEnd } from '@angular/router';
import { CommonModule } from '@angular/common';
import { filter } from 'rxjs';

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

  // Menu latéral ouvert (uniquement pertinent sur mobile/tablette < 992px)
  sidebarOuvert = false;

  constructor(private router: Router, private cdr: ChangeDetectorRef) {
    // Ferme automatiquement le menu mobile après un changement de page
    this.router.events.pipe(filter(e => e instanceof NavigationEnd)).subscribe(() => {
      this.sidebarOuvert = false;
      this.cdr.detectChanges();
    });
  }

  toggleSidebar(): void {
    this.sidebarOuvert = !this.sidebarOuvert;
    this.cdr.detectChanges();
  }

  fermerSidebar(): void {
    this.sidebarOuvert = false;
    this.cdr.detectChanges();
  }

  logout() {
    this.router.navigate(['/login']);
  }
}
