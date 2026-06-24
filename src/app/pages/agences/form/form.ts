import { Component, OnInit } from '@angular/core';
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
  successMessage: string = '';
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
    private agenceService: AgenceService
  ) {}

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isEditMode = true;
      this.agenceId = +id;
      this.agenceService.getAgenceById(this.agenceId).subscribe({
        next: (data) => {
          this.agenceForm.patchValue({
            nom: data.nom,
            email: data.email,
            telephone: data.telephone,
            adresse: data.adresse,
          });
        },
        error: (err) => {
          this.errorMessage = 'Erreur lors du chargement de l\'agence.';
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
          this.successMessage = 'Agence modifiée avec succès !';
          setTimeout(() => this.router.navigate(['/dashboard/agences']), 1500);
        },
        error: (err) => {
          this.isLoading = false;
          this.errorMessage = 'Erreur lors de la modification.';
          console.error(err);
        }
      });
    } else {
      this.agenceService.createAgence(this.agenceForm.value).subscribe({
        next: () => {
          this.isLoading = false;
          this.successMessage = 'Agence créée avec succès !';
          setTimeout(() => this.router.navigate(['/dashboard/agences']), 1500);
        },
        error: (err) => {
          this.isLoading = false;
          this.errorMessage = 'Erreur lors de la création.';
          console.error(err);
        }
      });
    }
  }

  annuler() {
    this.router.navigate(['/dashboard/agences']);
  }
}