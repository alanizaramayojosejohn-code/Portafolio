import { ChangeDetectionStrategy, Component, computed, effect, inject } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';
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
  private readonly titleService = inject(Title);
  private readonly metaService = inject(Meta);

  private readonly slug = toSignal(
    this.route.paramMap.pipe(map((p) => p.get('slug'))),
    { initialValue: this.route.snapshot.paramMap.get('slug') },
  );

  readonly project = computed(() => {
    const s = this.slug();
    return s ? projectBySlug(s) : undefined;
  });

  constructor() {
    effect(() => {
      const p = this.project();
      if (p) {
        this.titleService.setTitle(`${p.title} | José Alaniz - Desarrollador de Software`);
        this.metaService.updateTag({ name: 'description', content: p.description });
      }
    });
  }
}
