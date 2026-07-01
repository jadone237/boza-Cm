import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {
  activeTab: 'admin' | 'client' = 'admin';
  email: string = '';
  password: string = '';
  showPassword: boolean = false;
  errorMessage: string = '';

  constructor(private router: Router) {}

  switchTab(tab: 'admin' | 'client') {
    this.activeTab = tab;
    this.email = '';
    this.password = '';
    this.errorMessage = '';
  }

  togglePassword() {
    this.showPassword = !this.showPassword;
  }
onSubmit() {
  if (!this.email || !this.password) {
    this.errorMessage = 'Veuillez remplir tous les champs.';
    return;
  }
  if (this.activeTab === 'admin') {
    this.router.navigate(['/dashboard']);
  } else {
    this.router.navigate(['/accueil']);
  }
}
}