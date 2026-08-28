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

  /** Max rotation applied to a hovered card, in degrees. */
  private readonly TILT_MAX_DEG = 6;
  /** How far a magnetic button drifts toward the cursor, in px. */
  private readonly MAGNET_MAX_PX = 7;

  private reducedMotion = false;
  private finePointer = true;
  private activeCard: HTMLElement | null = null;
  private activeCardRect: DOMRect | null = null;
  private activeMagnet: HTMLElement | null = null;
  private activeMagnetRect: DOMRect | null = null;

  private readonly onMove = (e: MouseEvent) => {
    this.mouseX = e.clientX;
    this.mouseY = e.clientY;
    const dot = this.cursorDot.nativeElement;
    dot.style.transform = `translate(${e.clientX}px, ${e.clientY}px)`;
    dot.style.opacity = '1';
    this.updateTilt(e);
    this.updateMagnet(e);
  };

  private readonly onResize = () => {
    const canvas = this.particleCanvas.nativeElement;
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    // Cached rects are stale after a resize — recompute on next hover.
    this.releaseCard();
    this.releaseMagnet();
  };

  /**
   * `mouseover` bubbles and fires on every element the pointer enters, so a
   * single delegated listener covers both entering and leaving a card.
   */
  private readonly onOver = (e: MouseEvent) => {
    const target = e.target as HTMLElement | null;
    if (!target?.closest) return;

    const card = target.closest<HTMLElement>('.tilt-card');
    if (card !== this.activeCard) {
      this.releaseCard();
      if (card) {
        this.activeCard = card;
        this.activeCardRect = card.getBoundingClientRect();
        card.classList.add('is-tilting');
      }
    }

    const magnet = target.closest<HTMLElement>('.btn-primary, .btn-secondary');
    if (magnet !== this.activeMagnet) {
      this.releaseMagnet();
      if (magnet) {
        this.activeMagnet = magnet;
        this.activeMagnetRect = magnet.getBoundingClientRect();
      }
    }
  };

  private readonly onDocumentLeave = () => {
    this.releaseCard();
    this.releaseMagnet();
  };

  ngAfterViewInit() {
    if (!isPlatformBrowser(this.platformId)) return;

    this.reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    this.finePointer = window.matchMedia('(pointer: fine)').matches;

    const canvas = this.particleCanvas.nativeElement;
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    this.ctx = canvas.getContext('2d');

    this.initParticles();
    document.addEventListener('mousemove', this.onMove);
    window.addEventListener('resize', this.onResize);

    if (this.canHover()) {
      document.addEventListener('mouseover', this.onOver, { passive: true });
      document.addEventListener('mouseleave', this.onDocumentLeave);
    }

    this.tick();
    this.initScrollObserver();
  }

  ngOnDestroy() {
    if (!isPlatformBrowser(this.platformId)) return;
    document.removeEventListener('mousemove', this.onMove);
    window.removeEventListener('resize', this.onResize);
    document.removeEventListener('mouseover', this.onOver);
    document.removeEventListener('mouseleave', this.onDocumentLeave);
    if (this.rafId !== undefined) cancelAnimationFrame(this.rafId);
    this.scrollObserver?.disconnect();
  }

  private canHover(): boolean {
    return this.finePointer && !this.reducedMotion;
  }

  // ── Card tilt + cursor spotlight ────────────────────────────

  private updateTilt(e: MouseEvent) {
    const card = this.activeCard;
    const rect = this.activeCardRect;
    if (!card || !rect) return;

    const px = (e.clientX - rect.left) / rect.width;
    const py = (e.clientY - rect.top) / rect.height;

    card.style.setProperty('--mx', `${(px * 100).toFixed(2)}%`);
    card.style.setProperty('--my', `${(py * 100).toFixed(2)}%`);

    const rotateX = (0.5 - py) * 2 * this.TILT_MAX_DEG;
    const rotateY = (px - 0.5) * 2 * this.TILT_MAX_DEG;
    card.style.transform =
      `perspective(900px) rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg) ` +
      `translateY(-6px) scale(1.015)`;
  }

  private releaseCard() {
    const card = this.activeCard;
    if (!card) return;
    card.classList.remove('is-tilting');
    card.style.transform = '';
    card.style.removeProperty('--mx');
    card.style.removeProperty('--my');
    this.activeCard = null;
    this.activeCardRect = null;
  }

  // ── Magnetic buttons ────────────────────────────────────────

  private updateMagnet(e: MouseEvent) {
    const btn = this.activeMagnet;
    const rect = this.activeMagnetRect;
    if (!btn || !rect) return;

    const dx = (e.clientX - (rect.left + rect.width / 2)) / (rect.width / 2);
    const dy = (e.clientY - (rect.top + rect.height / 2)) / (rect.height / 2);
    const clamp = (v: number) => Math.max(-1, Math.min(1, v)) * this.MAGNET_MAX_PX;

    btn.style.transform = `translate(${clamp(dx).toFixed(2)}px, ${(clamp(dy) - 2).toFixed(2)}px)`;
  }

  private releaseMagnet() {
    if (!this.activeMagnet) return;
    this.activeMagnet.style.transform = '';
    this.activeMagnet = null;
    this.activeMagnetRect = null;
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

    const enhance = () => {
      this.splitText();
      this.revealImages();
      document
        .querySelectorAll('[data-anim]:not(.is-visible), [data-split]:not(.is-visible)')
        .forEach((el) => this.scrollObserver!.observe(el));
    };

    // Initial pass — wait for first render
    setTimeout(enhance, 120);

    // Re-run after each route change (lazy-loaded pages)
    this.router.events
      .pipe(
        filter((e) => e instanceof NavigationEnd),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe(() => setTimeout(enhance, 150));
  }

  // ── Per-word / per-letter text reveal ───────────────────────

  /**
   * Wraps every word (or letter, with `data-split="letters"`) of a `[data-split]`
   * element in a staggered span. Runs once per element — the marker attribute
   * keeps route re-scans from re-splitting already-split headings.
   */
  private splitText() {
    document
      .querySelectorAll<HTMLElement>('[data-split]:not([data-split-ready])')
      .forEach((el) => {
        el.setAttribute('data-split-ready', '');

        const perLetter = el.getAttribute('data-split') === 'letters';
        const step = perLetter ? 0.028 : 0.055;

        const walker = document.createTreeWalker(el, NodeFilter.SHOW_TEXT);
        const textNodes: Text[] = [];
        while (walker.nextNode()) textNodes.push(walker.currentNode as Text);

        let index = 0;
        for (const node of textNodes) {
          const text = node.nodeValue ?? '';
          if (!text.trim()) continue;

          const fragment = document.createDocumentFragment();
          const units = perLetter ? Array.from(text) : text.split(/(\s+)/);

          for (const unit of units) {
            if (!unit) continue;
            if (/^\s+$/.test(unit)) {
              fragment.appendChild(document.createTextNode(unit));
              continue;
            }
            const span = document.createElement('span');
            span.className = 'split-word';
            span.textContent = unit;
            span.style.transitionDelay = `${(index++ * step).toFixed(3)}s`;
            fragment.appendChild(span);
          }

          node.parentNode?.replaceChild(fragment, node);
        }
      });
  }

  // ── Blur-up image loading ───────────────────────────────────

  private revealImages() {
    document
      .querySelectorAll<HTMLImageElement>('img.img-reveal:not(.is-loaded)')
      .forEach((img) => {
        if (img.complete && img.naturalWidth > 0) {
          img.classList.add('is-loaded');
          return;
        }
        const done = () => img.classList.add('is-loaded');
        img.addEventListener('load', done, { once: true });
        img.addEventListener('error', done, { once: true });
      });
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
