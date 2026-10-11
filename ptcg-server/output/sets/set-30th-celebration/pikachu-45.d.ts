import { PokemonCard, Stage, CardType, StoreLike, State } from "../../game";
import { Effect } from "../../game/store/effects/effect";
/** #45 — Nighttime Stroll + Static Shock */
export declare class Pikachu45 extends PokemonCard {
    stage: Stage;
    hp: number;
    cardType: CardType;
    weakness: {
        type: CardType;
    }[];
    retreat: CardType[];
    attacks: {
        name: string;
        cost: CardType[];
        damage: number;
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
