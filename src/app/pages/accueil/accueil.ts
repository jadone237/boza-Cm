import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink, Router } from '@angular/router';
import { OffreService } from '../../services/offre';

@Component({
  selector: 'app-accueil',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './accueil.html',
  styleUrl: './accueil.css',
})
export class Accueil implements OnInit {
  depart: string = '';
  destination: string = '';
  date: string = '';
  isLoadingOffres: boolean = false;
  errorMessageOffres: string = '';

  offres: any[] = []; // Tableau qui va stocker les offres réelles issues de votre backend

  constructor(
    private offreService: OffreService,
    private cdr: ChangeDetectorRef, // Injection du détecteur de changements d'Angular
    private router: Router // Injection du Router pour gérer la redirection
  ) {}

  ngOnInit(): void {
    this.loadAllOffres();
  }

  /**
   * Extrait de manière robuste un tableau d'offres à partir de la réponse du serveur,
   * gérant les formats directs [], ou enveloppés comme { content: [] }, { offres: [] }, { data: [] }.
   */
  private extraireTableauOffres(response: any): any[] {
    if (!response) return [];
    if (Array.isArray(response)) return response;
    
    // Si la réponse est un objet, on cherche les clés d'enveloppe courantes
    if (typeof response === 'object') {
      if (Array.isArray(response.content)) return response.content;
      if (Array.isArray(response.offres)) return response.offres;
      if (Array.isArray(response.data)) return response.data;
      if (Array.isArray(response.results)) return response.results;
    }
    
    return [];
  }

  /**
   * Normalise une offre pour s'assurer que les propriétés 'villeDepart' et 'villeArrivee'
   * soient toujours renseignées, même si elles sont imbriquées dans un trajet ou nommées différemment.
   */
  private normaliserOffre(offre: any): any {
    return {
      ...offre,
      villeDepart: 
        offre.villeDepart || 
        offre.trajet?.villeDepart || 
        offre.depart || 
        offre.trajet?.depart || 
        'Départ',
      villeArrivee: 
        offre.villeArrivee || 
        offre.trajet?.villeArrivee || 
        offre.arrivee || 
        offre.destination || 
        offre.trajet?.arrivee || 
        'Arrivée'
    };
  }

  /**
   * Charge toutes les offres initiales de votre backend approuvé.
   */
  loadAllOffres(): void {
    this.isLoadingOffres = true;
    this.errorMessageOffres = '';
    this.cdr.detectChanges(); // Force le spinner à s'afficher immédiatement
    
    this.offreService.getAllOffres().subscribe({
      next: (data) => {
        // Extraction sécurisée et normalisation des données du backend
        const listeBrute = this.extraireTableauOffres(data);
        this.offres = listeBrute.map((offre: any) => this.normaliserOffre(offre));
        this.isLoadingOffres = false;
        this.cdr.detectChanges(); // Force Angular à dessiner les offres dès qu'elles arrivent !
      },
      error: (err) => {
        console.error('Erreur lors du chargement des offres:', err);
        this.errorMessageOffres = 'Impossible de charger les offres. Veuillez réessayer plus tard.';
        this.isLoadingOffres = false;
        this.cdr.detectChanges(); // Force l'affichage du message d'erreur
      }
    });
  }

  /**
   * Effectue une recherche filtrée basée sur les critères saisis par l'utilisateur.
   */
  rechercher(): void {
    this.isLoadingOffres = true;
    this.errorMessageOffres = '';
    this.cdr.detectChanges();

    const criteres = {
      villeDepart: this.depart,
      villeArrivee: this.destination,
      dateDepart: this.date,
    };

    // Filtrer les critères vides
    const params: any = {};
    for (const key in criteres) {
      if (criteres[key as keyof typeof criteres]) {
        params[key] = criteres[key as keyof typeof criteres];
      }
    }

    this.offreService.rechercherOffres(params).subscribe({
      next: (data) => {
        // Extraction sécurisée et normalisation sur les résultats de recherche
        const listeBrute = this.extraireTableauOffres(data);
        this.offres = listeBrute.map((offre: any) => this.normaliserOffre(offre));
        this.isLoadingOffres = false;
        this.cdr.detectChanges(); // Force la mise à jour des résultats de recherche
      },
      error: (err) => {
        console.error('Erreur lors de la recherche des offres:', err);
        this.errorMessageOffres = 'Erreur lors de la recherche des offres. Veuillez réessayer.';
        this.isLoadingOffres = false;
        this.cdr.detectChanges();
      }
    });
  }

  /**
   * Gère la déconnexion de l'utilisateur, nettoie le stockage local et redirige vers le login.
   */
  deconnexion(): void {
    // Nettoyage du token ou des données de session stockées localement
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    sessionStorage.clear();

    // Redirection vers l'écran d'authentification
    this.router.navigate(['/login']);
  }
}