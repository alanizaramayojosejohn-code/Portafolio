import { RenderMode, ServerRoute } from '@angular/ssr';
import { PROJECT_SLUGS } from './data/projects.data';

export const serverRoutes: ServerRoute[] = [
  {
    path: 'sobre-mi',
    renderMode: RenderMode.Prerender,
  },
  {
    path: 'proyectos',
    renderMode: RenderMode.Prerender,
  },
  {
    path: 'proyectos/:slug',
    renderMode: RenderMode.Prerender,
    getPrerenderParams: async () => PROJECT_SLUGS.map((slug) => ({ slug })),
  },
  {
    path: 'experiencia',
    renderMode: RenderMode.Prerender,
  },
  {
    path: 'contacto',
    renderMode: RenderMode.Prerender,
  },
  {
    path: '**',
    renderMode: RenderMode.Prerender,
  },
];