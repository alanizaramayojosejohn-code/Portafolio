import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  HostListener,
  PLATFORM_ID,
  ViewChild,
  inject,
  signal,
} from '@angular/core';
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
  @ViewChild('siteHeader') private headerEl?: ElementRef<HTMLElement>;
  @ViewChild('progressBar') private progressBar?: ElementRef<HTMLElement>;

  private readonly router = inject(Router);
  private readonly platformId = inject(PLATFORM_ID);

  /** Scroll position of the previous event, used to detect direction. */
  private lastScrollY = 0;
  /** Ignore jitter below this many px before flipping the header's visibility. */
  private readonly DIRECTION_THRESHOLD = 6;
  /** Keep the header pinned until the user is past the hero fold. */
  private readonly HIDE_AFTER = 140;

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
      this.lastScrollY = window.scrollY;
    }
  }

  @HostListener('window:scroll')
  onScroll(): void {
    const y = window.scrollY;
    this.scrolled.set(y > 20);
    this.updateProgress(y);
    this.updateVisibility(y);
    this.lastScrollY = y;
  }

  /** Fills the accent bar under the header proportionally to page progress. */
  private updateProgress(y: number): void {
    const bar = this.progressBar?.nativeElement;
    if (!bar) return;

    const scrollable = document.documentElement.scrollHeight - window.innerHeight;
    const ratio = scrollable > 0 ? Math.min(1, Math.max(0, y / scrollable)) : 0;
    bar.style.transform = `scaleX(${ratio.toFixed(4)})`;
  }

  /** Slides the header away when scrolling down, brings it back on scroll up. */
  private updateVisibility(y: number): void {
    const header = this.headerEl?.nativeElement;
    if (!header) return;

    const delta = y - this.lastScrollY;
    if (Math.abs(delta) < this.DIRECTION_THRESHOLD) return;

    // Never hide near the top, or while the mobile menu is open.
    const shouldHide = delta > 0 && y > this.HIDE_AFTER && !this.menuOpen();
    header.classList.toggle('header-hidden', shouldHide);
  }

  toggleMenu(): void {
    this.menuOpen.update((v) => !v);
    if (this.menuOpen()) {
      this.headerEl?.nativeElement.classList.remove('header-hidden');
    }
  }

  closeMenu(): void {
    this.menuOpen.set(false);
  }
}
