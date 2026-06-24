import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class OffreService {

  private baseUrl = 'http://localhost:8080/api/v1/offres';

  constructor(private http: HttpClient) {}

  // CRUD
  getAllOffres(): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/get_all`);
  }

  getAllOffresPaginated(page: number, size: number, sortBy: string): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/get_all_page?page=${page}&size=${size}&sortBy=${sortBy}`);
  }

  getOffreById(id: number): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/get_by_id/${id}`);
  }

  createOffre(offre: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/create`, offre);
  }

  updateOffre(id: number, offre: any): Observable<any> {
    return this.http.put(`${this.baseUrl}/update/${id}`, offre);
  }

  deleteOffre(id: number): Observable<any> {
    return this.http.delete(`${this.baseUrl}/delete/${id}`);
  }

  // Recherche multicritère
  rechercherOffres(criteres: any): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/recherche`, { params: criteres });
  }

  getOffresByPrixRange(min: number, max: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/search/prix/${min}/${max}`);
  }

  getOffresByAgence(agenceId: number): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/search/agence/${agenceId}`);
  }
}