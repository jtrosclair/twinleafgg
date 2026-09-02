import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export type ThemeMode = 'dark' | 'light';

/**
 * Keeps the embedded game in sync with the host application's color mode.
 *
 * PrizeMap writes `prizemap:theme` before the WebView navigates and dispatches
 * `prizemap-theme-change` when the setting changes. Keeping the contract here
 * also makes a normal browser visit deterministic: no saved value means dark.
 */
@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  private readonly storageKey = 'prizemap:theme';
  private initialized = false;
  private readonly themeSubject = new BehaviorSubject<ThemeMode>('dark');

  public readonly theme$ = this.themeSubject.asObservable();

  private readonly onThemeChange = (event: Event): void => {
    const detail = (event as CustomEvent<ThemeMode | { theme?: ThemeMode }>).detail;
    const themeFromEvent = this.getThemeFromDetail(detail);
    // Some React Native WebView releases send the event without a detail
    // payload after first updating `data-theme`. Accept that live signal too,
    // while still treating localStorage as the initial source of truth.
    this.applyTheme(themeFromEvent || this.getDocumentTheme() || this.readStoredTheme());
  };

  private readonly onStorageChange = (event: StorageEvent): void => {
    if (event.key === this.storageKey) {
      this.applyTheme(this.readStoredTheme());
    }
  };

  /** Starts listening once AppComponent is constructed. Safe to call repeatedly. */
  public initialize(): void {
    if (this.initialized) {
      return;
    }

    this.initialized = true;
    this.applyTheme(this.readStoredTheme());
    window.addEventListener('prizemap-theme-change', this.onThemeChange);
    document.addEventListener('prizemap-theme-change', this.onThemeChange);
    window.addEventListener('storage', this.onStorageChange);
  }

  /** Allows a first-party settings UI to change the same preference in future. */
  public setTheme(theme: ThemeMode): void {
    try {
      window.localStorage.setItem(this.storageKey, theme);
    } catch {
      // Private browsing or an embedded browser can deny storage. The current
      // page should still honor the requested appearance for this session.
    }

    this.applyTheme(theme);
  }

  private readStoredTheme(): ThemeMode {
    return this.getStoredTheme() || 'dark';
  }

  private getStoredTheme(): ThemeMode | undefined {
    try {
      const storedTheme = window.localStorage.getItem(this.storageKey);
      return this.isThemeMode(storedTheme) ? storedTheme : undefined;
    } catch {
      return undefined;
    }
  }

  private getDocumentTheme(): ThemeMode | undefined {
    return this.isThemeMode(document.documentElement.dataset.theme)
      ? document.documentElement.dataset.theme
      : undefined;
  }

  private getThemeFromDetail(detail: ThemeMode | { theme?: ThemeMode } | null): ThemeMode | undefined {
    if (this.isThemeMode(detail)) {
      return detail;
    }

    if (detail && typeof detail === 'object' && this.isThemeMode(detail.theme)) {
      return detail.theme;
    }

    return undefined;
  }

  private isThemeMode(value: unknown): value is ThemeMode {
    return value === 'dark' || value === 'light';
  }

  private applyTheme(theme: ThemeMode): void {
    const root = document.documentElement;
    root.dataset.theme = theme;
    // Angular 12's DOM typings predate CSSStyleDeclaration.colorScheme.
    root.style.setProperty('color-scheme', theme);

    if (document.body) {
      document.body.dataset.theme = theme;
    }

    this.themeSubject.next(theme);
  }
}
