import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { TrajetService } from '../../../services/trajet';

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

  trajets: any[] = [];
  trajetsFiltres: any[] = [];
  trajetsPagines: any[] = [];

  page: number = 1;
  pageSize: number = 4;
  totalPages: number = 0;

  constructor(
    private router: Router,
    private trajetService: TrajetService,
    private cd: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.chargerTrajets();
  }

  chargerTrajets() {
    this.isLoading = true;
    this.trajetService.getAllTrajets().subscribe({
      next: (data: any) => {
        this.trajets = data;
        this.preparerAffichage();
        this.isLoading = false;
        this.cd.detectChanges();
      },
      error: (err: any) => {
        this.errorMessage = 'Erreur lors du chargement des trajets.';
        this.isLoading = false;
        this.cd.detectChanges();
        console.error(err);
      }
    });
  }

  preparerAffichage() {
    this.trajetsFiltres = this.trajets;
    this.totalPages = Math.ceil(this.trajetsFiltres.length / this.pageSize);
    this.paginer();
  }

  paginer() {
    const debut = (this.page - 1) * this.pageSize;
    this.trajetsPagines = this.trajetsFiltres.slice(debut, debut + this.pageSize);
  }

  allerPage(p: number) {
    if (p < 1 || p > this.totalPages) return;
    this.page = p;
    this.paginer();
  }
  onRecherche() {
  this.page = 1;
  const terme = this.recherche.trim();

  if (terme === '') {
    this.chargerTrajets();
    return;
  }

  this.isLoading = true;
  this.trajetService.rechercher(terme).subscribe({
    next: (data: any) => {
      this.trajets = data;
      this.preparerAffichage();
      this.isLoading = false;
      this.cd.detectChanges();
    },
    error: (err: any) => {
      this.trajets = [];
      this.preparerAffichage();
      this.isLoading = false;
      this.cd.detectChanges();
      console.error(err);
    }
  });
}

  nouveauTrajet() {
    this.router.navigate(['/dashboard/trajets/form']);
  }

  modifierTrajet(id: number) {
    this.router.navigate(['/dashboard/trajets/form', id]);
  }

  supprimerTrajet(id: number) {
    if (confirm('Voulez-vous vraiment supprimer ce trajet ?')) {
      this.trajetService.deleteTrajet(id).subscribe({
        next: () => {
          this.successMessage = 'Trajet supprimé avec succès !';
          this.chargerTrajets();
          setTimeout(() => this.successMessage = '', 3000);
        },
       error: (err: any) => {
          this.errorMessage = 'Impossible de supprimer ce trajet : il est lié à une ou plusieurs offres.';
          this.cd.detectChanges();
          console.error(err);
          setTimeout(() => { this.errorMessage = ''; this.cd.detectChanges(); }, 4000);
        }
      });
    }
  }
}