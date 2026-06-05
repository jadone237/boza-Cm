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

  trajetForm = new FormGroup({
    depart: new FormControl('', [Validators.required, Validators.minLength(3)]),
    arrivee: new FormControl('', [Validators.required, Validators.minLength(3)]),
    type: new FormControl('', [Validators.required]),
    duree: new FormControl('', [Validators.required]),
  });

  constructor(private router: Router, private route: ActivatedRoute) {}

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isEditMode = true;
      this.trajetForm.patchValue({
        depart: 'Douala Bonabéri',
        arrivee: 'Yaoundé Mvan',
        type: 'Bus',
        duree: '3h 50min',
      });
    }
  }

  get depart() { return this.trajetForm.get('depart'); }
  get arrivee() { return this.trajetForm.get('arrivee'); }
  get type() { return this.trajetForm.get('type'); }
  get duree() { return this.trajetForm.get('duree'); }

  onSubmit() {
    if (this.trajetForm.invalid) {
      this.trajetForm.markAllAsTouched();
      return;
    }
    this.isLoading = true;
    setTimeout(() => {
      this.isLoading = false;
      this.successMessage = this.isEditMode ? 'Trajet modifié avec succès !' : 'Trajet créé avec succès !';
      setTimeout(() => this.router.navigate(['/dashboard/trajets']), 1500);
    }, 1000);
  }

  annuler() {
    this.router.navigate(['/dashboard/trajets']);
  }
}