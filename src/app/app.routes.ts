import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: async () => await import('./ui/portfolio/container/component'),
  },
  {
    path: 'experiencia',
    loadComponent: async () => await import('./ui/portfolio/pages/experience/container/component'),
  },
  {
    path: 'proyectos',
    loadComponent: async () => await import('./ui/portfolio/pages/projects/container/component'),
  },
];
