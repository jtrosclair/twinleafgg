import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage } from '../../game/store/card/card-types';
import { State } from '../../game/store/state/state';
import { StoreLike } from '../../game/store/store-like';
import { Effect } from '../../game/store/effects/effect';
import { PowerType } from '../../game';
export declare class Regice extends PokemonCard {
    stage: Stage;
    cardType: import("../../game").CardType.WATER;
    hp: number;
    weakness: {
        type: import("../../game").CardType.METAL;
    }[];
    retreat: import("../../game").CardType.COLORLESS[];
    powers: {
        name: string;
        useWhenInPlay: boolean;
        powerType: PowerType;
        text: string;
    }[];
    attacks: {
        name: string;
        cost: (import("../../game").CardType.WATER | import("../../game").CardType.COLORLESS)[];
        damage: number;
        text: string;
    }[];
    set: string;
    setNumber: string;
    cardImage: string;
    name: string;
    fullName: string;
    readonly REGI_MOVE_MARKER = "REGI_MOVE_MARKER";
    readonly ICE_REFLECT_MARKER = "ICE_REFLECT_MARKER";
    reduceEffect(store: StoreLike, state: State, effect: Effect): State;
}
