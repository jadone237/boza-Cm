import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class BilletService {
  private http = inject(HttpClient);
  private apiUrl = 'http://localhost:8080/api/v1/billets';

  // Crée le billet (génère QR code + PDF + envoie l'email de confirmation côté backend)
  createBillet(payload: { reservationId: number; clientId: number }): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/create`, payload).pipe(
      map(response => response.data)
    );
  }

  getBilletByReservation(reservationId: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/reservation/${reservationId}`).pipe(
      map(response => response.data)
    );
  }

  getBilletByNumero(numeroBillet: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/numero/${numeroBillet}`).pipe(
      map(response => response.data)
    );
  }

  // Récupère le PDF sous forme de Blob (binaire brut)
  downloadBilletPdf(numeroBillet: string): Observable<Blob> {
    return this.http.get(`${this.apiUrl}/pdf/${numeroBillet}`, {
      responseType: 'blob'
    });
  }
}