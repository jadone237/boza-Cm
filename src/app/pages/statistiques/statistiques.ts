import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-statistiques',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './statistiques.html',
  styleUrl: './statistiques.css',
})
export class Statistiques {

  stats = [
    { label: 'Agences', valeur: 5, evolution: '+2%', icon: 'bi-building' },
    { label: 'Réservations', valeur: 34, evolution: '+12%', icon: 'bi-ticket-perforated' },
    { label: 'Confirmées', valeur: 20, evolution: '74%', icon: 'bi-check-circle' },
    { label: 'CA (FCFA)', valeur: 185000, evolution: '+8.5K', icon: 'bi-cash-stack' },
  ];

  classement = [
    { rang: 1, nom: 'Transcam Voyages', description: 'Service Premium', ca: 85000, taux: 94 },
    { rang: 2, nom: 'Camair-Co', description: 'Lignes Nationales', ca: 62000, taux: 88 },
    { rang: 3, nom: 'Bamenda Express', description: 'Transport Rapide', ca: 38000, taux: 72 },
  ];

  reservationsParAgence = [
    { agence: 'Transcam Voyages', total: 17 },
    { agence: 'Camair-Co', total: 12 },
    { agence: 'Bamenda Express', total: 8 },
    { agence: 'Sud Voyages', total: 4 },
  ];

  maxReservations = 17;

  getBarWidth(total: number): string {
    return (total / this.maxReservations * 100) + '%';
  }
}