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

  agenceForm = new FormGroup({
    nom: new FormControl('', [Validators.required, Validators.minLength(3)]),
    email: new FormControl('', [Validators.required, Validators.email]),
    telephone: new FormControl('', [Validators.required, Validators.pattern('^[0-9 ]{9,13}$')]),
    adresse: new FormControl('', [Validators.required]),
  });

  constructor(private router: Router, private route: ActivatedRoute) {}

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isEditMode = true;
      // Simuler le chargement des données
      this.agenceForm.patchValue({
        nom: 'Transcam Voyages',
        email: 'contact@transcam.cm',
        telephone: '691 234 567',
        adresse: 'Yaoundé, Cameroun',
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
    setTimeout(() => {
      this.isLoading = false;
      this.successMessage = this.isEditMode ? 'Agence modifiée avec succès !' : 'Agence créée avec succès !';
      setTimeout(() => this.router.navigate(['/dashboard/agences']), 1500);
    }, 1000);
  }

  annuler() {
    this.router.navigate(['/dashboard/agences']);
  }
}