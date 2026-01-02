import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage } from '../../game/store/card/card-types';
export declare class Toedscool extends PokemonCard {
    stage: Stage;
    cardType: import("../../game/store/card/card-types").CardType.GRASS;
    hp: number;
    weakness: {
        type: import("../../game/store/card/card-types").CardType.FIGHTING;
    }[];
    retreat: import("../../game/store/card/card-types").CardType.COLORLESS[];
    attacks: {
        name: string;
        cost: (import("../../game/store/card/card-types").CardType.GRASS | import("../../game/store/card/card-types").CardType.COLORLESS)[];
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
