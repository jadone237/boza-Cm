import { List } from './pages/reservation/list/list';
import { Form } from './pages/reservation/form/form';
import { Confirmation } from './pages/reservation/confirmation/confirmation';
import { Ticket } from './pages/reservation/ticket/ticket';
export const routes: Routes = [
  { path: '', redirectTo: 'reservations', pathMatch: 'full' },
  { path: 'reservations', component: List },
  { path: 'reserver', component: Form },
  { path: 'confirmation', component: Confirmation },
  { path: 'ticket', component: Ticket },
>>>>>>> origin/feature/reservation
];
=======
import { List } from './pages/reservation/list/list';
import { Form } from './pages/reservation/form/form';
import { Confirmation } from './pages/reservation/confirmation/confirmation';
import { Ticket } from './pages/reservation/ticket/ticket';
export const routes: Routes = [
  { path: '', redirectTo: 'reservations', pathMatch: 'full' },
  { path: 'reservations', component: List },
  { path: 'reserver', component: Form },
  { path: 'confirmation', component: Confirmation },
  { path: 'ticket', component: Ticket },
>>>>>>> origin/feature/reservation
];
