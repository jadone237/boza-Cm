import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormGroup, FormControl, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { OffreService } from '../../../services/offre';
import { AgenceService } from '../../../services/agence';
import { TrajetService } from '../../../services/trajet';

@Component({
  selector: 'app-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './form.html',
  styleUrl: './form.css',
})
export class Form implements OnInit {
  isEditMode: boolean = false;
  isLoading: boolean = false;
  successMessage: string = '';
  errorMessage: string = '';

  offreId: number | null = null;

  agences: any[] = [];
  trajets: any[] = [];

  offreForm = new FormGroup({
    titre: new FormControl('', [Validators.required, Validators.minLength(5)]),
    description: new FormControl('', [Validators.required]),
    prix: new FormControl('', [Validators.required, Validators.min(1)]),
    dateDepart: new FormControl('', [Validators.required]),
    nombrePlaces: new FormControl('', [Validators.required, Validators.min(1)]),
    agenceId: new FormControl('', [Validators.required]),
    trajetId: new FormControl('', [Validators.required]),
  });

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private offreService: OffreService,
    private agenceService: AgenceService,
    private trajetService: TrajetService,
    private cd: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    // Charger les listes déroulantes
    this.chargerAgences();
    this.chargerTrajets();

    // Mode édition ?
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isEditMode = true;
      this.offreId = +id;
      this.chargerOffre(+id);
    }
  }

  chargerAgences(): void {
    this.agenceService.getAllAgences().subscribe({
      next: (data) => {
        this.agences = data || [];
        this.cd.detectChanges();
      },
      error: (err) => console.error('Erreur chargement agences', err)
    });
  }

  chargerTrajets(): void {
    this.trajetService.getAllTrajets().subscribe({
      next: (data) => {
        this.trajets = data || [];
        this.cd.detectChanges();
      },
      error: (err) => console.error('Erreur chargement trajets', err)
    });
  }

  chargerOffre(id: number): void {
    this.offreService.getOffreById(id).subscribe({
      next: (o) => {
        this.offreForm.patchValue({
          titre: o.titre,
          description: o.description,
          prix: o.prix,
          dateDepart: o.dateDepart,
          nombrePlaces: o.nombrePlaces,
          agenceId: o.agence?.id,
          trajetId: o.trajet?.id,
        });
        this.cd.detectChanges();
      },
      error: (err) => console.error('Erreur chargement offre', err)
    });
  }

  get titre() { return this.offreForm.get('titre'); }
  get description() { return this.offreForm.get('description'); }
  get prix() { return this.offreForm.get('prix'); }
  get dateDepart() { return this.offreForm.get('dateDepart'); }
  get nombrePlaces() { return this.offreForm.get('nombrePlaces'); }
  get agenceId() { return this.offreForm.get('agenceId'); }
  get trajetId() { return this.offreForm.get('trajetId'); }

  onSubmit(): void {
    if (this.offreForm.invalid) {
      this.offreForm.markAllAsTouched();
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';

    const v = this.offreForm.value;
    const payload = {
      titre: v.titre,
      description: v.description,
      prix: Number(v.prix),
      dateDepart: v.dateDepart,
      nombrePlaces: Number(v.nombrePlaces),
      agenceId: Number(v.agenceId),
      trajetId: Number(v.trajetId),
    };

    const requete = this.isEditMode && this.offreId
      ? this.offreService.updateOffre(this.offreId, payload)
      : this.offreService.createOffre(payload);

    requete.subscribe({
      next: () => {
        this.isLoading = false;
        const message = this.isEditMode ? 'Offre modifiée avec succès !' : 'Offre créée avec succès !';
        this.router.navigate(['/dashboard/offres'], { state: { message } });
      },
      error: (err) => {
        this.isLoading = false;
        this.errorMessage = err?.error || "Une erreur est survenue lors de l'enregistrement.";
        this.cd.detectChanges();
      }
    });
  }

  annuler(): void {
    this.router.navigate(['/dashboard/offres']);
  }
}