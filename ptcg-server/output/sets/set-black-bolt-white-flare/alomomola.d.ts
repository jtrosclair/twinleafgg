import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage } from '../../game/store/card/card-types';
import { StoreLike } from '../../game/store/store-like';
import { State } from '../../game/store/state/state';
import { Effect } from '../../game/store/effects/effect';
import { PowerType } from '../../game/store/card/pokemon-types';
export declare class Alomomola extends PokemonCard {
    stage: Stage;
    cardType: import("../../game").CardType.WATER;
    hp: number;
    weakness: {
        type: import("../../game").CardType.LIGHTNING;
    }[];
    retreat: import("../../game").CardType.COLORLESS[];
    powers: {
        name: string;
        powerType: PowerType;
        text: string;
    }[];
    attacks: {
        name: string;
        cost: (import("../../game").CardType.WATER | import("../../game").CardType.COLORLESS)[];
        damage: number;
        text: string;
    }[];
    regulationMark: string;
    set: string;
    cardImage: string;
    setNumber: string;
    name: string;
    fullName: string;
    readonly GENTLE_FINS_MARKER = "GENTLE_FINS_MARKER";
    reduceEffect(store: StoreLike, state: State, effect: Effect): State;
}
