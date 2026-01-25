import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {
  protected readonly title = signal('Portafolio');

  private router = inject(Router);
  private analytics = inject(Analytics);

  constructor() {
    this.router.events
      .pipe(filter(e => e instanceof NavigationEnd))
      .subscribe((e: NavigationEnd) => {
        logEvent(this.analytics, 'page_view', {
          page_path: e.urlAfterRedirects
        });
      });
  }
}
