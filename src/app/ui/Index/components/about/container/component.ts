import { ChangeDetectionStrategy, Component } from '@angular/core';


@Component({
  selector: 'app-about',
  imports: [],
  templateUrl: './component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AboutComponent {}
