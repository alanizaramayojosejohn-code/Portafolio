import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { HeaderComponent } from '../../../components/header/container/component';

interface Project {
  title: string;
  description: string;
  technologies: string[];
  link: string;
  image: string;
}

@Component({
  selector: 'app-project',
  imports: [HeaderComponent],
  templateUrl: './component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class ProjectComponent {
  projects = signal<Project[]>([
    {
      title: 'Sistema de Inventario y Mantenimiento',
      description:
        'Sistema web para controlar equipos y reportes de mantenimiento en laboratorios de programación.',
      technologies: ['C#', 'SQLite', 'HTML/CSS'],
      link: 'https://github.com/JoseJ57/vicu2/tree/Jose',
      image: 'images/github.webp',
    },
    {
      title: 'Sistema de Asistencia MMA',
      description:
        'Aplicación para registrar asistencia y gestionar clases en una academia de artes marciales.',
      technologies: ['PHP', 'MySQL', 'Bootstrap'],
      link: 'https://github.com/JoseJ57/Helluz',
      image: 'images/github.webp',
    },
    {
      title: 'Sistema de Ventas con Sucursales',
      description:
        'Colaboré en un sistema de ventas con múltiples sucursales y un almacén general usando Laravel y React.',
      technologies: ['Laravel', 'React', 'MySQL'],
      link: '',
      image: 'images/gitlab.webp',
    },
  ]);
}
