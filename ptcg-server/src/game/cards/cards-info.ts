import { Card } from '../store/card/card';

export interface CardsInfo { cards: Card[]; hash: string; }
export interface CardsHash { cardsTotal: number; hash: string; }
