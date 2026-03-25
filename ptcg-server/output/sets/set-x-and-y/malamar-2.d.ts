import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../game/store/card/card-types';
import { StoreLike, State } from '../../game';
import { Effect } from '../../game/store/effects/effect';
export declare class Malamar2 extends PokemonCard {
    readonly MENTAL_PANIC_MARKER = "MALAMAR2_MENTAL_PANIC_MARKER";
    readonly CLEAR_MENTAL_PANIC_MARKER = "MALAMAR2_CLEAR_MENTAL_PANIC_MARKER";
    readonly MENTAL_PANIC_USED_MARKER = "MALAMAR2_MENTAL_PANIC_USED_MARKER";
    stage: Stage;
    evolvesFrom: string;
    cardType: CardType;
    hp: number;
    weakness: {
        type: CardType.FIGHTING;
    }[];
    resistance: {
        type: CardType.PSYCHIC;
        value: number;
    }[];
    retreat: CardType.COLORLESS[];
    attacks: {
        name: string;
        cost: (CardType.DARK | CardType.COLORLESS)[];
        damage: number;
        text: string;
    }[];
    set: string;
    setNumber: string;
    cardImage: string;
    name: string;
    fullName: string;
    reduceEffect(store: StoreLike, state: State, effect: Effect): State;
}
