import { Injectable } from '@angular/core';
import { Observable, of, defer, throwError } from 'rxjs';
import { catchError, shareReplay } from 'rxjs/operators';
import { CARD_LIBRARY_SCHEMA_VERSION, isCardLibraryMetadata } from 'ptcg-server/client';
import { CLIENT_CARD_TOTAL, CLIENT_CATALOGUE_HASH, CLIENT_LIBRARY_HASH } from '../../client-library-version';
import { CardsHashResponse, CardsInfo, CardsResponse } from '../interfaces/cards.interface';
import { simulatorStaticBundle } from '../../shared/services/simulator-static';

/** Reads the immutable image table delivered with this executable card library. */
@Injectable()
export class CardsService {
  private cardsInfo$: Observable<CardsInfo> | undefined;

  public getCardsInfo(): Observable<CardsInfo> {
    if (!this.cardsInfo$) {
      this.cardsInfo$ = defer(() => of(this.readCardsInfo())).pipe(
        catchError(error => {
          // Retry can validate a repaired bootstrap instead of retaining failure.
          this.cardsInfo$ = undefined;
          return throwError(error);
        }),
        shareReplay(1)
      );
    }
    return this.cardsInfo$;
  }

  private readCardsInfo(): CardsInfo {
    const embedded = simulatorStaticBundle()?.json;
    const manifestPath = 'assets/simulator/cards.hash.json';
    const payloadPath = `assets/simulator/cards.${CLIENT_LIBRARY_HASH}.json`;
    if (!embedded || !Object.prototype.hasOwnProperty.call(embedded, manifestPath)
      || !Object.prototype.hasOwnProperty.call(embedded, payloadPath)) {
      throw new Error('The embedded card data is incomplete. Reload this page to update the simulator.');
    }
    const manifest = embedded[manifestPath] as CardsHashResponse;
    if (manifest?.ok !== true || manifest.schemaVersion !== CARD_LIBRARY_SCHEMA_VERSION) {
      throw new Error('The card metadata format has changed. Reload this page to update the simulator.');
    }
    if (manifest.hash !== CLIENT_LIBRARY_HASH || manifest.catalogueHash !== CLIENT_CATALOGUE_HASH) {
      throw new Error('The simulator has been updated. Reload this page to load the current card library.');
    }
    if (manifest.cardsTotal !== CLIENT_CARD_TOTAL) {
      throw new Error('The card-library manifest is incomplete. Reload this page and retry.');
    }
    const response = embedded[payloadPath] as CardsResponse;
    const info = response?.cardsInfo;
    if (response?.ok !== true || !isCardLibraryMetadata(info, {
      hash: CLIENT_LIBRARY_HASH, catalogueHash: CLIENT_CATALOGUE_HASH, cardsTotal: CLIENT_CARD_TOTAL
    })
      || Object.keys(info).some(key => !['schemaVersion', 'images', 'hash', 'catalogueHash'].includes(key))) {
      throw new Error('The embedded card library does not match this simulator. Reload this page and retry.');
    }
    return info;
  }
}
