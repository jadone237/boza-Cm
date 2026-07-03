import { Routes } from '@angular/router';
import { Login } from './pages/login/login';
import { Layout } from './components/layout/layout';
import { Accueil } from './pages/accueil/accueil';

// Importation des composants de réservation
import { List as ResList } from './pages/reservation/list/list';
import { Form as ResForm } from './pages/reservation/form/form';
import { Confirmation as ResConfirm } from './pages/reservation/confirmation/confirmation';
import { Ticket as ResTicket } from './pages/reservation/ticket/ticket';

export const routes: Routes = [
  { path: '', component: Login },
  { path: 'login', component: Login },
  { path: 'accueil', component: Accueil },

  // Routes Réservations
  { path: 'reservations', component: ResList },
  { path: 'reserver', component: ResForm },
  { path: 'confirmation', component: ResConfirm },
  { path: 'ticket', component: ResTicket },

  // Dashboard (Admin)
  {
    path: 'dashboard',
    component: Layout,
    children: [
      { path: '', redirectTo: 'agences', pathMatch: 'full' },
      { path: 'agences', loadComponent: () => import('./pages/agences/list/list').then(m => m.List) },
      { path: 'agences/form', loadComponent: () => import('./pages/agences/form/form').then(m => m.Form) },
      { path: 'agences/form/:id', loadComponent: () => import('./pages/agences/form/form').then(m => m.Form) },
      { path: 'trajets', loadComponent: () => import('./pages/trajets/list/list').then(m => m.List) },
      { path: 'trajets/form', loadComponent: () => import('./pages/trajets/form/form').then(m => m.Form) },
      { path: 'trajets/form/:id', loadComponent: () => import('./pages/trajets/form/form').then(m => m.Form) },
      { path: 'offres', loadComponent: () => import('./pages/offres/list/list').then(m => m.List) },
      { path: 'offres/form', loadComponent: () => import('./pages/offres/form/form').then(m => m.Form) },
      { path: 'offres/form/:id', loadComponent: () => import('./pages/offres/form/form').then(m => m.Form) },
      { path: 'reservations', loadComponent: () => import('./pages/reservation/list/list').then(m => m.List) },
      { path: 'statistiques', loadComponent: () => import('./pages/statistiques/statistiques').then(m => m.Statistiques) },
      { path: 'rapports', loadComponent: () => import('./pages/rapports/rapports').then(m => m.Rapports) },
      { path: 'reservations/form', loadComponent: () => import('./pages/reservation/form/form').then(m => m.Form) },
      { path: 'reservations/form/:id', loadComponent: () => import('./pages/reservation/form/form').then(m => m.Form) },
    ]
  },
];