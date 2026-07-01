import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-accueil',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './accueil.html',
  styleUrl: './accueil.css',
})
export class Accueil {
  activeType: string = 'BUS';
  depart: string = '';
  destination: string = '';
  date: string = '';

  transportTypes = [
    { label: 'BUS', icon: '🚌' },
    { label: 'AVION', icon: '✈️' },
    { label: 'TRAIN', icon: '🚆' },
  ];

  offres = [
    { titre: 'VIP Yaoundé -> Douala', duree: '3h30', agence: 'opep plus confort', prix: 15000, badge: 'VIP CLASS', type: 'BUS' },
    { titre: 'Vol Douala -> Garoua', duree: '1h30', agence: 'Camair-Co', prix: 45000, badge: 'DIRECT', type: 'AVION' },
    { titre: 'Express Baf -> Bamenda', duree: '2h30', agence: 'Bamenda Express', prix: 3500, badge: 'EXPRESS', type: 'BUS' },
  ];

  selectType(type: string) {
    this.activeType = type;
  }

  rechercher() {
    console.log('Recherche:', this.activeType, this.depart, this.destination, this.date);
  }
}