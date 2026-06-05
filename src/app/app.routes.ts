import { Routes } from '@angular/router';
import { Login } from './pages/login/login';
import { Layout } from './components/layout/layout';
import { Accueil } from './pages/accueil/accueil';

export const routes: Routes = [
  { path: '', component: Accueil },
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
    ]
  },
];