import { Subject } from 'rxjs';
import { CardComponent } from './card.component';
import { SettingsService } from '../../services/settings.service';

describe('card display subscription lifecycle', () => {
  it('turns only holographic decoration off while preserving artwork and card data', () => {
    const settings = new SettingsService();
    const artwork = new Subject<string>();
    const card = new CardComponent({ overridesChanged$: artwork, getScanUrl: () => 'card-art.webp' } as any,
      settings, { resolve: (url: string) => url } as any);
    const data = { name: 'Munkidori', fullName: 'Munkidori TWM', tags: [] } as any;
    card.card = data;
    settings.setHoloEnabled(true);
    expect(card.getCardClass()).toBe('holo');
    settings.setHoloEnabled(false);
    expect(card.getCardClass()).toBe('');
    expect(card.data).toBe(data);
    expect(card.scanUrl).toBe('card-art.webp');
    settings.setHoloEnabled(true);
    expect(card.getCardClass()).toBe('holo');
    card.ngOnDestroy();
  });

  it('releases all display and artwork subscriptions when a card leaves the board', () => {
    const settings = new SettingsService();
    const artwork = new Subject<string>();
    const component = new CardComponent({ overridesChanged$: artwork } as any, settings,
      { resolve: (url: string) => url } as any);
    component.ngOnInit();
    const holo = (settings as any).holoEnabledSubject;
    const names = (settings as any).showCardNameSubject;
    expect(holo.observers.length).toBe(1);
    expect(names.observers.length).toBe(1);
    expect(artwork.observers.length).toBe(1);
    component.ngOnDestroy();
    expect(holo.observers.length).toBe(0);
    expect(names.observers.length).toBe(0);
    expect(artwork.observers.length).toBe(0);
  });

  it('does not accumulate old card observers while repeatedly opening boards', () => {
    const settings = new SettingsService();
    const artwork = new Subject<string>();
    for (let index = 0; index < 200; index++) {
      const card = new CardComponent({ overridesChanged$: artwork } as any, settings, {} as any);
      card.ngOnInit();
      card.ngOnDestroy();
    }
    expect((settings as any).holoEnabledSubject.observers.length).toBe(0);
    expect((settings as any).showCardNameSubject.observers.length).toBe(0);
    expect(artwork.observers.length).toBe(0);
  });

  it('updates live cards, but stops changing a destroyed card when preferences change', () => {
    const settings = new SettingsService();
    const artwork = new Subject<string>();
    const card = new CardComponent({ overridesChanged$: artwork } as any, settings, {} as any);
    card.ngOnInit();
    settings.setShowCardName(true);
    settings.setHoloEnabled(true);
    expect(card.showCardName).toBe(true);
    expect((card as any).holoEnabled).toBe(true);
    card.ngOnDestroy();
    settings.setShowCardName(false);
    settings.setHoloEnabled(false);
    expect(card.showCardName).toBe(true);
    expect((card as any).holoEnabled).toBe(true);
  });
});
