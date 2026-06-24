import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RapportService } from '../../services/rapport';

@Component({
  selector: 'app-rapports',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './rapports.html',
  styleUrl: './rapports.css',
})
export class Rapports implements OnInit {

  isLoading: boolean = false;
  errorMessage: string = '';

  rapport: any = null;

  stats: any[] = [];
  topPerformances: any[] = [];
  taux: any[] = [];
  chiffreAffaires: number = 0;

  constructor(
    private rapportService: RapportService,
    private cd: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.chargerRapport();
  }

  chargerRapport() {
    this.isLoading = true;
    this.errorMessage = '';
    this.rapportService.getRapportGlobal().subscribe({
      next: (data) => {
        this.rapport = data;
        this.preparerDonnees(data);
        this.isLoading = false;
        this.cd.detectChanges();
      },
      error: (err) => {
        this.errorMessage = 'Erreur lors du chargement du rapport.';
        this.isLoading = false;
        this.cd.detectChanges();
        console.error(err);
      }
    });
  }

  preparerDonnees(data: any) {
    this.stats = [
      { label: 'Agences', valeur: data.totalAgences, icon: 'bi-building' },
      { label: 'Trajets', valeur: data.totalTrajets, icon: 'bi-signpost-2' },
      { label: 'Offres', valeur: data.totalOffres, icon: 'bi-collection' },
      { label: 'Réservations', valeur: data.totalReservations, icon: 'bi-ticket-perforated' },
      { label: 'Confirmées', valeur: data.totalConfirmees, icon: 'bi-check-circle' },
      { label: 'Annulées', valeur: data.totalAnnulees, icon: 'bi-x-circle' },
    ];

    this.topPerformances = [
      { label: 'Offre la plus réservée', valeur: data.offreLaPlusReservee, icon: 'bi-star' },
      { label: 'Agence la plus active', valeur: data.agenceLaPlusActive, icon: 'bi-trophy' },
      { label: 'Trajet le plus emprunté', valeur: data.trajetLePlusEmprunte, icon: 'bi-geo-alt' },
    ];

    const total = data.totalReservations || 1;
    this.taux = [
      { label: 'Confirmé', valeur: Math.round((data.totalConfirmees / total) * 100), couleur: 'bg-success' },
      { label: 'En attente', valeur: Math.round((data.totalEnAttente / total) * 100), couleur: 'bg-warning' },
      { label: 'Annulé', valeur: Math.round((data.totalAnnulees / total) * 100), couleur: 'bg-danger' },
    ];

    this.chiffreAffaires = data.chiffreAffairesTotal;
  }
}