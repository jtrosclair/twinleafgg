import { CardType, Stage } from '../../game/store/card/card-types';
import { PokemonCard } from '../../game';
export declare class Litleo extends PokemonCard {
    stage: Stage;
    hp: number;
    cardType: CardType;
    weakness: {
        type: CardType.WATER;
    }[];
    retreat: CardType.COLORLESS[];
    attacks: {
        name: string;
        cost: CardType.COLORLESS[];
        damage: number;
        text: string;
    }[];
    regulationMark: string;
    set: string;
    cardImage: string;
    setNumber: string;
    name: string;
    fullName: string;
}
