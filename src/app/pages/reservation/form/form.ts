import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { switchMap, catchError } from 'rxjs';
import { OffreService } from '../../../services/offre';
import { ClientService } from '../../../services/client';
import { ReservationService } from '../../../services/reservation';
import { BilletService } from '../../../services/billet';

@Component({
  selector: 'app-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './form.html',
  styleUrl: './form.css'
})
export class Form implements OnInit {
  offre: any;
  reservationForm!: FormGroup;
  isLoading = true;
  isSubmitting = false;
  errorMessage = '';
  offreId: number | null = null;
  selectedTransport: 'bus' | 'train' | 'avion' = 'bus';

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private offreService: OffreService,
    private clientService: ClientService,
    private reservationService: ReservationService,
    private billetService: BilletService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.reservationForm = this.fb.group({
      prenom: ['', Validators.required],
      nom: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      numeroTelephone: ['', [Validators.required, Validators.pattern(/^6[0-9]{8}$/)]],
      adresse: ['', Validators.required]
    });

    this.route.queryParams.subscribe(params => {
      const id = params['offreId'];
      if (!id) {
        this.router.navigate(['/accueil']);
        return;
      }
      this.offreId = +id;
      this.loadOffre(this.offreId);
    });
  }

  private loadOffre(id: number): void {
    this.isLoading = true;
    this.errorMessage = '';
    this.cdr.detectChanges();

    this.offreService.getOffreById(id).subscribe({
      next: (data) => {
        const offreBrute = data?.data ?? data;
        this.offre = this.normaliserOffre(offreBrute);
        this.isLoading = false;
        this.cdr.detectChanges();
      },
      error: () => {
        this.errorMessage = 'Impossible de charger cette offre.';
        this.isLoading = false;
        this.cdr.detectChanges();
      }
    });
  }

  selectTransport(type: 'bus' | 'train' | 'avion'): void {
    this.selectedTransport = type;
  }

  private normaliserOffre(offre: any): any {
    return {
      ...offre,
      villeDepart:
        offre.villeDepart ||
        offre.trajet?.villeDepart ||
        offre.depart ||
        offre.trajet?.depart ||
        'Départ',
      villeArrivee:
        offre.villeArrivee ||
        offre.trajet?.villeArrivee ||
        offre.arrivee ||
        offre.destination ||
        offre.trajet?.arrivee ||
        'Arrivée'
    };
  }

  confirmerReservation(): void {
    if (this.reservationForm.invalid || !this.offreId) {
      this.reservationForm.markAllAsTouched();
      return;
    }

    this.isSubmitting = true;
    this.errorMessage = '';
    const { prenom, nom, email, numeroTelephone, adresse } = this.reservationForm.value;

    let clientId: number;

    // Email ET téléphone sont uniques en base côté backend. On cherche un client
    // existant par email, puis par téléphone, et on ne crée que si aucun des deux
    // ne correspond — sinon la création échoue (409 email / 500 téléphone).
    this.clientService
      .getClientByEmail(email)
      .pipe(
        catchError(() => this.clientService.getClientByTelephone(numeroTelephone)),
        catchError(() => this.clientService.createClient({ prenom, nom, email, numeroTelephone, adresse })),
        switchMap((client) => {
          // ClientResponseDTO expose "idClient" (pas "id")
          clientId = client?.idClient ?? client?.id ?? client;
          const offreId = this.offreId!;
          const compagnie = this.offre?.agence?.nom || 'BozaCM Voyages';

          switch (this.selectedTransport) {
            case 'train':
              return this.reservationService.createReservationTrain({
                clientId,
                offreId,
                compagnieTrain: compagnie,
                numeroWagon: 'W' + offreId,
                classeTrain: 'SECONDE'
              });
            case 'avion':
              return this.reservationService.createReservationAvion({
                clientId,
                offreId,
                compagnieAerienne: compagnie,
                numeroVol: 'BC' + String(offreId).padStart(3, '0'),
                classeAvion: 'ECONOMIE',
                poidsMaxBagages: 20
              });
            default:
              return this.reservationService.createReservationBus({
                clientId,
                offreId,
                compagnieBus: compagnie,
                typeBus: 'VIP',
                climatisation: true
              });
          }
        }),
        // La réservation est créée EN_ATTENTE : il faut la confirmer explicitement
        switchMap((reservation) => {
          const reservationId = reservation?.idReservation ?? reservation?.id;
          switch (this.selectedTransport) {
            case 'train':
              return this.reservationService.confirmerReservationTrain(reservationId);
            case 'avion':
              return this.reservationService.confirmerReservationAvion(reservationId);
            default:
              return this.reservationService.confirmerReservationBus(reservationId);
          }
        }),
        // Le billet (QR code + PDF + email de confirmation) n'est généré qu'à cet appel
        switchMap((reservationConfirmee) => {
          const reservationId = reservationConfirmee?.idReservation ?? reservationConfirmee?.id;
          return this.billetService.createBillet({ reservationId, clientId });
        })
      )
      .subscribe({
        next: (billet) => {
          this.router.navigate(['/confirmation'], {
            queryParams: {
              numeroBillet: billet?.numeroBillet,
              reservationId: billet?.reservationId
            }
          });
        },
        error: () => {
          this.errorMessage = 'Erreur lors de la réservation. Veuillez réessayer.';
          this.isSubmitting = false;
          this.cdr.detectChanges();
        }
      });
  }
}
