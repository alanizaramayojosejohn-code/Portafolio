import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';
import { PROFILE } from '../../../../data/profile.data';
import { ContactService } from '../../../../services/contact/contact.service';

@Component({
  selector: 'app-contact-page',
  imports: [],
  templateUrl: './contact-page.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class ContactPageComponent {
  readonly profile = PROFILE;

  private readonly contactService = inject(ContactService);

  constructor() {
    inject(Title).setTitle('Contacto | José Alaniz - Desarrollador de Software');
    inject(Meta).updateTag({ name: 'description', content: 'Contáctame para proyectos académicos, prácticas profesionales o colaboraciones. Respondo por LinkedIn o GitHub en menos de 24 horas.' });
  }
  readonly isSubmitting = signal(false);
  readonly submitSuccess = signal(false);
  readonly submitError = signal(false);
  readonly messageLength = signal(0);

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
