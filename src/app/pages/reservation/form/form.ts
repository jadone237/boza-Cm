import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import {
  ReactiveFormsModule,
  FormBuilder,
  FormGroup,
  Validators
} from '@angular/forms';

@Component({
  selector: 'app-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './form.html',
  styleUrl: './form.css'
})
export class Form implements OnInit {

  reservationForm!: FormGroup;
  formSubmitted = false;
  isLoading = false;
  selectedTransport = 'bus';

  constructor(
    private fb: FormBuilder,
    private router: Router
  ) {}

  ngOnInit() {
    this.reservationForm = this.fb.group({
      nomComplet: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.required, Validators.email]],
      telephone: ['', [Validators.required, Validators.pattern('^[0-9]{9}$')]]
    });
  }

  selectTransport(transport: string) {
    this.selectedTransport = transport;
  }

  get f() {
    return this.reservationForm.controls;
  }

  onSubmit() {
    this.formSubmitted = true;
    if (this.reservationForm.invalid) return;
    this.isLoading = true;
    setTimeout(() => {
      this.isLoading = false;
      this.router.navigate(['/confirmation']);
    }, 2000);
  }
}