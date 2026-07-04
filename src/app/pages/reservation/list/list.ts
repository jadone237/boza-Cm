import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { ReservationService } from '../../../services/reservation';

type StatutUi = 'confirmee' | 'attente' | 'annulee' | 'terminee';
type TransportType = 'bus' | 'train' | 'avion';

interface ReservationUi {
  id: number;
  type: TransportType;
  avatar: string;
  client: string;
  offre: string;
  dateDepart: string | null;
  statut: StatutUi;
  billetNumero: string | null;
}

const STATUT_BACKEND_VERS_UI: Record<string, StatutUi> = {
  EN_ATTENTE: 'attente',
  CONFIRMEE: 'confirmee',
  ANNULEE: 'annulee',
  TERMINEE: 'terminee'
};

@Component({
  selector: 'app-list',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './list.html',
  styleUrl: './list.css'
})
export class List implements OnInit {

  // ===== TEMPLATE-DRIVEN FORMS =====
  selectedStatut = 'tous';
  selectedType = 'tous';
  searchText = '';

  isLoading = true;
  errorMessage = '';
  reservations: ReservationUi[] = [];

  // Action en cours (pour désactiver les boutons pendant l'appel réseau)
  actionEnCoursId: number | null = null;

  constructor(
    private reservationService: ReservationService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.chargerReservations();
  }

  private chargerReservations(): void {
    this.isLoading = true;
    this.errorMessage = '';
    this.cdr.detectChanges();

    this.reservationService.getAllReservations().subscribe({
      next: (data) => {
        this.reservations = data.map(item => this.normaliser(item));
        this.isLoading = false;
        this.cdr.detectChanges();
      },
      error: () => {
        this.errorMessage = 'Impossible de charger les réservations.';
        this.isLoading = false;
        this.cdr.detectChanges();
      }
    });
  }

  private normaliser(item: any): ReservationUi {
    const nomComplet = item.clientNomComplet || 'Client inconnu';
    const initiales = nomComplet
      .split(' ')
      .map((mot: string) => mot.charAt(0))
      .join('')
      .substring(0, 2)
      .toUpperCase();

    return {
      id: item.idReservation,
      type: item.type,
      avatar: initiales,
      client: nomComplet,
      offre: `${item.villeDeDepart || '—'} → ${item.villeArrivee || '—'}`,
      dateDepart: item.dateDepart || null,
      statut: STATUT_BACKEND_VERS_UI[item.statutReservation] || 'attente',
      billetNumero: item.billetNumero || null
    };
  }

  // ===== STATISTIQUES (calculées sur les données réelles) =====
  get total(): number {
    return this.reservations.length;
  }

  get totalConfirmees(): number {
    return this.reservations.filter(r => r.statut === 'confirmee' || r.statut === 'terminee').length;
  }

  get totalAttente(): number {
    return this.reservations.filter(r => r.statut === 'attente').length;
  }

  get totalAnnulees(): number {
    return this.reservations.filter(r => r.statut === 'annulee').length;
  }

  get pourcentageConfirmees(): number {
    return this.total === 0 ? 0 : Math.round((this.totalConfirmees / this.total) * 100);
  }

  // ===== FILTRAGE =====
  get reservationsFiltrees(): ReservationUi[] {
    return this.reservations.filter(r => {
      const matchStatut = this.selectedStatut === 'tous' || r.statut === this.selectedStatut;
      const matchType = this.selectedType === 'tous' || r.type === this.selectedType;
      const matchSearch = this.searchText === '' ||
        r.client.toLowerCase().includes(this.searchText.toLowerCase());

      return matchStatut && matchType && matchSearch;
    });
  }

  // ===== ACTIONS =====
  confirmer(reservation: ReservationUi): void {
    this.actionEnCoursId = reservation.id;
    const obs = reservation.type === 'train'
      ? this.reservationService.confirmerReservationTrain(reservation.id)
      : reservation.type === 'avion'
        ? this.reservationService.confirmerReservationAvion(reservation.id)
        : this.reservationService.confirmerReservationBus(reservation.id);

    obs.subscribe({
      next: () => {
        reservation.statut = 'confirmee';
        this.actionEnCoursId = null;
        this.cdr.detectChanges();
      },
      error: () => {
        this.errorMessage = 'Impossible de confirmer cette réservation.';
        this.actionEnCoursId = null;
        this.cdr.detectChanges();
      }
    });
  }

  annuler(reservation: ReservationUi): void {
    this.actionEnCoursId = reservation.id;
    const obs = reservation.type === 'train'
      ? this.reservationService.annulerReservationTrain(reservation.id)
      : reservation.type === 'avion'
        ? this.reservationService.annulerReservationAvion(reservation.id)
        : this.reservationService.annulerReservationBus(reservation.id);

    obs.subscribe({
      next: () => {
        reservation.statut = 'annulee';
        this.actionEnCoursId = null;
        this.cdr.detectChanges();
      },
      error: () => {
        this.errorMessage = 'Impossible d\'annuler cette réservation.';
        this.actionEnCoursId = null;
        this.cdr.detectChanges();
      }
    });
  }
}
