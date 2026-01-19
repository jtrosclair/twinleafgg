import { PokemonCard, Stage, CardType } from '../../game';
export declare class Togepi extends PokemonCard {
    stage: Stage;
    cardType: CardType;
    hp: number;
    weakness: {
        type: CardType.METAL;
    }[];
    resistance: any[];
    retreat: CardType.COLORLESS[];
    attacks: {
        name: string;
        cost: CardType.COLORLESS[];
        damage: number;
        text: string;
    }[];
    regulationMark: string;
    set: string;
    setNumber: string;
    cardImage: string;
    name: string;
    fullName: string;
}
