import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-list',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './list.html',
  styleUrl: './list.css',
})
export class List {
  recherche: string = '';
  isLoading: boolean = false;

 agences = [
  { id: 1, nom: 'Transcam Voyages', email: 'contact@transcam.cm', telephone: '691 234 567', initiales: 'TV' },
  { id: 2, nom: 'Bamenda Express', email: 'info@bamenda.cm', telephone: '677 890 123', initiales: 'BE' },
  { id: 3, nom: 'Camair-Co', email: 'booking@camairco.cm', telephone: '699 111 222', initiales: 'CC' },
  { id: 4, nom: 'Sud Voyages', email: 'contact@sud.cm', telephone: '655 678 901', initiales: 'SV' },
  { id: 5, nom: 'Nord Express', email: 'contact@nordexpress.cm', telephone: '677 123 456', initiales: 'NE' },
  { id: 6, nom: 'Camrail', email: 'contact@camrail.cm', telephone: '677 000 111', initiales: 'CR' },
];
  page: number = 1;
  pageSize: number = 4;

  constructor(private router: Router) {}

  get agencesFiltrees() {
    return this.agences.filter(a =>
      a.nom.toLowerCase().includes(this.recherche.toLowerCase())
    );
  }

  get agencesPaginees() {
    const debut = (this.page - 1) * this.pageSize;
    return this.agencesFiltrees.slice(debut, debut + this.pageSize);
  }

  get totalPages() {
    return Math.ceil(this.agencesFiltrees.length / this.pageSize);
  }

  modifierAgence(id: number) {
    this.router.navigate(['/dashboard/agences/form', id]);
  }

  supprimerAgence(id: number) {
    this.agences = this.agences.filter(a => a.id !== id);
  }

  nouvelleAgence() {
    this.router.navigate(['/dashboard/agences/form']);
  }
}