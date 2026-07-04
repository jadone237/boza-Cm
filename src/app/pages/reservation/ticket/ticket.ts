import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { BilletService } from '../../../services/billet';

@Component({
  selector: 'app-ticket',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './ticket.html',
  styleUrl: './ticket.css',
})
export class Ticket implements OnInit {
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
        this.billetService.getBilletByNumero(numeroBillet).subscribe({
          next: (data) => this.onBilletCharge(data),
          error: () => this.onErreurChargement()
        });
      } else if (reservationId) {
        this.billetService.getBilletByReservation(+reservationId).subscribe({
          next: (data) => this.onBilletCharge(data),
          error: () => this.onErreurChargement()
        });
      } else {
        this.isLoading = false;
        this.errorMessage = 'Aucun billet à afficher.';
      }
    });
  }

  private onBilletCharge(data: any): void {
    this.billet = data?.data ?? data;
    this.isLoading = false;
    this.cdr.detectChanges();
  }

  private onErreurChargement(): void {
    this.errorMessage = 'Impossible de récupérer ce billet.';
    this.isLoading = false;
    this.cdr.detectChanges();
  }

  compagnieTransport(): string {
    if (!this.billet) return '—';
    return this.billet.compagnieBus || this.billet.compagnieTrain || this.billet.compagnieAerienne || '—';
  }

  classeTransport(): string {
    if (!this.billet) return '—';
    if (this.billet.typeBus) {
      return this.billet.typeBus + (this.billet.climatisation ? ' CLIMATISÉ' : '');
    }
    if (this.billet.classeTrain) return this.billet.classeTrain;
    if (this.billet.classeAvion) return this.billet.classeAvion;
    return '—';
  }

  codeVille(nomVille: string | undefined): string {
    return (nomVille || '---').substring(0, 3).toUpperCase();
  }

  telechargerPdf(): void {
    if (!this.billet?.numeroBillet) return;
    this.billetService.downloadBilletPdf(this.billet.numeroBillet).subscribe(blob => {
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `Billet_${this.billet.numeroBillet}.pdf`;
      a.click();
      window.URL.revokeObjectURL(url);
    });
  }
}
