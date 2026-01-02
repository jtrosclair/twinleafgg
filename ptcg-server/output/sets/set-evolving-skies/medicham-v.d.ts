import { PokemonCard, CardType, State, StoreLike, CardTag, Stage } from '../../game';
import { Effect } from '../../game/store/effects/effect';
export declare class MedichamV extends PokemonCard {
    stage: Stage;
    tags: CardTag[];
    cardType: CardType;
    hp: number;
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
    set: string;
    cardImage: string;
    setNumber: string;
    name: string;
    fullName: string;
    readonly YOGA_LOOP_MARKER = "YOGA_LOOP_MARKER";
    readonly YOGA_LOOP_MARKER_2 = "YOGA_LOOP_MARKER_2";
    reduceEffect(store: StoreLike, state: State, effect: Effect): State;
}
