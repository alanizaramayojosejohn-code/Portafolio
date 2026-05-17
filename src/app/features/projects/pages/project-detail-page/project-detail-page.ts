import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { map } from 'rxjs';
import { projectBySlug } from '../../../../data/projects.data';

@Component({
  selector: 'app-project-detail-page',
  imports: [RouterLink],
  templateUrl: './project-detail-page.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class ProjectDetailPageComponent {
  private readonly route = inject(ActivatedRoute);

  private readonly slug = toSignal(
    this.route.paramMap.pipe(map((p) => p.get('slug'))),
    { initialValue: this.route.snapshot.paramMap.get('slug') },
  );

  readonly project = computed(() => {
    const s = this.slug();
    return s ? projectBySlug(s) : undefined;
  });
}
