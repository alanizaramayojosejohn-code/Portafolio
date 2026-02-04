import { Component, inject } from '@angular/core';
import { Theme, ThemeService } from '../../services/theme/theme.service';

@Component({
  selector: 'app-theme-toggle',
  imports: [],
  providers: [ThemeService],
  templateUrl: './theme-toggle.html',
  styleUrls:['./theme-toggle.css']

})
export class ThemeToggle {

  themeService = inject(ThemeService);

  themeOptions = [
    { value: 'light' as Theme, label: 'Light', icon: '☀️' },
    { value: 'dark' as Theme, label: 'Dark', icon: '🌙' },
    { value: 'system' as Theme, label: 'Auto', icon: '💻' }
  ];

  setTheme(theme: Theme) {
    this.themeService.setTheme(theme);
  }
}
