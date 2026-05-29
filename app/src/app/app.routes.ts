import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./features/gallery/demo-gallery.component').then((m) => m.DemoGalleryComponent),
  },
  {
    path: 'about',
    loadComponent: () =>
      import('./features/about/about.component').then((m) => m.AboutComponent),
  },
  {
    path: 'demo',
    loadChildren: () =>
      import('./features/demo-entry/demo-entry.routes').then((m) => m.DEMO_ENTRY_ROUTES),
  },
  { path: '**', redirectTo: '' },
];
