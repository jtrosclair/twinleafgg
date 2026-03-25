import { CardType, Stage } from '../../game/store/card/card-types';
import { PokemonCard } from '../../game';
export declare class Ferroseed extends PokemonCard {
    stage: Stage;
    hp: number;
    cardType: CardType;
    weakness: {
        type: CardType.FIRE;
    }[];
    resistance: {
        type: CardType.GRASS;
        value: number;
    }[];
    retreat: CardType.COLORLESS[];
    attacks: {
        name: string;
        cost: CardType.METAL[];
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
