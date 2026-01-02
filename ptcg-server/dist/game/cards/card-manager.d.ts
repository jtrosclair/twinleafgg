import { Card } from '../store/card/card';
import { CardsInfo } from '../../backend/interfaces/cards.interface';
export declare class CardManager {
    private static instance;
    private cards;
    private cardIndex;
    static getInstance(): CardManager;
    defineSet(set: Card[]): void;
    loadCardsInfo(cardsInfo: CardsInfo): void;
    defineCard(card: Card): void;
    getCardByName(name: string): Card | undefined;
    isCardDefined(name: string): boolean;
    getAllCards(): Card[];
}
