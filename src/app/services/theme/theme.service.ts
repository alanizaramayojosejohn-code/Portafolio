import { Injectable, signal, effect } from '@angular/core';

export type Theme = 'light' | 'dark' | 'system';

@Injectable()
export class ThemeService {
  // Signal para el tema actual
  currentTheme = signal<Theme>('system');

  // Signal para saber si está en modo dark (considerando system)
  isDark = signal<boolean>(false);

  constructor() {
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

  // Cambiar tema manualmente
  setTheme(theme: Theme) {
    this.currentTheme.set(theme);
    localStorage.setItem('theme-preference', theme);
  }

  // Obtener tema guardado
  private getStoredTheme(): Theme {
    if (typeof window === 'undefined') return 'system';
    const stored = localStorage.getItem('theme-preference');
    return (stored as Theme) || 'system';
  }

  // Aplicar tema al documento
  private applyTheme(theme: Theme) {
    if (typeof window === 'undefined') return;

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
    if (typeof window === 'undefined') return 'dark';
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  }

  // Escuchar cambios en el sistema
  private watchSystemTheme() {
    if (typeof window === 'undefined') return;

    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
      if (this.currentTheme() === 'system') {
        this.applyTheme('system');
      }
    });
  }
}
