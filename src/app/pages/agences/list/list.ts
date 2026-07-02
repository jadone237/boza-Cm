import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AgenceService } from '../../../services/agence';

@Component({
  selector: 'app-list',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './list.html',
  styleUrl: './list.css',
})
export class List implements OnInit {
  recherche: string = '';
  isLoading: boolean = false;
  errorMessage: string = '';
  successMessage: string = '';

  agences: any[] = [];
  agencesFiltrees: any[] = [];
  agencesPaginees: any[] = [];

  page: number = 1;
  pageSize: number = 4;
  totalPages: number = 0;

  constructor(
    private router: Router,
    private agenceService: AgenceService,
    private cd: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.chargerAgences();
  }

  chargerAgences() {
    this.isLoading = true;
    this.agenceService.getAllAgences().subscribe({
      next: (data: any) => {
        this.agences = data;
        this.filtrer();
        this.isLoading = false;
        this.cd.detectChanges();
      },
      error: (err: any) => {
        this.isLoading = false;
        this.cd.detectChanges();
        console.error(err);
      }
    });
  }

  filtrer() {
    this.agencesFiltrees = this.agences.filter(a =>
      a.nom.toLowerCase().includes(this.recherche.toLowerCase())
    );
    this.totalPages = Math.ceil(this.agencesFiltrees.length / this.pageSize);
    this.paginer();
  }

  paginer() {
    const debut = (this.page - 1) * this.pageSize;
    this.agencesPaginees = this.agencesFiltrees.slice(debut, debut + this.pageSize);
  }
  allerPage(p: number) {
  if (p < 1 || p > this.totalPages) return;
  this.page = p;
  this.paginer();
}
preparerAffichage() {
  this.agencesFiltrees = this.agences;
  this.totalPages = Math.ceil(this.agencesFiltrees.length / this.pageSize);
  this.paginer();
}

onRecherche() {
  this.page = 1;
  const terme = this.recherche.trim();

  if (terme === '') {
    this.chargerAgences();
    return;
  }

  this.isLoading = true;
  this.agenceService.rechercher(terme).subscribe({
    next: (data: any) => {
      this.agences = data;
      this.preparerAffichage();
      this.isLoading = false;
      this.cd.detectChanges();
    },
    error: (err: any) => {
      this.agences = [];
      this.preparerAffichage();
      this.isLoading = false;
      this.cd.detectChanges();
      console.error(err);
    }
  });
}

  modifierAgence(id: number) {
    this.router.navigate(['/dashboard/agences/form', id]);
  }

  supprimerAgence(id: number) {
    if (confirm('Voulez-vous vraiment supprimer cette agence ?')) {
      this.agenceService.deleteAgence(id).subscribe({
        next: () => {
          this.successMessage = 'Agence supprimée avec succès !';
          this.chargerAgences();
          setTimeout(() => this.successMessage = '', 3000);
        },
        error: (err: any) => {
          this.errorMessage = 'Erreur lors de la suppression.';
          console.error(err);
        }
      });
    }
  }

  nouvelleAgence() {
    this.router.navigate(['/dashboard/agences/form']);
  }
}