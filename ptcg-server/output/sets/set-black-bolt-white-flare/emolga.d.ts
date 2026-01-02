import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage } from '../../game/store/card/card-types';
import { StoreLike } from '../../game/store/store-like';
import { State } from '../../game/store/state/state';
import { Effect } from '../../game/store/effects/effect';
export declare class Emolga extends PokemonCard {
    stage: Stage;
    cardType: import("../../game/store/card/card-types").CardType.LIGHTNING;
    hp: number;
    weakness: {
        type: import("../../game/store/card/card-types").CardType.FIGHTING;
    }[];
    retreat: [];
    attacks: ({
        name: string;
        cost: import("../../game/store/card/card-types").CardType.COLORLESS[];
        damage: number;
        text: string;
    } | {
        name: string;
        cost: import("../../game/store/card/card-types").CardType.LIGHTNING[];
        damage: number;
        text: string;
    })[];
    regulationMark: string;
    set: string;
    cardImage: string;
    setNumber: string;
    name: string;
    fullName: string;
    reduceEffect(store: StoreLike, state: State, effect: Effect): State;
}
