import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: async () => {
      const { default: HomePageComponent } = await import('./features/home/pages/home-page/home-page');
      return HomePageComponent;
    },
  },
  {
    path: 'sobre-mi',
    loadComponent: async () => {
      const { default: AboutPageComponent } = await import('./features/about/pages/about-page/about-page');
      return AboutPageComponent;
    },
  },
  {
    path: 'proyectos',
    loadComponent: async () => {
      const { default: ProjectsListPageComponent } = await import('./features/projects/pages/projects-list-page/projects-list-page');
      return ProjectsListPageComponent;
    },
  },
  {
    path: 'proyectos/:slug',
    loadComponent: async () => {
      const { default: ProjectDetailPageComponent } = await import('./features/projects/pages/project-detail-page/project-detail-page');
      return ProjectDetailPageComponent;
    },
  },
  {
    path: 'experiencia',
    loadComponent: async () => {
      const { default: ExperienceListPageComponent } = await import('./features/experience/pages/experience-list-page/experience-list-page');
      return ExperienceListPageComponent;
    },
  },
  {
    path: 'contacto',
    loadComponent: async () => {
      const { default: ContactPageComponent } = await import('./features/contact/pages/contact-page/contact-page');
      return ContactPageComponent;
    },
  },
  { path: '**', redirectTo: '' },
];