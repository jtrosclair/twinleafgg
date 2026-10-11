import { CardType, PokemonCard, PowerType, Stage, State, StoreLike } from "../../game";
import { Effect } from "../../game/store/effects/effect";
export declare class AlolanExeggutor extends PokemonCard {
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
    reduceEffect(store: StoreLike, state: State, effect: Effect): State;
}
