import { ensureClientCards, applyClientCardMetadata, CardLibraryMetadata } from 'ptcg-server/client';
import { Injectable, OnDestroy } from '@angular/core';
import { Card, StateSerializer, SuperType, PokemonCard, EnergyCard, CardType, TrainerCard } from 'ptcg-server';
import { MatDialog } from '@angular/material/dialog';
import { Subject } from 'rxjs';
import { CardInfoPopupData, CardInfoPopupComponent } from './card-info-popup/card-info-popup.component';
import { CardInfoListPopupComponent } from './card-info-list-popup/card-info-list-popup.component';
import { CardInfoPaneAction } from './card-info-pane/card-info-pane.component';
import { SimulatorAssetsService } from '../services/simulator-assets.service';
import { CLIENT_CARD_TOTAL, CLIENT_CATALOGUE_HASH, CLIENT_LIBRARY_HASH } from '../../client-library-version';

/** Executable card library, local image preferences, and card inspection dialogs. */
@Injectable({ providedIn: 'root' })
export class CardsBaseService implements OnDestroy {
  private cards: Card[] = [];
  private names: string[] | undefined;
  private cardsByName: Map<string, Card> | undefined;
  private customImages: { [key: string]: string } = {};
  private overridesChangedSubject = new Subject<string>();
  public overridesChanged$ = this.overridesChangedSubject.asObservable();

  constructor(private dialog: MatDialog, private simulatorAssets: SimulatorAssetsService) {
    try {
      const images = JSON.parse(localStorage.getItem('customCardImages') || '{}');
      if (images && typeof images === 'object' && !Array.isArray(images)) {
        Object.keys(images).forEach(key => {
          if (typeof images[key] === 'string') { this.customImages[key] = images[key]; }
        });
      }
    } catch { /* Image preferences are optional in storage-restricted WebViews. */ }
  }

  public loadCardsInfo(cardsInfo: CardLibraryMetadata): void {
    applyClientCardMetadata(cardsInfo, {
      hash: CLIENT_LIBRARY_HASH, catalogueHash: CLIENT_CATALOGUE_HASH, cardsTotal: CLIENT_CARD_TOTAL
    });
    this.cards = this.sortCards(ensureClientCards());
    this.names = undefined;
    this.cardsByName = undefined;
    StateSerializer.setKnownCards(this.cards);
  }

  private sortCards(cards: Card[]): Card[] {
    // Read each of the thousands of distinct card classes once. Sorting the
    // plain scalar records preserves the catalog order used by legacy aliases.
    return cards.map(card => {
      const type = card.superType;
      const energy = card as EnergyCard;
      return {
        card, type, name: card.fullName,
        primary: type === SuperType.POKEMON ? (card as PokemonCard).cardType
          : type === SuperType.ENERGY ? energy.energyType
          : type === SuperType.TRAINER ? (card as TrainerCard).trainerType : 0,
        secondary: type === SuperType.ENERGY && energy.provides.length > 0 ? energy.provides[0] : CardType.NONE
      };
    }).sort((a, b) => a.type !== b.type ? a.type - b.type
      : a.primary !== b.primary ? a.primary - b.primary
      : a.secondary !== b.secondary ? a.secondary - b.secondary
      : a.name < b.name ? -1 : 1).map(entry => entry.card);
  }

  public getCards(): Card[] {
    return this.cards;
  }

  public getCardNames(): string[] {
    return this.names ?? (this.names = this.cards.map(card => card.fullName));
  }

  private preference(key: string, fallback: string): string {
    try { return localStorage.getItem(key) || fallback; } catch { return fallback; }
  }

  private saveImages(): void {
    try { localStorage.setItem('customCardImages', JSON.stringify(this.customImages)); } catch { }
  }

  public setCustomImageForCard(card: Card, imageUrl: string): void {
    const key = `${card.set} ${card.setNumber}`;
    if (imageUrl) { this.customImages[key] = imageUrl; } else { delete this.customImages[key]; }
    this.saveImages();
    this.overridesChangedSubject.next(key);
  }

  public clearCustomImageForCard(card: Card): void { this.setCustomImageForCard(card, ''); }

  public getScanUrl(card: Card): string {
    return this.simulatorAssets.resolve(this.getRawScanUrl(card));
  }

  /** Stable artwork identity for prefetch/cache lookup, before local resolution. */
  public getRawScanUrl(card: Card): string {
    const key = `${card.set} ${card.setNumber}`;
    let url = (card.usSetNumber && this.customImages[card.usSetNumber]) || this.customImages[key] || card.cardImage;
    const language = this.preference('cardLanguage', 'EN');
    if (['ES', 'IT', 'FR'].includes(language) && url.includes('_EN_')) {
      url = url.replace('_EN_', `_${language}_`);
    }
    const preferredSize = this.preference('preferredCardSize', 'SM');
    const size = ['XS', 'SM', 'MD', 'LG'].includes(preferredSize) ? preferredSize : 'SM';
    if (size !== 'XS') { url = url.replace('_XS.png', `_${size}.png`); }
    return url;
  }

  public getCardByName(cardName: string): Card | undefined {
    if (!this.cardsByName) {
      this.cardsByName = new Map(this.cards.map(card => [card.fullName, card]));
    }
    return this.cardsByName.get(cardName);
  }

  public getCardByNameSetNumber(name: string, set: string, setNumber: string): Card | undefined {
    return this.cards.find(c => c.name === name && c.set === set && c.setNumber === setNumber);
  }

  public getCardByNameSet(name: string, set: string): Card | undefined {
    return this.cards.find(c => c.name === name && c.set === set);
  }

  public getCardByBaseName(name: string): Card | undefined {
    return this.cards.find(c => c.name === name);
  }

  public showCardInfo(data: CardInfoPopupData = {}): Promise<CardInfoPaneAction> {
    // If caller passed a plain mapping to simulate artworksMap, wrap it into an object with artworksMap
    const maybeMap = data.cardList as any;
    if (maybeMap && !('cards' in maybeMap) && typeof maybeMap === 'object') {
      data.cardList = { cards: [data.card], artworksMap: maybeMap } as any;
    }
    const dialog = this.dialog.open(CardInfoPopupComponent, {
      maxWidth: '100%',
      width: '650px',
      data
    });

    return dialog.afterClosed().toPromise()
      .catch(() => undefined);
  }

  public showCardInfoList(data: CardInfoPopupData = {}): Promise<CardInfoPaneAction> {
    if (data.cardList === undefined) {
      return this.showCardInfo(data);
    }

    const dialog = this.dialog.open(CardInfoListPopupComponent, {
      maxWidth: '100%',
      width: '670px',
      data
    });

    return dialog.afterClosed().toPromise()
      .catch(() => undefined);
  }

  public getArtworkUrl(card: Card, artwork?: { imageUrl: string }): string {
    if (artwork && artwork.imageUrl) {
      return this.simulatorAssets.resolve(artwork.imageUrl);
    }
    return this.getScanUrl(card);
  }

  ngOnDestroy(): void { this.overridesChangedSubject.complete(); }
}
