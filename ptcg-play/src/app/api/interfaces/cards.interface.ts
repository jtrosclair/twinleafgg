import { CardLibraryMetadata } from 'ptcg-server/client';

export type CardsInfo = CardLibraryMetadata;
export interface CardsResponse { ok: boolean; cardsInfo: CardLibraryMetadata; }
export interface CardsHashResponse {
  ok: boolean; schemaVersion: number; cardsTotal: number; hash: string; catalogueHash: string;
}
