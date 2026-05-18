import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';
import { PROJECTS } from '../../../../data/projects.data';

@Component({
  selector: 'app-projects-list-page',
  imports: [],
  templateUrl: './projects-list-page.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class ProjectsListPageComponent {
  readonly projects = PROJECTS;

  constructor() {
    inject(Title).setTitle('Proyectos | José Alaniz - Desarrollador de Software');
    inject(Meta).updateTag({ name: 'description', content: 'Proyectos de desarrollo de software de José Alaniz: sistemas de gestión, aplicaciones web y móviles construidas con Angular, Firebase, Flutter, .NET y más.' });
  }
}
