import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { PROFILE } from '../../../../data/profile.data';
import { PROJECTS } from '../../../../data/projects.data';
import { EXPERIENCE } from '../../../../data/experience.data';
import { ContactService } from '../../../../services/contact/contact.service';

@Component({
  selector: 'app-home-page',
  imports: [RouterLink],
  templateUrl: './home-page.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class HomePageComponent {
  readonly profile = PROFILE;
  readonly featuredProjects = computed(() => PROJECTS.slice(0, 3));
  readonly allProjects = PROJECTS;
  readonly experiences = EXPERIENCE;
  readonly showAllProjects = signal(false);
  readonly showAllExperiences = signal(false);

  get displayedProjects() {
    return this.showAllProjects() ? this.allProjects : this.featuredProjects();
  }

  get displayedExperiences() {
    return this.showAllExperiences() ? this.experiences : this.experiences.slice(0, 3);
  }

  readonly techStack = [
    {
      category: 'Frontend',
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
      category: 'Backend & APIs',
      skills: [
        { name: '.NET', icon: 'icons/tech_stack/dotnet.svg' },
        { name: 'NestJS', icon: 'icons/tech_stack/nestjs.svg' },
        { name: 'Postman', icon: 'icons/tech_stack/postman.svg' },
      ],
    },
    {
      category: 'Base de datos & Cloud',
      skills: [
        { name: 'Firebase', icon: 'icons/tech_stack/firebase-wordmark.svg', ai: true },
        { name: 'Supabase', icon: 'icons/tech_stack/supabase.svg', ai: true },
        { name: 'PostgreSQL', icon: 'icons/tech_stack/postgresql.svg' },
        { name: 'SQL Server', icon: 'icons/tech_stack/sql-server.svg' },
        { name: 'SQLite', icon: 'icons/tech_stack/sqlite.svg' },
      ],
    },
    {
      category: 'Mobile & Tools',
      skills: [
        { name: 'Flutter', icon: 'icons/tech_stack/flutter.svg' },
        { name: 'Google Analytics', icon: 'icons/tech_stack/google-analytics.svg' },
        { name: 'Canva', icon: 'icons/tech_stack/canva.svg' },
      ],
    },
    {
      category: 'IA & Dev Tools',
      skills: [
        { name: 'Claude AI', icon: 'icons/tech_stack/claude-ai-icon.svg', ai: true },
        { name: 'Cursor', icon: 'icons/tech_stack/cursor_light.svg', ai: true },
        { name: 'OpenCode', icon: 'icons/tech_stack/opencode.svg', ai: true },
        { name: 'Antigravity', icon: 'icons/tech_stack/antigravity.svg', ai: true },
      ],
    },
  ];

  private contactService = inject(ContactService);
  readonly isSubmitting = signal(false);
  readonly submitSuccess = signal(false);
  readonly submitError = signal(false);
  readonly messageLength = signal(0);

  scrollToSection(sectionId: string) {
    document.getElementById(sectionId)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  onMessageInput(event: Event) {
    this.messageLength.set((event.target as HTMLTextAreaElement).value.length);
  }

  async onSubmit(event: Event) {
    event.preventDefault();
    const form = event.target as HTMLFormElement;
    const formData = new FormData(form);

    this.isSubmitting.set(true);
    this.submitSuccess.set(false);
    this.submitError.set(false);

    try {
      await this.contactService.sendMessage({
        name: formData.get('name') as string,
        email: formData.get('email') as string,
        message: formData.get('message') as string,
      });
      this.submitSuccess.set(true);
      this.messageLength.set(0);
      form.reset();
      setTimeout(() => this.submitSuccess.set(false), 6000);
    } catch (error) {
      console.error('Error sending message:', error);
      this.submitError.set(true);
    } finally {
      this.isSubmitting.set(false);
    }
  }
}
