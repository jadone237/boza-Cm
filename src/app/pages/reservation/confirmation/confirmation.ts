import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { BilletService } from '../../../services/billet';

@Component({
  selector: 'app-confirmation',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './confirmation.html',
  styleUrl: './confirmation.css'
})
export class Confirmation implements OnInit {
  billet: any;
  isLoading = true;
  errorMessage = '';

  constructor(
    private route: ActivatedRoute,
    private billetService: BilletService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      const numeroBillet = params['numeroBillet'];
      const reservationId = params['reservationId'];

      if (numeroBillet) {
        this.chargerParNumero(numeroBillet);
      } else if (reservationId) {
        this.chargerParReservation(+reservationId);
      } else {
        this.isLoading = false;
        this.errorMessage = 'Aucune réservation à afficher.';
      }
    });
  }

  private chargerParNumero(numeroBillet: string): void {
    this.billetService.getBilletByNumero(numeroBillet).subscribe({
      next: (data) => this.onBilletCharge(data),
      error: () => this.onErreurChargement()
    });
  }

  private chargerParReservation(reservationId: number): void {
    this.billetService.getBilletByReservation(reservationId).subscribe({
      next: (data) => this.onBilletCharge(data),
      error: () => this.onErreurChargement()
    });
  }

  private onBilletCharge(data: any): void {
    this.billet = data?.data ?? data;
    this.isLoading = false;
    this.cdr.detectChanges();
  }

  private onErreurChargement(): void {
    this.errorMessage = 'Impossible de récupérer les détails de ce billet.';
    this.isLoading = false;
    this.cdr.detectChanges();
  }
}
