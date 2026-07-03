import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { OffreService } from '../../../services/offre';
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
  page: number = 1;
  pageSize: number = 5;
  chargement: boolean = true;
  errorMessage: string = '';
  successMessage: string = '';

  offres: any[] = [];
  notification: string = '';

  // ==================== RECHERCHE MULTICRITÈRE ====================
  afficherFiltres: boolean = false;
  rechercheAvanceeActive: boolean = false;
  agences: any[] = [];

  filtres = {
    villeDepart: '',
    villeArrivee: '',
    prixMin: null as number | null,
    prixMax: null as number | null,
    dateDepart: '',
    agenceId: null as number | null,
  };

  constructor(
    private router: Router,
    private offreService: OffreService,
    private agenceService: AgenceService,
    private cd: ChangeDetectorRef
  ) {
    const nav = this.router.getCurrentNavigation();
    const state = nav?.extras?.state as { message?: string } | undefined;
    if (state?.message) {
      this.notification = state.message;
    }
  }

  ngOnInit(): void {
    if (this.notification) {
      setTimeout(() => { this.notification = ''; this.cd.detectChanges(); }, 3000);
    }
    this.chargerOffres();
    this.chargerAgences();
  }

  chargerAgences(): void {
    this.agenceService.getAllAgences().subscribe({
      next: (data) => {
        this.agences = data || [];
        this.cd.detectChanges();
      },
      error: (err) => console.error('Erreur chargement agences', err)
    });
  }

  chargerOffres(): void {
    this.chargement = true;
    this.rechercheAvanceeActive = false;
    this.offreService.getAllOffres().subscribe({
      next: (data) => {
        this.offres = data || [];
        this.chargement = false;
        this.page = 1;
        this.cd.detectChanges();
      },
      error: (err) => {
        console.error('Erreur lors du chargement des offres', err);
        this.chargement = false;
        this.cd.detectChanges();
      }
    });
  }

  // ==================== RECHERCHE AVANCÉE ====================

  toggleFiltres(): void {
    this.afficherFiltres = !this.afficherFiltres;
  }

  rechercherAvancee(): void {
    this.chargement = true;

    // On ne garde que les critères réellement renseignés
    const criteres: any = {};
    if (this.filtres.villeDepart)  criteres.villeDepart  = this.filtres.villeDepart;
    if (this.filtres.villeArrivee) criteres.villeArrivee = this.filtres.villeArrivee;
    if (this.filtres.prixMin != null && this.filtres.prixMin !== ('' as any)) criteres.prixMin = this.filtres.prixMin;
    if (this.filtres.prixMax != null && this.filtres.prixMax !== ('' as any)) criteres.prixMax = this.filtres.prixMax;
    if (this.filtres.dateDepart)   criteres.dateDepart   = this.filtres.dateDepart;
    if (this.filtres.agenceId != null && this.filtres.agenceId !== ('' as any)) criteres.agenceId = this.filtres.agenceId;

    criteres.page = 0;
    criteres.size = 50;

    this.offreService.rechercherOffres(criteres).subscribe({
      next: (result) => {
        this.offres = result?.content || [];
        this.rechercheAvanceeActive = true;
        this.page = 1;
        this.chargement = false;
        this.cd.detectChanges();
      },
      error: (err) => {
        console.error('Erreur lors de la recherche', err);
        this.chargement = false;
        this.cd.detectChanges();
      }
    });
  }

  reinitialiserFiltres(): void {
    this.filtres = {
      villeDepart: '',
      villeArrivee: '',
      prixMin: null,
      prixMax: null,
      dateDepart: '',
      agenceId: null,
    };
    this.chargerOffres();
  }

  // ==================== AFFICHAGE / PAGINATION ====================

  get placesRestantes(): number {
    return this.offres.reduce((acc, o) => acc + (o.placesDisponibles || 0), 0);
  }

  get offresFiltrees(): any[] {
    // Si une recherche avancée est active, le filtrage est déjà fait côté backend
    if (this.rechercheAvanceeActive) {
      return this.offres;
    }
    const terme = this.recherche.toLowerCase();
    return this.offres.filter(o => {
      const titre = (o.titre || '').toLowerCase();
      const nomAgence = (o.agence?.nom || '').toLowerCase();
      return titre.includes(terme) || nomAgence.includes(terme);
    });
  }

  get offresPaginees(): any[] {
    const debut = (this.page - 1) * this.pageSize;
    return this.offresFiltrees.slice(debut, debut + this.pageSize);
  }

  get totalPages(): number {
    return Math.ceil(this.offresFiltrees.length / this.pageSize) || 1;
  }

  allerPage(p: number): void {
    if (p < 1 || p > this.totalPages) return;
    this.page = p;
  }

  nouvelleOffre(): void {
    this.router.navigate(['/dashboard/offres/form']);
  }

  modifierOffre(id: number): void {
    this.router.navigate(['/dashboard/offres/form', id]);
  }

  supprimerOffre(id: number): void {
    if (!confirm('Voulez-vous vraiment supprimer cette offre ?')) return;
    this.offreService.deleteOffre(id).subscribe({
      next: () => {
        this.successMessage = 'Offre supprimée avec succès !';
        this.chargerOffres();
        setTimeout(() => this.successMessage = '', 3000);
      },
      error: (err) => {
        console.error('Erreur lors de la suppression', err);
        alert('Impossible de supprimer cette offre.');
      }
    });
  }
}