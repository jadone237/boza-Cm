import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormGroup, FormControl, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
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
  trajetId: number | null = null;

  trajetForm = new FormGroup({
    villeDepart: new FormControl('', [Validators.required, Validators.minLength(2)]),
    villeArrivee: new FormControl('', [Validators.required, Validators.minLength(2)]),
    duree: new FormControl('', [Validators.required]),
  });

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private trajetService: TrajetService
  ) {}

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isEditMode = true;
      this.trajetId = +id;
      this.trajetService.getTrajetById(this.trajetId).subscribe({
        next: (data: any) => { => {
          this.trajetForm.patchValue({
            villeDepart: data.villeDepart,
            villeArrivee: data.villeArrivee,
            duree: data.duree,
          });
        },
        error: (err: any) => {
          this.errorMessage = 'Erreur lors du chargement du trajet.';
          console.error(err);
        }
      });
    }
  }

  get villeDepart() { return this.trajetForm.get('villeDepart'); }
  get villeArrivee() { return this.trajetForm.get('villeArrivee'); }
  get duree() { return this.trajetForm.get('duree'); }

  onSubmit() {
    if (this.trajetForm.invalid) {
      this.trajetForm.markAllAsTouched();
      return;
    }
    this.isLoading = true;
    this.errorMessage = '';

    if (this.isEditMode && this.trajetId) {
      this.trajetService.updateTrajet(this.trajetId, this.trajetForm.value).subscribe({
        next: () => {
          this.isLoading = false;
          this.successMessage = 'Trajet modifié avec succès !';
          setTimeout(() => this.router.navigate(['/dashboard/trajets']), 1500);
        },
        error: (err: any) => {
          this.isLoading = false;
          this.errorMessage = 'Erreur lors de la modification.';
          console.error(err);
        }
      });
    } else {
      this.trajetService.createTrajet(this.trajetForm.value).subscribe({
        next: () => {
          this.isLoading = false;
          this.successMessage = 'Trajet créé avec succès !';
          setTimeout(() => this.router.navigate(['/dashboard/trajets']), 1500);
        },
        error: (err: any) => {
          this.isLoading = false;
          this.errorMessage = 'Erreur lors de la création.';
          console.error(err);
        }
      });
    }
  }

  annuler() {
    this.router.navigate(['/dashboard/trajets']);
  }
}