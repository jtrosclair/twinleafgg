import { PokemonCard, Stage, CardTag, CardType, StoreLike, State } from "../../game";
import { Effect } from "../../game/store/effects/effect";
export declare class Salamenceex extends PokemonCard {
    stage: Stage;
    tags: CardTag[];
    evolvesFrom: string;
    hp: number;
    cardType: CardType;
    weakness: never[];
    resistance: never[];
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
