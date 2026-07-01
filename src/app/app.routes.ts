import { Routes } from '@angular/router';
import { Login } from './pages/login/login';
import { Layout } from './components/layout/layout';
import { Accueil } from './pages/accueil/accueil';
import { List } from './pages/reservation/list/list';
import { Form } from './pages/reservation/form/form';
import { Confirmation } from './pages/reservation/confirmation/confirmation';
import { Ticket } from './pages/reservation/ticket/ticket';

export const routes: Routes = [
  { path: '', component: Login },
  { path: 'accueil', component: Accueil },
  { path: 'login', component: Login },
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
      { path: 'statistiques', loadComponent: () => import('./pages/statistiques/statistiques').then(m => m.Statistiques) },
      { path: 'rapports', loadComponent: () => import('./pages/rapports/rapports').then(m => m.Rapports) },
      { path: 'reservations', component: List },
      { path: 'reserver', component: Form },
      { path: 'confirmation', component: Confirmation },
      { path: 'ticket', component: Ticket },
    ]
  },
];