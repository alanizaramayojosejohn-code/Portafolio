import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';
import { EXPERIENCE } from '../../../../data/experience.data';

@Component({
  selector: 'app-experience-list-page',
  imports: [],
  templateUrl: './experience-list-page.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class ExperienceListPageComponent {
  readonly experiences = EXPERIENCE;

  constructor() {
    inject(Title).setTitle('Experiencia | José Alaniz - Desarrollador de Software');
    inject(Meta).updateTag({ name: 'description', content: 'Experiencia académica y profesional de José Alaniz: proyectos universitarios, trabajo en equipo con metodologías ágiles y desarrollo de software en Bolivia.' });
  }
}
