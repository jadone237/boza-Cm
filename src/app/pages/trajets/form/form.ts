import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
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
    private trajetService: TrajetService,
    private cd: ChangeDetectorRef
  ) {}

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isEditMode = true;
      this.trajetId = +id;
      this.trajetService.getTrajetById(this.trajetId).subscribe({
        next: (data) => {
          this.trajetForm.patchValue({
            villeDepart: data.villeDepart,
            villeArrivee: data.villeArrivee,
            duree: data.duree,
          });
          this.cd.detectChanges();
        },
        error: (err) => {
          this.errorMessage = 'Erreur lors du chargement du trajet.';
          this.cd.detectChanges();
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
          this.router.navigate(['/dashboard/trajets'], { state: { message: 'Trajet modifié avec succès !' } });
        },
        error: (err) => {
          this.isLoading = false;
          this.errorMessage = this.extraireMessageErreur(err, 'Erreur lors de la modification du trajet.');
          this.cd.detectChanges();
          console.error(err);
        }
      });
    } else {
      this.trajetService.createTrajet(this.trajetForm.value).subscribe({
        next: () => {
          this.isLoading = false;
          this.router.navigate(['/dashboard/trajets'], { state: { message: 'Trajet créé avec succès !' } });
        },
        error: (err) => {
          this.isLoading = false;
          this.errorMessage = this.extraireMessageErreur(err, 'Erreur lors de la création du trajet.');
          this.cd.detectChanges();
          console.error(err);
        }
      });
    }
  }

  private extraireMessageErreur(err: any, messageParDefaut: string): string {
    if (err?.error?.message) {
      return err.error.message;
    }
    if (typeof err?.error === 'string' && err.error.length > 0) {
      return err.error;
    }
    return messageParDefaut;
  }

  annuler() {
    this.router.navigate(['/dashboard/trajets']);
  }
}