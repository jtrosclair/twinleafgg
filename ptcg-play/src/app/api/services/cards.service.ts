import { Injectable } from '@angular/core';
import { HttpEvent, HttpEventType, HttpResponse } from '@angular/common/http';

import { ApiService } from '../api.service';
import { CardsHashResponse, CardsResponse } from '../interfaces/cards.interface';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { catchError, switchMap, map, tap, filter } from 'rxjs/operators';
import { CardsCacheService } from './cards-cache.service';
import { CardsInfo } from 'ptcg-server';

export interface CardsDownloadProgress {
  active: boolean;
  message: string;
  progress: number | null;
  loadedBytes: number;
  totalBytes: number | null;
  phase: 'idle' | 'checking' | 'downloading' | 'saving' | 'ready' | 'error';
}

@Injectable()
export class CardsService {

  private cardsDownloadProgressSubject = new BehaviorSubject<CardsDownloadProgress>({
    active: false,
    message: '',
    progress: null,
    loadedBytes: 0,
    totalBytes: null,
    phase: 'idle'
  });

  public cardsDownloadProgress$ = this.cardsDownloadProgressSubject.asObservable();

  constructor(
    private api: ApiService,
    private cardsCacheService: CardsCacheService
  ) { }

  /**
   * Reads cards from cache (indexed-db) or fetch all cards from the server.
   */
  public getCardsInfo(): Observable<CardsInfo> {
    this.setCardsProgress({
      active: true,
      message: 'Checking card data…',
      progress: null,
      loadedBytes: 0,
      totalBytes: null,
      phase: 'checking'
    });

    return this.cardsCacheService.getCardsInfo().pipe(

      // Error while reading data from db, handle it as data didn't exist
      catchError(() => of(undefined)),

      // Check if cards from cache are up-to-date
      switchMap((cardsInfo: CardsInfo | undefined) => {
        if (cardsInfo === undefined) {
          return of(undefined);
        }

        return this.getHash().pipe(switchMap(response => {
          if (response.cardsTotal !== cardsInfo.cards.length || response.hash !== cardsInfo.hash) {
            return of(undefined);
          }
          this.setCardsProgress({
            active: false,
            message: '',
            progress: 100,
            loadedBytes: 0,
            totalBytes: null,
            phase: 'ready'
          });
          return of(cardsInfo);
        }));
      }),

      // No cards from cache, or invalid hash, need to fetch all cards from server
      switchMap((cardsInfo: CardsInfo | undefined) => {
        if (cardsInfo !== undefined) {
          return of(cardsInfo);
        }

        return this.getAllWithProgress().pipe(switchMap(response => {
          this.setCardsProgress({
            active: true,
            message: 'Saving card data for next time…',
            progress: 100,
            loadedBytes: 0,
            totalBytes: null,
            phase: 'saving'
          });

          return this.cardsCacheService.saveCardsInfo(response.cardsInfo).pipe(
            map(() => {
              this.setCardsProgress({
                active: false,
                message: '',
                progress: 100,
                loadedBytes: 0,
                totalBytes: null,
                phase: 'ready'
              });
              return response.cardsInfo;
            }),
            catchError(() => {
              this.setCardsProgress({
                active: false,
                message: '',
                progress: 100,
                loadedBytes: 0,
                totalBytes: null,
                phase: 'ready'
              });
              return of(response.cardsInfo);
            })
          );
        }));
      }),
      catchError(error => {
        this.setCardsProgress({
          active: false,
          message: 'Card data download failed. Check your connection and try again.',
          progress: null,
          loadedBytes: 0,
          totalBytes: null,
          phase: 'error'
        });
        throw error;
      })
    );
  }

  public getAll() {
    return this.api.get<CardsResponse>('/v1/cards/all');
  }

  public getHash() {
    return this.api.get<CardsHashResponse>('/v1/cards/hash');
  }

  private getAllWithProgress(): Observable<CardsResponse> {
    this.setCardsProgress({
      active: true,
      message: 'New card data available, downloading…',
      progress: null,
      loadedBytes: 0,
      totalBytes: null,
      phase: 'downloading'
    });

    return this.api.getWithProgress<CardsResponse>('/v1/cards/all').pipe(
      tap((event: HttpEvent<CardsResponse>) => {
        if (event.type === HttpEventType.DownloadProgress) {
          const loadedBytes = event.loaded || 0;
          const totalBytes = event.total || null;
          const progress = totalBytes ? Math.round((loadedBytes / totalBytes) * 100) : null;

          this.setCardsProgress({
            active: true,
            message: 'New card data available, downloading…',
            progress,
            loadedBytes,
            totalBytes,
            phase: 'downloading'
          });
        }
      }),
      filter((event: HttpEvent<CardsResponse>) => event.type === HttpEventType.Response),
      map((event: HttpResponse<CardsResponse>) => event.body as CardsResponse)
    );
  }

  private setCardsProgress(progress: CardsDownloadProgress): void {
    this.cardsDownloadProgressSubject.next(progress);
  }

}
