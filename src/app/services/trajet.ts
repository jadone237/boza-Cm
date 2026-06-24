import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TrajetService {

  private baseUrl = 'http://localhost:8080/api/v1/trajets';

  constructor(private http: HttpClient) {}

  // CRUD
  getAllTrajets(): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/get_all`);
  }

  getTrajetById(id: number): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/get_by_id/${id}`);
  }

  createTrajet(trajet: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/create`, trajet, { responseType: 'text' });
  }

  updateTrajet(id: number, trajet: any): Observable<any> {
    return this.http.put(`${this.baseUrl}/update/${id}`, trajet, { responseType: 'text' });
  }

  deleteTrajet(id: number): Observable<any> {
    return this.http.delete(`${this.baseUrl}/delete/${id}`, { responseType: 'text' });
  }

  // Recherches
  getTrajetsByDepart(depart: string): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/search/depart/${depart}`);
  }

  getTrajetsByRoute(depart: string, arrivee: string): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/search/route/${depart}/${arrivee}`);
  }
}