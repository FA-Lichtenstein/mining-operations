import { Routes } from '@angular/router';

export const DEMO_ENTRY_ROUTES: Routes = [
  {
    path: 'haulage-des',
    loadChildren: () =>
      import('../haulage-des/haulage-des.routes').then((m) => m.HAULAGE_DES_ROUTES),
  },
  {
    path: ':demoId',
    loadComponent: () =>
      import('./demo-coming-soon.component').then((m) => m.DemoComingSoonComponent),
  },
];
