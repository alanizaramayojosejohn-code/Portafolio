import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  ElementRef,
  OnDestroy,
  PLATFORM_ID,
  ViewChild,
  inject,
} from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { filter } from 'rxjs';
import { SiteHeaderComponent } from '../site-header/site-header';
import { SiteFooterComponent } from '../site-footer/site-footer';

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  baseOpacity: number;
  opacity: number;
}

@Component({
  selector: 'app-portfolio-shell',
  imports: [RouterOutlet, SiteHeaderComponent, SiteFooterComponent],
  templateUrl: './portfolio-shell.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class PortfolioShellComponent implements AfterViewInit, OnDestroy {
  @ViewChild('cursorDot') private cursorDot!: ElementRef<HTMLDivElement>;
  @ViewChild('particleCanvas') private particleCanvas!: ElementRef<HTMLCanvasElement>;

  private readonly platformId = inject(PLATFORM_ID);
  private readonly router = inject(Router);
  private readonly destroyRef = inject(DestroyRef);

  private mouseX = -9999;
  private mouseY = -9999;
  private rafId?: number;
  private particles: Particle[] = [];
  private ctx: CanvasRenderingContext2D | null = null;
  private scrollObserver?: IntersectionObserver;

  private readonly PARTICLE_COUNT = 140;
  private readonly CONNECTION_DIST = 135;
  private readonly MOUSE_DIST = 200;

  private readonly onMove = (e: MouseEvent) => {
    this.mouseX = e.clientX;
    this.mouseY = e.clientY;
    const dot = this.cursorDot.nativeElement;
    dot.style.transform = `translate(${e.clientX}px, ${e.clientY}px)`;
    dot.style.opacity = '1';
  };

  private readonly onResize = () => {
    const canvas = this.particleCanvas.nativeElement;
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  };

  ngAfterViewInit() {
    if (!isPlatformBrowser(this.platformId)) return;

    const canvas = this.particleCanvas.nativeElement;
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    this.ctx = canvas.getContext('2d');

    this.initParticles();
    document.addEventListener('mousemove', this.onMove);
    window.addEventListener('resize', this.onResize);
    this.tick();
    this.initScrollObserver();
  }

  ngOnDestroy() {
    if (!isPlatformBrowser(this.platformId)) return;
    document.removeEventListener('mousemove', this.onMove);
    window.removeEventListener('resize', this.onResize);
    if (this.rafId !== undefined) cancelAnimationFrame(this.rafId);
    this.scrollObserver?.disconnect();
  }

  // ── Scroll animation observer ───────────────────────────────

  private initScrollObserver() {
    this.scrollObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            this.scrollObserver!.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: '0px 0px -55px 0px' },
    );

    const observeAll = () => {
      document.querySelectorAll('[data-anim]:not(.is-visible)').forEach((el) => {
        this.scrollObserver!.observe(el);
      });
    };

    // Initial pass — wait for first render
    setTimeout(observeAll, 120);

    // Re-run after each route change (lazy-loaded pages)
    this.router.events
      .pipe(
        filter((e) => e instanceof NavigationEnd),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe(() => setTimeout(observeAll, 150));
  }

  // ── Particle system ─────────────────────────────────────────

  private initParticles() {
    const w = window.innerWidth;
    const h = window.innerHeight;
    this.particles = Array.from({ length: this.PARTICLE_COUNT }, () => {
      const base = Math.random() * 0.28 + 0.07;
      return {
        x: Math.random() * w,
        y: Math.random() * h,
        vx: (Math.random() - 0.5) * 0.45,
        vy: (Math.random() - 0.5) * 0.45,
        radius: Math.random() * 1.4 + 0.5,
        baseOpacity: base,
        opacity: base,
      };
    });
  }

  private updateParticles() {
    const w = window.innerWidth;
    const h = window.innerHeight;

    for (const p of this.particles) {
      const dx = this.mouseX - p.x;
      const dy = this.mouseY - p.y;
      const dist = Math.sqrt(dx * dx + dy * dy);

      if (dist < this.MOUSE_DIST && dist > 1) {
        const force = (this.MOUSE_DIST - dist) / this.MOUSE_DIST;
        p.vx += (dx / dist) * force * 0.065;
        p.vy += (dy / dist) * force * 0.065;
        p.opacity = Math.min(p.baseOpacity + force * 0.7, 0.92);
      } else {
        p.opacity += (p.baseOpacity - p.opacity) * 0.035;
      }

      const speed = Math.sqrt(p.vx * p.vx + p.vy * p.vy);
      if (speed > 4.5) {
        p.vx = (p.vx / speed) * 4.5;
        p.vy = (p.vy / speed) * 4.5;
      }
      p.vx *= 0.95;
      p.vy *= 0.95;

      p.x += p.vx;
      p.y += p.vy;

      if (p.x < -12) p.x = w + 12;
      if (p.x > w + 12) p.x = -12;
      if (p.y < -12) p.y = h + 12;
      if (p.y > h + 12) p.y = -12;
    }
  }

  private drawParticles() {
    if (!this.ctx) return;
    const ctx = this.ctx;
    const { width, height } = this.particleCanvas.nativeElement;
    ctx.clearRect(0, 0, width, height);

    const distSqLimit = this.CONNECTION_DIST * this.CONNECTION_DIST;

    for (let i = 0; i < this.particles.length; i++) {
      const a = this.particles[i];
      for (let j = i + 1; j < this.particles.length; j++) {
        const b = this.particles[j];
        const dx = a.x - b.x;
        const dy = a.y - b.y;
        const dSq = dx * dx + dy * dy;
        if (dSq < distSqLimit) {
          const ratio = 1 - Math.sqrt(dSq) / this.CONNECTION_DIST;
          const alpha = ratio * Math.min(a.opacity, b.opacity) * 0.75;
          ctx.beginPath();
          ctx.moveTo(a.x, a.y);
          ctx.lineTo(b.x, b.y);
          ctx.strokeStyle = `rgba(249,115,22,${alpha.toFixed(3)})`;
          ctx.lineWidth = 0.6;
          ctx.stroke();
        }
      }
    }

    for (const p of this.particles) {
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.radius * 3.5, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(249,115,22,${(p.opacity * 0.1).toFixed(3)})`;
      ctx.fill();

      ctx.beginPath();
      ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(249,115,22,${p.opacity.toFixed(3)})`;
      ctx.fill();
    }
  }

  private tick() {
    this.updateParticles();
    this.drawParticles();
    this.rafId = requestAnimationFrame(() => this.tick());
  }
}
