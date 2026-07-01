import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AgenceService } from '../../services/agence';

@Component({
  selector: 'app-statistiques',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './statistiques.html',
  styleUrl: './statistiques.css',
})
export class Statistiques implements OnInit {

  classement: any[] = [];
  maxReservations = 1; // évite la division par zéro
  chargement = true;

  // Cartes de statistiques globales (calculées à partir du classement)
  totalAgences = 0;
  totalReservations = 0;
  totalConfirmees = 0;
  chiffreAffairesTotal = 0;

  constructor(
    private agenceService: AgenceService,
    private cd: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.chargerClassement();
  }

  chargerClassement(): void {
    this.chargement = true;
    this.agenceService.getClassementAgences().subscribe({
      next: (data) => {
        this.classement = data || [];
        this.calculerTotaux();
        this.chargement = false;
        this.cd.detectChanges();
      },
      error: (err) => {
        console.error('Erreur lors du chargement du classement', err);
        this.chargement = false;
        this.cd.detectChanges();
      }
    });
  }

  calculerTotaux(): void {
    this.totalAgences = this.classement.length;
    this.totalReservations = this.classement.reduce((s, a) => s + (a.nombreReservationsTotal || 0), 0);
    this.totalConfirmees = this.classement.reduce((s, a) => s + (a.nombreReservationsConfirmees || 0), 0);
    this.chiffreAffairesTotal = this.classement.reduce((s, a) => s + (a.chiffreAffaire || 0), 0);

    // Pour les barres de progression : la plus grande valeur de réservations
    const max = Math.max(...this.classement.map(a => a.nombreReservationsTotal || 0), 1);
    this.maxReservations = max;
  }

  getBarWidth(total: number): string {
    return ((total || 0) / this.maxReservations * 100) + '%';
  }
}