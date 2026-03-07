import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { AnalyticsService } from '../../../../../services/analytics/analytics.service';

@Component({
  selector: 'app-about',
  imports: [],
  templateUrl: './component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AboutComponent {
  private analyticsService = inject(AnalyticsService);

  trackProjectsClick(event: Event) {

    event.preventDefault();
    console.log('Click detectado en proyectos');
    this.analyticsService.logEvent('link_click', {
      link_name: 'proyectos_inline',
      link_destination: '/proyectos',
      timestamp: new Date().toISOString(),
    });

  setTimeout(() => {
    window.location.href = '/proyectos';
  }, 200);
  }
}
