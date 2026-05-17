import { ChangeDetectionStrategy, Component, inject, signal, PLATFORM_ID, effect, HostListener } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { NavigationEnd, Router, RouterLink, RouterLinkActive } from '@angular/router';
import { filter } from 'rxjs';
import { isPlatformBrowser } from '@angular/common';
import { ThemeToggle } from '../../../components/theme-toggle/theme-toggle';

interface NavLink {
  label: string;
  path: string;
}

@Component({
  selector: 'app-site-header',
  imports: [RouterLink, RouterLinkActive, ThemeToggle],
  templateUrl: './site-header.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SiteHeaderComponent {
  private readonly router = inject(Router);
  private readonly platformId = inject(PLATFORM_ID);

  readonly links: NavLink[] = [
    { label: 'Inicio', path: '/' },
    { label: 'Sobre mí', path: '/sobre-mi' },
    { label: 'Proyectos', path: '/proyectos' },
    { label: 'Experiencia', path: '/experiencia' },
    { label: 'Contacto', path: '/contacto' },
  ];

  protected readonly menuOpen = signal(false);
  readonly scrolled = signal(false);

  constructor() {
    this.router.events
      .pipe(
        filter((e): e is NavigationEnd => e instanceof NavigationEnd),
        takeUntilDestroyed(),
      )
      .subscribe(() => this.menuOpen.set(false));

    if (isPlatformBrowser(this.platformId)) {
      this.scrolled.set(window.scrollY > 20);
    }
  }

  @HostListener('window:scroll')
  onScroll(): void {
    this.scrolled.set(window.scrollY > 20);
  }

  toggleMenu(): void {
    this.menuOpen.update((v) => !v);
  }

  closeMenu(): void {
    this.menuOpen.set(false);
  }
}
