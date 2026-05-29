import { Routes } from '@angular/router';

export const HAULAGE_DES_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./haulage-des-shell.component').then((m) => m.HaulageDesShellComponent),
  },
];
