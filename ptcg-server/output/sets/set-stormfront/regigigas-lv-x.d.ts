import { PokemonCard, Stage, PowerType, StoreLike, State, CardTag } from '../../game';
import { Effect } from '../../game/store/effects/effect';
export declare class RegigigasLVX extends PokemonCard {
    stage: Stage;
    evolvesFrom: string;
    tags: CardTag[];
    cardType: import("../../game").CardType.COLORLESS;
    hp: number;
    weakness: {
        type: import("../../game").CardType.FIGHTING;
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
        cost: (import("../../game").CardType.WATER | import("../../game").CardType.FIGHTING | import("../../game").CardType.METAL | import("../../game").CardType.COLORLESS)[];
        damage: number;
        text: string;
    }[];
    set: string;
    cardImage: string;
    setNumber: string;
    name: string;
    fullName: string;
    readonly SACRIFICE_MARKER = "SACRIFICE_MARKER";
    reduceEffect(store: StoreLike, state: State, effect: Effect): State;
}
