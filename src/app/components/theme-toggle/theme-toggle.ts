import { Component, inject } from '@angular/core';
import { Theme, ThemeService } from '../../services/theme/theme.service';

@Component({
  selector: 'app-theme-toggle',
  imports: [],
  templateUrl: './theme-toggle.html',
  styleUrl: './theme-toggle.css',
})
export class ThemeToggle {

  themeService = inject(ThemeService);

  themeOptions = [
    { value: 'light' as Theme, label: 'Light' },
    { value: 'dark' as Theme, label: 'Dark' },
    { value: 'system' as Theme, label: 'Auto' }
  ];

  setTheme(theme: Theme) {
    this.themeService.setTheme(theme);
  }
}
