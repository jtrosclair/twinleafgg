import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage } from '../../game/store/card/card-types';
import { StoreLike } from '../../game/store/store-like';
import { State } from '../../game/store/state/state';
import { Effect } from '../../game/store/effects/effect';
export declare class Tympole extends PokemonCard {
    stage: Stage;
    cardType: import("../../game/store/card/card-types").CardType.WATER;
    hp: number;
    weakness: {
        type: import("../../game/store/card/card-types").CardType.LIGHTNING;
    }[];
    retreat: import("../../game/store/card/card-types").CardType.COLORLESS[];
    attacks: {
        name: string;
        cost: import("../../game/store/card/card-types").CardType.COLORLESS[];
        damage: number;
        damageCalculation: string;
        text: string;
    }[];
    regulationMark: string;
    set: string;
    cardImage: string;
    setNumber: string;
    name: string;
    fullName: string;
    reduceEffect(store: StoreLike, state: State, effect: Effect): State;
}
