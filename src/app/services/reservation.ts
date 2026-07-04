import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, forkJoin, map } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ReservationService {
  private http = inject(HttpClient);
  private baseUrl = 'http://localhost:8080/api/v1/reservations';

  // --- ENREGISTREMENTS ---
  // Chaque type de transport exige, en plus de clientId/offreId, des champs
  // spécifiques imposés par le backend (voir ReservationXxxRequestDTO côté Spring Boot).
  createReservationBus(payload: {
    clientId: number;
    offreId: number;
    compagnieBus: string;
    typeBus: 'STANDARD' | 'VIP';
    climatisation: boolean;
  }): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/bus/create`, payload).pipe(
      map(response => response.data)
    );
  }

  createReservationTrain(payload: {
    clientId: number;
    offreId: number;
    compagnieTrain: string;
    numeroWagon: string;
    classeTrain: 'PREMIERE' | 'SECONDE';
  }): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/train/create`, payload).pipe(
      map(response => response.data)
    );
  }

  createReservationAvion(payload: {
    clientId: number;
    offreId: number;
    compagnieAerienne: string;
    numeroVol: string;
    classeAvion: 'ECONOMIE' | 'AFFAIRES' | 'PREMIERE';
    poidsMaxBagages: number;
    numeroTerminal?: string;
  }): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/avion/create`, payload).pipe(
      map(response => response.data)
    );
  }

  // --- CONFIRMATION ---
  // Passe la réservation de EN_ATTENTE à CONFIRMEE (étape requise avant de créer le billet)
  confirmerReservationBus(id: number): Observable<any> {
    return this.http.patch<any>(`${this.baseUrl}/bus/${id}/confirmer`, {}).pipe(map(r => r.data));
  }

  confirmerReservationTrain(id: number): Observable<any> {
    return this.http.patch<any>(`${this.baseUrl}/train/${id}/confirmer`, {}).pipe(map(r => r.data));
  }

  confirmerReservationAvion(id: number): Observable<any> {
    return this.http.patch<any>(`${this.baseUrl}/avion/${id}/confirmer`, {}).pipe(map(r => r.data));
  }

  // --- ANNULATION ---
  annulerReservationBus(id: number): Observable<any> {
    return this.http.patch<any>(`${this.baseUrl}/bus/${id}/annuler`, {}).pipe(map(r => r.data));
  }

  annulerReservationTrain(id: number): Observable<any> {
    return this.http.patch<any>(`${this.baseUrl}/train/${id}/annuler`, {}).pipe(map(r => r.data));
  }

  annulerReservationAvion(id: number): Observable<any> {
    return this.http.patch<any>(`${this.baseUrl}/avion/${id}/annuler`, {}).pipe(map(r => r.data));
  }

  // --- LECTURE TABLEAU DE BORD ADMIN ---
  // Combine les trois types de transport dans une liste unique pour ton composant "list"
  getAllReservations(): Observable<any[]> {
    const bus$ = this.http.get<any>(`${this.baseUrl}/bus/get_all`).pipe(map(r => r.data || []));
    const train$ = this.http.get<any>(`${this.baseUrl}/train/get_all`).pipe(map(r => r.data || []));
    const avion$ = this.http.get<any>(`${this.baseUrl}/avion/get_all`).pipe(map(r => r.data || []));

    return forkJoin([bus$, train$, avion$]).pipe(
      map(([bus, train, avion]) => {
        const mappedBus = bus.map((item: any) => ({ ...item, type: 'bus' }));
        const mappedTrain = train.map((item: any) => ({ ...item, type: 'train' }));
        const mappedAvion = avion.map((item: any) => ({ ...item, type: 'avion' }));
        return [...mappedBus, ...mappedTrain, ...mappedAvion];
      })
    );
  }
}