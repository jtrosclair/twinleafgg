import { Attack, CardType, PokemonCard, Stage, State, StoreLike } from '../../game';
import { Effect } from '../../game/store/effects/effect';
export declare class Aggron extends PokemonCard {
    stage: Stage;
    evolvesFrom: string;
    cardType: CardType;
    hp: number;
    weakness: {
        type: CardType.FIRE;
    }[];
    resistance: {
        type: CardType.GRASS;
        value: number;
    }[];
    retreat: CardType.COLORLESS[];
    attacks: Attack[];
    set: string;
    regulationMark: string;
    cardImage: string;
    setNumber: string;
    name: string;
    fullName: string;
    readonly COUNTER_PRESS_MARKER = "COUNTER_PRESS_MARKER";
    readonly CLEAR_COUNTER_PRESS_MARKER = "CLEAR_COUNTER_PRESS_MARKER";
    reduceEffect(store: StoreLike, state: State, effect: Effect): State;
}
