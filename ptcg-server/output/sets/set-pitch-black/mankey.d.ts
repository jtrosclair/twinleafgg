import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../game/store/card/card-types';
export declare class Mankey extends PokemonCard {
    stage: Stage;
    cardType: CardType;
    hp: number;
    weakness: {
        type: CardType.PSYCHIC;
    }[];
    retreat: CardType.COLORLESS[];
    attacks: {
        name: string;
        cost: CardType.COLORLESS[];
        damage: number;
        text: string;
    }[];
    set: string;
    setNumber: string;
    regulationMark: string;
    cardImage: string;
    name: string;
    fullName: string;
}
