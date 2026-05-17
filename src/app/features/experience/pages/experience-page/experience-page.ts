import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { EXPERIENCE } from '../../../../data/experience.data';

@Component({
  selector: 'app-experience-page',
  imports: [],
  templateUrl: './experience-page.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class ExperiencePageComponent {
  readonly experiences = signal(EXPERIENCE);
}
