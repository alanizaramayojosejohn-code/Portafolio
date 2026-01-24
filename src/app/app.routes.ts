import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path:'',
    loadComponent: async () => await import('./ui/Index/container/component')
  },
  {
    path: 'experiencia',
    loadComponent: async () => await import('./ui/Index/pages/experience/container/component')
  },
  {
    path: 'proyectos',
    loadComponent:async () => await import('./ui/Index/pages/project/container/component')
  }
];
