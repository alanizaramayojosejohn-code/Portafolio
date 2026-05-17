import { Injectable, signal, effect, inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

export type Theme = 'light' | 'dark' | 'system';

@Injectable({
  providedIn: 'root',
})
export class ThemeService {
  // Signal para el tema actual
  currentTheme = signal<Theme>('system');

  // Signal para saber si está en modo dark (considerando system)
  isDark = signal<boolean>(false);

  private platformId = inject(PLATFORM_ID);

  constructor() {
    if (isPlatformBrowser(this.platformId)) {
      // Cargar preferencia guardada o usar 'system'
      const savedTheme = this.getStoredTheme();
      this.currentTheme.set(savedTheme);

      // Aplicar el tema al cargar
      this.applyTheme(savedTheme);

      // Escuchar cambios en la preferencia del sistema
      this.watchSystemTheme();

      // Efecto para aplicar cambios de tema
      effect(() => {
        this.applyTheme(this.currentTheme());
      });
    }
  }

  // Cambiar tema manualmente
  setTheme(theme: Theme) {
    this.currentTheme.set(theme);
    localStorage.setItem('theme-preference', theme);
  }

  // Obtener tema guardado
  private getStoredTheme(): Theme {
    const stored = localStorage.getItem('theme-preference');
    return (stored as Theme) || 'system';
  }

  // Aplicar tema al documento
  private applyTheme(theme: Theme) {
    const isDarkMode = theme === 'dark' || (theme === 'system' && this.getSystemTheme() === 'dark');

    this.isDark.set(isDarkMode);

    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }

  // Detectar preferencia del sistema
  private getSystemTheme(): 'light' | 'dark' {
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  }

  // Escuchar cambios en el sistema
  private watchSystemTheme() {
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
      if (this.currentTheme() === 'system') {
        this.applyTheme('system');
      }
    });
  }
}
