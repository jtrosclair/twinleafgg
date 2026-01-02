import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardTag } from '../../game/store/card/card-types';
import { StoreLike } from '../../game/store/store-like';
import { State } from '../../game/store/state/state';
import { Effect } from '../../game/store/effects/effect';
import { PowerType } from '../../game/store/card/pokemon-types';
export declare class Meloettaex extends PokemonCard {
    stage: Stage;
    cardTag: CardTag[];
    cardType: import("../../game/store/card/card-types").CardType.PSYCHIC;
    hp: number;
    weakness: {
        type: import("../../game/store/card/card-types").CardType.DARK;
    }[];
    resistance: {
        type: import("../../game/store/card/card-types").CardType.FIGHTING;
        value: number;
    }[];
    retreat: import("../../game/store/card/card-types").CardType.COLORLESS[];
    powers: {
        name: string;
        powerType: PowerType;
        text: string;
    }[];
    attacks: {
        name: string;
        cost: import("../../game/store/card/card-types").CardType.PSYCHIC[];
        damage: number;
        text: string;
    }[];
    regulationMark: string;
    set: string;
    cardImage: string;
    setNumber: string;
    name: string;
    fullName: string;
    usedAttack: boolean;
    readonly NEXT_TURN_MORE_DAMAGE_MARKER = "NEXT_TURN_MORE_DAMAGE_MARKER";
    readonly NEXT_TURN_MORE_DAMAGE_MARKER_2 = "NEXT_TURN_MORE_DAMAGE_MARKER_2";
    reduceEffect(store: StoreLike, state: State, effect: Effect): State;
}
