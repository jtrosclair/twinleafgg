import { PokemonCard, State, StoreLike, CardTag, Stage } from '../../game';
import { Effect } from '../../game/store/effects/effect';
export declare class MedichamV extends PokemonCard {
    stage: Stage;
    tags: CardTag[];
    cardType: import("../../game").CardType.FIGHTING;
    hp: number;
    weakness: {
        type: import("../../game").CardType.PSYCHIC;
    }[];
    retreat: import("../../game").CardType.COLORLESS[];
    attacks: {
        name: string;
        cost: (import("../../game").CardType.FIGHTING | import("../../game").CardType.COLORLESS)[];
        damage: number;
        text: string;
    }[];
    regulationMark: string;
    set: string;
    cardImage: string;
    setNumber: string;
    name: string;
    fullName: string;
    readonly YOGA_LOOP_MARKER = "YOGA_LOOP_MARKER";
    readonly YOGA_LOOP_MARKER_2 = "YOGA_LOOP_MARKER_2";
    reduceEffect(store: StoreLike, state: State, effect: Effect): State;
}
