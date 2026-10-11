import { PokemonCard, Stage, CardType, PowerType, StoreLike, State } from "../../game";
import { Effect } from "../../game/store/effects/effect";
export declare class Nidorina extends PokemonCard {
    stage: Stage;
    evolvesFrom: string;
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
    readonly HAPPY_SHARE_MARKER = "HAPPY_SHARE_MARKER";
    reduceEffect(store: StoreLike, state: State, effect: Effect): State;
}
