import { PokemonCard, Stage, CardType, PowerType, StoreLike, State } from "../../game";
import { Effect } from "../../game/store/effects/effect";
export declare class Moltres extends PokemonCard {
    stage: Stage;
    hp: number;
    cardType: CardType;
    weakness: {
        type: CardType;
    }[];
    retreat: CardType[];
    powers: {
        name: string;
        powerType: PowerType;
        useWhenInPlay: boolean;
        text: string;
    }[];
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
    readonly FIERY_FLAPPING_MARKER = "FIERY_FLAPPING_MARKER";
    reduceEffect(store: StoreLike, state: State, effect: Effect): State;
}
