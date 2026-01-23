import { ChangeDetectionStrategy, Component, signal } from '@angular/core';

interface Experience {
  period: string;
  title?: string;
  description: string;
  technologies: string[];
  link?: string;
}

@Component({
  selector: 'app-experience',
  imports: [],
  templateUrl: './component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ExperienceComponent {
  experiences = signal<Experience[]>([
    {
      period: '2024-2025',
      description: 'Diseñé varias páginas web usando HTML, CSS y JavaScript, enfocadas en experiencias limpias y modernas. Cada sitio refleja mi interés por crear interfaces atractivas y funcionales, poniendo en práctica lo que aprendo en la universidad.',
      technologies: ['JavaScript', 'HTML', 'React', 'Bootstrap', 'CSS']
    },
    {
      period: 'July — Dec 2024',
      title: 'Desarrollador',
      link: 'https://www.apple.com/apple-music/',
      description: 'Desarrollé un sistema completo para gestionar inventarios y reportes de mantenimiento en laboratorios de programación. Permite llevar un registro de equipos, activos y reparaciones, optimizando el trabajo de los jefes de laboratorio y directores de carrera.',
      technologies: ['HTML', 'CSS', 'Bootstrap', 'JavaScript', 'C#', 'Scrum']
    },
    {
      period: '2025',
      title: 'Developer-Systems analyst',
      link: 'https://scout.camd.northeastern.edu/',
      description: 'Creé un sistema para registrar asistencia y gestionar alumnos de una academia de artes marciales. El sistema facilita el control de clases, horarios y seguimiento de los estudiantes, mostrando cómo la programación puede ayudar a la organización y eficiencia.',
      technologies: ['HTML', 'CSS', 'Bootstrap', 'JavaScript', 'C#', 'Scrum']
    },
    {
      period: '2025',
      title: 'Developer',
      description: 'Colaboré en el desarrollo de un sistema de ventas con gestión de sucursales y almacén general, usando Laravel en el backend y React en el frontend. Participé en la integración de módulos, manejo de API REST y sincronización de inventarios entre sucursales.',
      technologies: ['PHP', 'React', 'JavaScript', 'CSS', 'Iconix']
    }
  ]);
}
