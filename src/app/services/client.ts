import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ClientService {
  private http = inject(HttpClient);
  private apiUrl = 'http://localhost:8080/api/v1/clients';

  // Crée un client et extrait l'objet contenu dans le champ "data" de l'ApiResponse
  createClient(clientData: { prenom: string; nom: string; email: string; numeroTelephone: string; adresse: string }): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/create`, clientData).pipe(
      map(response => response.data)
    );
  }

  getClientById(id: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/get_by_id/${id}`).pipe(
      map(response => response.data)
    );
  }

  // Renvoie une erreur HTTP 404 (via l'observable) si aucun client n'a cet email
  getClientByEmail(email: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/email/${encodeURIComponent(email)}`).pipe(
      map(response => response.data)
    );
  }

  // Renvoie une erreur HTTP 404 (via l'observable) si aucun client n'a ce numéro
  getClientByTelephone(numeroTelephone: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/telephone/${encodeURIComponent(numeroTelephone)}`).pipe(
      map(response => response.data)
    );
  }
}