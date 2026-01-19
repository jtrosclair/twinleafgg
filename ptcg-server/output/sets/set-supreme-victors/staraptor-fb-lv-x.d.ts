import { PokemonCard, Stage, PowerType, StoreLike, State, CardTag } from '../../game';
import { Effect } from '../../game/store/effects/effect';
export declare class StaraptorFBLVX extends PokemonCard {
    stage: Stage;
    evolvesFrom: string;
    tags: CardTag[];
    cardType: import("../../game").CardType.COLORLESS;
    hp: number;
    weakness: {
        type: import("../../game").CardType.LIGHTNING;
    }[];
    resistance: {
        type: import("../../game").CardType.FIGHTING;
        value: number;
    }[];
    retreat: any[];
    powers: {
        name: string;
        powerType: PowerType;
        useWhenInPlay: boolean;
        text: string;
    }[];
    attacks: {
        name: string;
        cost: import("../../game").CardType.COLORLESS[];
        damage: number;
        text: string;
    }[];
    set: string;
    cardImage: string;
    setNumber: string;
    name: string;
    fullName: string;
    readonly FAST_CALL_MARKER = "FAST_CALL_MARKER";
    reduceEffect(store: StoreLike, state: State, effect: Effect): State;
}
