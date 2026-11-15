import { Injectable, computed, signal } from '@angular/core';

export type ThemeMode = 'light' | 'dark';

@Injectable({
  providedIn: 'root',
})
export class SettingsStore {
  private readonly storageKey = 'anime-character-explorer.theme';
  private readonly theme = signal<ThemeMode>(this.loadTheme());

  readonly isDarkMode = computed(() => this.theme() === 'dark');
  readonly currentTheme = this.theme.asReadonly();

  constructor() {
    this.applyTheme(this.theme());
  }

  setTheme(theme: ThemeMode): void {
    this.theme.set(theme);
    this.applyTheme(theme);

    if (typeof localStorage !== 'undefined') {
      localStorage.setItem(this.storageKey, theme);
    }
  }

  toggleTheme(): void {
    this.setTheme(this.isDarkMode() ? 'light' : 'dark');
  }

  private loadTheme(): ThemeMode {
    if (typeof localStorage === 'undefined') {
      return 'light';
    }

    return localStorage.getItem(this.storageKey) === 'dark' ? 'dark' : 'light';
  }

  private applyTheme(theme: ThemeMode): void {
    if (typeof document !== 'undefined') {
      document.documentElement.classList.toggle('dark-theme', theme === 'dark');
    }
  }
}
