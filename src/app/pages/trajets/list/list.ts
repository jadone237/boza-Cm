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
  page: number = 1;
  pageSize: number = 4;

  trajets = [
  { id: 1, depart: 'Douala Bonabéri', arrivee: 'Yaoundé Mvan', type: 'Bus', duree: '3h 50min' },
  { id: 2, depart: 'Douala', arrivee: 'Garoua', type: 'Avion', duree: '1h 20min' },
  { id: 3, depart: 'Yaoundé', arrivee: 'Bafoussam', type: 'Bus', duree: '5h 15min' },
  { id: 4, depart: 'Ngaoundéré', arrivee: 'Douala', type: 'Train', duree: '14h 00min' },
  { id: 5, depart: 'Yaoundé', arrivee: 'Ngaoundéré', type: 'Train', duree: '13h 30min' },
  { id: 6, depart: 'Douala', arrivee: 'Limbé', type: 'Bus', duree: '1h 45min' },
  { id: 7, depart: 'Bafoussam', arrivee: 'Bamenda', type: 'Bus', duree: '2h 30min' },
  { id: 8, depart: 'Douala', arrivee: 'Maroua', type: 'Avion', duree: '2h 05min' },
];

  constructor(private router: Router) {}

  get totalTypes() {
    return new Set(this.trajets.map(t => t.type)).size;
  }

  get totalVilles() {
    return new Set([
      ...this.trajets.map(t => t.depart),
      ...this.trajets.map(t => t.arrivee)
    ]).size;
  }

  get trajetsFiltres() {
    return this.trajets.filter(t =>
      t.depart.toLowerCase().includes(this.recherche.toLowerCase()) ||
      t.arrivee.toLowerCase().includes(this.recherche.toLowerCase())
    );
  }

  get trajetsPagines() {
    const debut = (this.page - 1) * this.pageSize;
    return this.trajetsFiltres.slice(debut, debut + this.pageSize);
  }

  get totalPages() {
    return Math.ceil(this.trajetsFiltres.length / this.pageSize);
  }

  nouveauTrajet() {
    this.router.navigate(['/dashboard/trajets/form']);
  }

  modifierTrajet(id: number) {
    this.router.navigate(['/dashboard/trajets/form', id]);
  }

  supprimerTrajet(id: number) {
    this.trajets = this.trajets.filter(t => t.id !== id);
  }
}