import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

/** Local card-display preferences. */
@Injectable({ providedIn: 'root' })
export class SettingsService {
  private holoEnabledSubject = new BehaviorSubject<boolean>(this.read('holoEnabled', true));
  private cardSizeSubject = new BehaviorSubject<number>(this.read('cardSize', 100));
  private showCardNameSubject = new BehaviorSubject<boolean>(this.read('showCardName', false));
  private showTagsSubject = new BehaviorSubject<boolean>(this.read('showTags', false));
  public cardSize$ = this.cardSizeSubject.asObservable();
  public holoEnabled$ = this.holoEnabledSubject.asObservable();
  public showCardName$ = this.showCardNameSubject.asObservable();
  public showTags$ = this.showTagsSubject.asObservable();

  private read<T>(key: string, fallback: T): T {
    try { const value = localStorage.getItem(key); return value === null ? fallback : JSON.parse(value); } catch { return fallback; }
  }
  private save(key: string, value: boolean | number): void {
    try { localStorage.setItem(key, JSON.stringify(value)); } catch { }
  }
  public setHoloEnabled(value: boolean): void { this.save('holoEnabled', value); this.holoEnabledSubject.next(value); }
  public setShowCardName(value: boolean): void { this.save('showCardName', value); this.showCardNameSubject.next(value); }
  public setShowTags(value: boolean): void { this.save('showTags', value); this.showTagsSubject.next(value); }
  public setCardSize(value: number): void { this.save('cardSize', value); this.cardSizeSubject.next(value); }
}
