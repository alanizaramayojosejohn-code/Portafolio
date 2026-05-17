import { ChangeDetectionStrategy, Component } from '@angular/core';
import { EXPERIENCE } from '../../../../data/experience.data';

@Component({
  selector: 'app-experience-list-page',
  imports: [],
  templateUrl: './experience-list-page.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class ExperienceListPageComponent {
  readonly experiences = EXPERIENCE;
}
