import { ChangeDetectionStrategy, Component, signal } from '@angular/core';

@Component({
  selector: 'app-skill',
  imports: [],
  templateUrl: './component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SkillComponent {
  technicalSkills = signal<string[]>([
    'HTML', 'CSS', 'JavaScript', 'C#', 'PHP', 'C++',
    'MySQL', 'Oracle', 'React', 'Visual Studio', 'Visual Studio Code'
  ]);

  softSkills = signal<string[]>([
    'Liderazgo', 'Trabajo en equipo', 'Comunicación Efectiva',
    'Creatividad', 'Responsabilidad'
  ]);}
