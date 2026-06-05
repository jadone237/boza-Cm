import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-rapports',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './rapports.html',
  styleUrl: './rapports.css',
})
export class Rapports {

  stats = [
    { label: 'Agences', valeur: 5, icon: 'bi-building' },
    { label: 'Trajets', valeur: 8, icon: 'bi-signpost-2' },
    { label: 'Offres', valeur: 12, icon: 'bi-collection' },
    { label: 'Réservations', valeur: 34, icon: 'bi-ticket-perforated' },
    { label: 'Confirmées', valeur: 20, icon: 'bi-check-circle' },
    { label: 'Annulées', valeur: 4, icon: 'bi-x-circle' },
  ];

  topPerformances = [
    { label: 'Offre la plus réservée', valeur: 'VIP Yaoundé → Douala', chiffre: 17, unite: 'réservations' },
    { label: 'Agence la plus active', valeur: 'Transcam Voyages', chiffre: 85000, unite: 'FCFA' },
    { label: 'Trajet le plus emprunté', valeur: 'Yaoundé → Douala', chiffre: 20, unite: 'fois' },
  ];

  taux = [
    { label: 'Confirmé', valeur: 60, couleur: 'bg-success' },
    { label: 'En attente', valeur: 25, couleur: 'bg-warning' },
    { label: 'Annulé', valeur: 15, couleur: 'bg-danger' },
  ];

  chiffreAffaires: number = 185000;

  exporterBilan() {
    alert('Export du bilan en cours...');
  }

  detailsParAgence() {
    alert('Détails par agence en cours...');
  }
}