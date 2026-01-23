import { ChangeDetectionStrategy, Component, HostListener } from '@angular/core';
import { HeaderComponent } from '../components/header/container/component';
import { AboutComponent } from '../components/about/container/component';
import { ExperienceComponent } from '../components/experience/container/component';
import { ProjectComponent } from '../components/projects/container/component';
import { SkillComponent } from '../components/skill/container/component';

@Component({
  selector: 'app-component',
  imports: [
    HeaderComponent,
    AboutComponent,
    ExperienceComponent,
    ProjectComponent,
    SkillComponent,
  ],
  templateUrl: './component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class IndexComponent {
  mouseX = 492;
  mouseY = 222;

  get lightGradient(): string {
    return `radial-gradient(600px at ${this.mouseX}px ${this.mouseY}px, rgba(29, 78, 216, 0.15), transparent 80%)`;
  }

  @HostListener('document:mousemove', ['$event'])
  onMouseMove(event: MouseEvent): void {
    this.mouseX = event.clientX;
    this.mouseY = event.clientY;
  }
}
