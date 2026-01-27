import { Component, inject, PLATFORM_ID, signal } from '@angular/core';
import { Analytics, logEvent } from '@angular/fire/analytics';
import { NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { filter } from 'rxjs';
import { AnalyticsService } from './services/analytics/analytics.service';
import { isPlatformBrowser } from '@angular/common';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {
  protected readonly title = signal('Portafolio');

  private router = inject(Router);
  private platformId = inject(PLATFORM_ID);
  private analyticsService = inject(AnalyticsService);
  private analytics = isPlatformBrowser(this.platformId) ? inject(Analytics) : null;

  constructor() {
    if (this.analytics) {
      // Ejecutar en el próximo ciclo para evitar el warning
      setTimeout(() => {
        logEvent(this.analytics!, 'test_event');

        this.router.events
          .pipe(filter((e) => e instanceof NavigationEnd))
          .subscribe((e: NavigationEnd) => {
            logEvent(this.analytics!, 'page_view', {
              page_path: e.urlAfterRedirects,
            });
          });

        this.analyticsService.logEvent('app_initialized', {
          timestamp: new Date().toISOString(),
        });
      }, 0);
    }
  }
}
