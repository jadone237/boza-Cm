import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AgenceService {

  private baseUrl = 'http://localhost:8080/api/v1/agences';

  constructor(private http: HttpClient) {}

  // CRUD
  getAllAgences(): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/get_all`);
  }

  getAllAgencesPaginated(page: number, size: number, sortBy: string): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/get_all_page?page=${page}&size=${size}&sortBy=${sortBy}`);
  }

  getAgenceById(id: number): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/get_by_id/${id}`);
  }

  createAgence(agence: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/create`, agence);
  }

  updateAgence(id: number, agence: any): Observable<any> {
    return this.http.put(`${this.baseUrl}/update/${id}`, agence);
  }

  deleteAgence(id: number): Observable<any> {
    return this.http.delete(`${this.baseUrl}/delete/${id}`);
  }

  // Recherches
  getAgenceByEmail(email: string): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/search/email/${email}`);
  }

  getAgencesByVille(ville: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/search/ville/${ville}`);
  }

  // Statistiques
  getClassementAgences(): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/classement`);
  }

  getStatistiquesAgence(id: number): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/statistiques/${id}`);
  }
}