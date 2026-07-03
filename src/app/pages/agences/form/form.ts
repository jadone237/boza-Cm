import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormGroup, FormControl, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { AgenceService } from '../../../services/agence';

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
  agenceId: number | null = null;

  agenceForm = new FormGroup({
    nom: new FormControl('', [Validators.required, Validators.minLength(3)]),
    email: new FormControl('', [Validators.required, Validators.email]),
    telephone: new FormControl('', [Validators.required]),
    adresse: new FormControl('', [Validators.required]),
  });

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private agenceService: AgenceService,
    private cd: ChangeDetectorRef
  ) {}

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isEditMode = true;
      this.agenceId = +id;
      this.agenceService.getAgenceById(this.agenceId).subscribe({
        next: (agence) => {
          this.agenceForm.patchValue({
            nom: agence.nom,
            email: agence.email,
            telephone: agence.telephone,
            adresse: agence.adresse,
          });
          this.cd.detectChanges();
        },
        error: (err) => {
          this.errorMessage = 'Erreur lors du chargement de l\'agence.';
          this.cd.detectChanges();
          console.error(err);
        }
      });
    }
  }

  get nom() { return this.agenceForm.get('nom'); }
  get email() { return this.agenceForm.get('email'); }
  get telephone() { return this.agenceForm.get('telephone'); }
  get adresse() { return this.agenceForm.get('adresse'); }

  onSubmit() {
    if (this.agenceForm.invalid) {
      this.agenceForm.markAllAsTouched();
      return;
    }
    this.isLoading = true;
    this.errorMessage = '';

    if (this.isEditMode && this.agenceId) {
      this.agenceService.updateAgence(this.agenceId, this.agenceForm.value).subscribe({
        next: () => {
          this.isLoading = false;
          this.router.navigate(['/dashboard/agences'], { state: { message: 'Agence modifiée avec succès !' } });
        },
        error: (err) => {
          this.isLoading = false;
          this.errorMessage = this.extraireMessageErreur(err, 'Erreur lors de la modification de l\'agence.');
          this.cd.detectChanges();
          console.error(err);
        }
      });
    } else {
      this.agenceService.createAgence(this.agenceForm.value).subscribe({
        next: () => {
          this.isLoading = false;
          this.router.navigate(['/dashboard/agences'], { state: { message: 'Agence créée avec succès !' } });
        },
        error: (err) => {
          this.isLoading = false;
          this.errorMessage = this.extraireMessageErreur(err, 'Erreur lors de la création de l\'agence.');
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
    this.router.navigate(['/dashboard/agences']);
  }
}