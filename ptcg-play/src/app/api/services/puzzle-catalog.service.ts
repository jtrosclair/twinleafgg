import { DOCUMENT } from '@angular/common';
import { Inject, Injectable } from '@angular/core';
import { Base64 } from 'ptcg-server';
import { prepareClientCards } from 'ptcg-server/client';
import { Observable, from } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';

import { CardsBaseService } from '../../shared/cards/cards-base.service';
import { decodePuzzlePayload } from '../../shared/services/puzzle-payload';
import { CardsService } from './cards.service';

@Injectable({ providedIn: 'root' })
export class PuzzleCatalogService {
  constructor(
    private cardsService: CardsService,
    private cardsBaseService: CardsBaseService,
    @Inject(DOCUMENT) private document: Document
  ) { }

  public checkMetadata(): Observable<unknown> {
    return this.cardsService.getCardsInfo();
  }

  public prepareSnapshot(stateData: string, sessionId?: string): Observable<string> {
    return this.cardsService.getCardsInfo().pipe(switchMap(metadata => {
      const started = performance.now();
      const decoded = decodePuzzlePayload(stateData);
      const snapshot = JSON.parse(new Base64().decode(decoded));
      const names = snapshot?.[1]?.cardNames;
      if (!Array.isArray(names) || !names.every(name => typeof name === 'string')) {
        throw new Error('The puzzle snapshot does not specify its cards.');
      }
      return from(prepareClientCards(names)).pipe(map(stats => {
        const metadataStarted = performance.now();
        this.cardsBaseService.loadCardsInfo(metadata);
        this.document.documentElement.setAttribute('data-simulator-catalog', JSON.stringify({
          ...stats, sessionId, directCardCount: new Set(names).size,
          preloadMs: metadataStarted - started, metadataMs: performance.now() - metadataStarted
        }));
        return decoded;
      }));
    }));
  }
}
