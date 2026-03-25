import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../game/store/card/card-types';
export declare class Bagon extends PokemonCard {
    stage: Stage;
    cardType: CardType;
    hp: number;
    retreat: CardType.COLORLESS[];
    attacks: ({
        name: string;
        cost: CardType.COLORLESS[];
        damage: number;
        text: string;
    } | {
        name: string;
        cost: (CardType.FIRE | CardType.WATER)[];
        damage: number;
        text: string;
    })[];
    regulationMark: string;
    set: string;
    setNumber: string;
    cardImage: string;
    name: string;
    fullName: string;
}
