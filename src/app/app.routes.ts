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
      { path: 'trajets', loadComponent: () => import('./pages/trajets/list/list').then(m => m.List) },
      { path: 'offres', loadComponent: () => import('./pages/offres/list/list').then(m => m.List) },
    ]
  },
];