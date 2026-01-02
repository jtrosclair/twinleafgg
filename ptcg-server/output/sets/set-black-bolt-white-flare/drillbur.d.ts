import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage } from '../../game/store/card/card-types';
export declare class Drillbur extends PokemonCard {
    stage: Stage;
    cardType: import("../../game/store/card/card-types").CardType.FIGHTING;
    hp: number;
    weakness: {
        type: import("../../game/store/card/card-types").CardType.GRASS;
    }[];
    retreat: import("../../game/store/card/card-types").CardType.COLORLESS[];
    attacks: {
        name: string;
        cost: import("../../game/store/card/card-types").CardType.FIGHTING[];
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
