import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { OffreService } from '../../services/offre';

@Component({
  selector: 'app-accueil',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './accueil.html',
  styleUrl: './accueil.css',
})
export class Accueil implements OnInit {
  activeType: string = 'BUS';
  depart: string = '';
  destination: string = '';
  date: string = '';
  isLoadingOffres: boolean = false;
  errorMessageOffres: string = '';

  transportTypes = [
    { label: 'BUS', icon: '🚌' },
    { label: 'AVION', icon: '✈️' },
    { label: 'TRAIN', icon: '🚆' },
  ];

  offres: any[] = []; // Initialiser comme un tableau vide

  constructor(private offreService: OffreService) {}

  ngOnInit(): void {
    this.loadAllOffres();
  }

  selectType(type: string): void {
    this.activeType = type;
  }

  loadAllOffres(): void {
    this.isLoadingOffres = true;
    this.errorMessageOffres = '';
    this.offreService.getAllOffres().subscribe({
      next: (data) => {
        this.offres = data;
        this.isLoadingOffres = false;
      },
      error: (err) => {
        console.error('Erreur lors du chargement des offres:', err);
        this.errorMessageOffres = 'Impossible de charger les offres. Veuillez réessayer plus tard.';
        this.isLoadingOffres = false;
      }
    });
  }

  rechercher(): void {
    this.isLoadingOffres = true;
    this.errorMessageOffres = '';

    const criteres = {
      typeTransport: this.activeType === 'BUS' ? 'BUS' : this.activeType === 'AVION' ? 'AVION' : 'TRAIN', // Assurez-vous que le type correspond à votre backend
      villeDepart: this.depart,
      villeArrivee: this.destination,
      dateDepart: this.date,
    };

    // Filtrer les critères vides
    const params: any = {};
    for (const key in criteres) {
      if (criteres[key as keyof typeof criteres]) {
        params[key] = criteres[key as keyof typeof criteres];
      }
    }

    this.offreService.rechercherOffres(params).subscribe({
      next: (data) => {
        this.offres = data;
        this.isLoadingOffres = false;
      },
      error: (err) => {
        console.error('Erreur lors de la recherche des offres:', err);
        this.errorMessageOffres = 'Erreur lors de la recherche des offres. Veuillez réessayer.';
        this.isLoadingOffres = false;
      }
    });
  }
}
