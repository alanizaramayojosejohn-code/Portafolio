import { ChangeDetectionStrategy, Component, HostListener } from '@angular/core';
import { HeaderComponent } from '../components/header/container/component';
import { AboutComponent } from '../components/about/container/component';
import { ThemeService } from '../../../services/theme/theme.service';
import { ThemeToggle } from '../../../components/theme-toggle/theme-toggle';

@Component({
  selector: 'app-index',
  imports: [HeaderComponent, AboutComponent, ThemeToggle],
  templateUrl: './component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class IndexComponent {
  mouseX = 492;
  mouseY = 222;

  get lightGradient(): string {
    return `radial-gradient(600px at ${this.mouseX}px ${this.mouseY}px, rgba(200, 200, 200, 0.15), transparent 80%)`;
  }

  @HostListener('document:mousemove', ['$event'])
  onMouseMove(event: MouseEvent): void {
    this.mouseX = event.clientX;
    this.mouseY = event.clientY;
  }
}
