import { Routes } from '@angular/router';
import { List } from './pages/reservation/list/list';
import { Form } from './pages/reservation/form/form';
import { Confirmation } from './pages/reservation/confirmation/confirmation';

export const routes: Routes = [
  { path: '', redirectTo: 'reservations', pathMatch: 'full' },
  { path: 'reservations', component: List },
  { path: 'reserver', component: Form },
  { path: 'confirmation', component: Confirmation },
];