import type { Card } from '../game/store/card/card';

export const catalogueIdentity: { catalogueHash: string; cardsTotal: number };

export interface CatalogueBatch {
  name: string;
  load: () => Promise<readonly Card[]>;
}

export const catalogueBatches: readonly CatalogueBatch[];

export type CardCatalogueRow = readonly [name: string, batch: number, offset: number, needsFullCatalogue: number];
export const catalogueRows: readonly CardCatalogueRow[];
export const stageOneEvolutionLinks: readonly (readonly [string, string])[];
