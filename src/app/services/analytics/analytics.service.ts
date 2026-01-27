import { inject, Injectable } from '@angular/core';
import { Analytics, logEvent } from '@angular/fire/analytics';
@Injectable({
  providedIn: 'root',
})
export class AnalyticsService {

  private analytics: Analytics | null = null;

  constructor() {
  if (typeof window !== 'undefined') {
      this.analytics = inject(Analytics);
    }
  }

  logEvent(eventName: string, eventParams?: { [key: string]: any }) {
    if (this.analytics) {
      logEvent(this.analytics, eventName, eventParams);
    }
  }

  logPageView(pageName: string) {
    this.logEvent('page_view', { page_title: pageName });
  }
}
