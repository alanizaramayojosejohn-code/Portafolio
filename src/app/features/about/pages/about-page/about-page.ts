import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';
import { Router, RouterLink } from '@angular/router';
import { AnalyticsService } from '../../../../services/analytics/analytics.service';
import { PROFILE } from '../../../../data/profile.data';

interface TechSkill {
  name: string;
  icon: string;
  ai?: boolean;
}

interface TechCategory {
  name: string;
  skills: TechSkill[];
}

@Component({
  selector: 'app-about-page',
  imports: [RouterLink],
  templateUrl: './about-page.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class AboutPageComponent {
  private readonly analytics = inject(AnalyticsService);
  private readonly router = inject(Router);

  constructor() {
    inject(Title).setTitle('Sobre mí | José Alaniz - Desarrollador de Software');
    inject(Meta).updateTag({ name: 'description', content: 'Conoce más sobre José John Alaniz Aramayo: estudiante de Ingeniería Informática en Bolivia, especializado en Angular, Firebase, Flutter y desarrollo de software profesional.' });
  }

  readonly profile = PROFILE;

  readonly techStack: TechCategory[] = [
    {
      name: 'Frontend',
      skills: [
        { name: 'Angular', icon: 'icons/tech_stack/angular.svg', ai: true },
        { name: 'Vue', icon: 'icons/tech_stack/vue.svg', ai: true },
        { name: 'React', icon: 'icons/tech_stack/react_dark.svg' },
        { name: 'Next.js', icon: 'icons/tech_stack/nextjs_icon_dark.svg' },
        { name: 'TypeScript', icon: 'icons/tech_stack/typescript.svg' },
        { name: 'HTML5', icon: 'icons/tech_stack/html5.svg' },
        { name: 'CSS', icon: 'icons/tech_stack/css_old.svg' },
        { name: 'Tailwind CSS', icon: 'icons/tech_stack/tailwindcss.svg' },
        { name: 'Bootstrap', icon: 'icons/tech_stack/bootstrap.svg' },
      ],
    },
    {
      name: 'Backend & APIs',
      skills: [
        { name: '.NET', icon: 'icons/tech_stack/dotnet.svg' },
        { name: 'NestJS', icon: 'icons/tech_stack/nestjs.svg' },
        { name: 'Postman', icon: 'icons/tech_stack/postman.svg' },
      ],
    },
    {
      name: 'Base de datos & Cloud',
      skills: [
        { name: 'Firebase', icon: 'icons/tech_stack/firebase-wordmark.svg', ai: true },
        { name: 'Supabase', icon: 'icons/tech_stack/supabase.svg', ai: true },
        { name: 'PostgreSQL', icon: 'icons/tech_stack/postgresql.svg' },
        { name: 'SQL Server', icon: 'icons/tech_stack/sql-server.svg' },
        { name: 'SQLite', icon: 'icons/tech_stack/sqlite.svg' },
      ],
    },
    {
      name: 'Mobile & Tools',
      skills: [
        { name: 'Flutter', icon: 'icons/tech_stack/flutter.svg' },
        { name: 'Google Analytics', icon: 'icons/tech_stack/google-analytics.svg' },
        { name: 'Canva', icon: 'icons/tech_stack/canva.svg' },
      ],
    },
    {
      name: 'IA & Dev Tools',
      skills: [
        { name: 'Claude AI', icon: 'icons/tech_stack/claude-ai-icon.svg', ai: true },
        { name: 'Cursor', icon: 'icons/tech_stack/cursor_light.svg', ai: true },
        { name: 'OpenCode', icon: 'icons/tech_stack/opencode.svg', ai: true },
        { name: 'Antigravity', icon: 'icons/tech_stack/antigravity.svg', ai: true },
      ],
    },
  ];

  readonly softSkills = signal<string[]>([
    'Liderazgo',
    'Trabajo en equipo',
    'Comunicación efectiva',
    'Creatividad',
    'Responsabilidad',
    'Adaptabilidad',
  ]);

  trackProjectsNav(event: Event): void {
    event.preventDefault();
    this.analytics.logEvent('link_click', {
      link_name: 'proyectos_inline_about',
      link_destination: '/proyectos',
      timestamp: new Date().toISOString(),
    });
    void this.router.navigateByUrl('/proyectos');
  }
}
