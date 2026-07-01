import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormGroup, FormControl, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';

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

  offreForm = new FormGroup({
    titre: new FormControl('', [Validators.required, Validators.minLength(5)]),
    type: new FormControl('', [Validators.required]),
    agence: new FormControl('', [Validators.required]),
    prix: new FormControl('', [Validators.required, Validators.min(0)]),
    places: new FormControl('', [Validators.required, Validators.min(1)]),
    depart: new FormControl('', [Validators.required]),
  });

  constructor(private router: Router, private route: ActivatedRoute) {}

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isEditMode = true;
      this.offreForm.patchValue({
        titre: 'VIP Yaoundé → Douala',
        type: 'Bus',
        agence: 'Transcam Voyages',
        prix: '15000',
        places: '12',
        depart: '08:00',
      });
    }
  }

  get titre() { return this.offreForm.get('titre'); }
  get type() { return this.offreForm.get('type'); }
  get agence() { return this.offreForm.get('agence'); }
  get prix() { return this.offreForm.get('prix'); }
  get places() { return this.offreForm.get('places'); }
  get depart() { return this.offreForm.get('depart'); }

  onSubmit() {
    if (this.offreForm.invalid) {
      this.offreForm.markAllAsTouched();
      return;
    }
    this.isLoading = true;
    setTimeout(() => {
      this.isLoading = false;
      this.successMessage = this.isEditMode ? 'Offre modifiée avec succès !' : 'Offre créée avec succès !';
      setTimeout(() => this.router.navigate(['/dashboard/offres']), 1500);
    }, 1000);
  }

  annuler() {
    this.router.navigate(['/dashboard/offres']);
  }
}