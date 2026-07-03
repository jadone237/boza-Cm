import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-list',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './list.html',
  styleUrl: './list.css'
})
export class List {

  // ===== TEMPLATE-DRIVEN FORMS =====
  // Les variables liées aux filtres avec ngModel
  selectedStatut = 'tous';
  selectedType = 'tous';
  searchText = '';

  // Liste des réservations (données statiques pour l'instant)
  reservations = [
    {
      id: 1,
      avatar: 'SA',
      client: 'Serge Atangana',
      offre: 'VIP Ydé → Dla',
      type: 'bus',
      date: '25/03/2026',
      statut: 'confirmee'
    },
    {
      id: 2,
      avatar: 'FM',
      client: 'Florence Mvondo',
      offre: 'Vol Dla → Garoua',
      type: 'avion',
      date: '26/03/2026',
      statut: 'attente'
    },
    {
      id: 3,
      avatar: 'EB',
      client: 'Estelle Beyala',
      offre: 'Express Baf → Bda',
      type: 'bus',
      date: '28/03/2026',
      statut: 'annulee'
    }
  ];

  // ===== FILTRAGE DES RÉSERVATIONS =====
  // Cette méthode filtre la liste selon les critères choisis
  get reservationsFiltrees() {
    return this.reservations.filter(r => {

      // Filtre par statut
      const matchStatut = this.selectedStatut === 'tous' ||
                          r.statut === this.selectedStatut;

      // Filtre par type
      const matchType = this.selectedType === 'tous' ||
                        r.type === this.selectedType;

      // Filtre par recherche texte
      const matchSearch = this.searchText === '' ||
                          r.client.toLowerCase()
                          .includes(this.searchText.toLowerCase());

      return matchStatut && matchType && matchSearch;
    });
  }

  // ===== ACTIONS SUR LES RÉSERVATIONS =====
  confirmer(id: number) {
    const reservation = this.reservations.find(r => r.id === id);
    if (reservation) {
      reservation.statut = 'confirmee';
    }
  }

  annuler(id: number) {
    const reservation = this.reservations.find(r => r.id === id);
    if (reservation) {
      reservation.statut = 'annulee';
    }
  }
}