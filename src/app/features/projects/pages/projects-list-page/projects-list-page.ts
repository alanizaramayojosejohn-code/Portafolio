import { ChangeDetectionStrategy, Component } from '@angular/core';
import { PROJECTS } from '../../../../data/projects.data';

@Component({
  selector: 'app-projects-list-page',
  imports: [],
  templateUrl: './projects-list-page.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class ProjectsListPageComponent {
  readonly projects = PROJECTS;
}
