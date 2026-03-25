import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../game/store/card/card-types';
export declare class Cubone extends PokemonCard {
    stage: Stage;
    cardType: CardType;
    hp: number;
    weakness: {
        type: CardType.WATER;
    }[];
    resistance: {
        type: CardType.LIGHTNING;
        value: number;
    }[];
    retreat: CardType.COLORLESS[];
    attacks: ({
        name: string;
        cost: CardType.FIGHTING[];
        damage: number;
        text: string;
    } | {
        name: string;
        cost: CardType.COLORLESS[];
        damage: number;
        text: string;
    })[];
    set: string;
    setNumber: string;
    cardImage: string;
    name: string;
    fullName: string;
}
