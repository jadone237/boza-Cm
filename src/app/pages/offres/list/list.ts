import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-list',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './list.html',
  styleUrl: './list.css',
})
export class List {
  recherche: string = '';
  filtreType: string = '';
  page: number = 1;
  pageSize: number = 4;

  offres = [
    { id: 1, titre: 'VIP Yaoundé → Douala', type: 'Bus', agence: 'Transcam Voyages', prix: 15000, places: 12, depart: '08:00' },
    { id: 2, titre: 'Vol Douala → Garoua', type: 'Avion', agence: 'Camair-Co', prix: 45000, places: 2, depart: '10:30' },
    { id: 3, titre: 'Classic Bamenda → Yaoundé', type: 'Bus', agence: 'Bamenda Express', prix: 7000, places: 24, depart: '22:00' },
    { id: 4, titre: 'Express Douala → Bafoussam', type: 'Bus', agence: 'Transcam Voyages', prix: 3500, places: 1, depart: '14:00' },
    { id: 5, titre: 'Ngaoundéré → Douala', type: 'Train', agence: 'Camrail', prix: 12000, places: 40, depart: '18:00' },
    { id: 6, titre: 'Vol Yaoundé → Maroua', type: 'Avion', agence: 'Camair-Co', prix: 52000, places: 8, depart: '07:15' },
    { id: 7, titre: 'Kribi → Douala Express', type: 'Bus', agence: 'Sud Voyages', prix: 4000, places: 15, depart: '09:00' },
    { id: 8, titre: 'Yaoundé → Ngaoundéré', type: 'Train', agence: 'Camrail', prix: 11000, places: 35, depart: '17:30' },
  ];

  constructor(private router: Router) {}

  get totalBus() { return this.offres.filter(o => o.type === 'Bus').length; }
  get totalAvion() { return this.offres.filter(o => o.type === 'Avion').length; }
  get placesRestantes() { return this.offres.reduce((acc, o) => acc + o.places, 0); }

  get offresFiltrees() {
    return this.offres.filter(o => {
      const matchRecherche = o.titre.toLowerCase().includes(this.recherche.toLowerCase()) ||
        o.agence.toLowerCase().includes(this.recherche.toLowerCase());
      const matchType = this.filtreType ? o.type === this.filtreType : true;
      return matchRecherche && matchType;
    });
  }

  get offresPaginees() {
    const debut = (this.page - 1) * this.pageSize;
    return this.offresFiltrees.slice(debut, debut + this.pageSize);
  }

  get totalPages() {
    return Math.ceil(this.offresFiltrees.length / this.pageSize);
  }

  nouvelleOffre() {
    this.router.navigate(['/dashboard/offres/form']);
  }

  modifierOffre(id: number) {
    this.router.navigate(['/dashboard/offres/form', id]);
  }

  supprimerOffre(id: number) {
    this.offres = this.offres.filter(o => o.id !== id);
  }
}