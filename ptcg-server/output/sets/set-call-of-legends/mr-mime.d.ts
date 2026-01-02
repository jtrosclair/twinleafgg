import { PokemonCard, Stage, StoreLike, State } from '../../game';
import { PowerType } from '../../game';
import { Effect } from '../../game/store/effects/effect';
export declare class MrMime extends PokemonCard {
    stage: Stage;
    cardType: import("../../game").CardType.PSYCHIC;
    hp: number;
    weakness: {
        type: import("../../game").CardType.PSYCHIC;
    }[];
    retreat: import("../../game").CardType.COLORLESS[];
    powers: {
        name: string;
        powerType: PowerType;
        useWhenInPlay: boolean;
        text: string;
    }[];
    attacks: {
        name: string;
        cost: (import("../../game").CardType.PSYCHIC | import("../../game").CardType.COLORLESS)[];
        damage: number;
        damageCalculation: string;
        text: string;
    }[];
    set: string;
    setNumber: string;
    cardImage: string;
    name: string;
    fullName: string;
    readonly TRICK_REVEAL_MARKER = "TRICK_REVEAL_MARKER";
    reduceEffect(store: StoreLike, state: State, effect: Effect): State;
}
