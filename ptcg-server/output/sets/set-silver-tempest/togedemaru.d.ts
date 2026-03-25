import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../game/store/card/card-types';
import { StoreLike, State } from '../../game';
import { Effect } from '../../game/store/effects/effect';
export declare class Togedemaru extends PokemonCard {
    stage: Stage;
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
    readonly NO_PRIZE_MARKER = "TOGEDEMARU_SIT_NO_PRIZE_MARKER";
    readonly CLEAR_NO_PRIZE_MARKER = "TOGEDEMARU_SIT_CLEAR_NO_PRIZE_MARKER";
    attacks: {
        name: string;
        cost: CardType.LIGHTNING[];
        damage: number;
        text: string;
    }[];
    regulationMark: string;
    set: string;
    setNumber: string;
    cardImage: string;
    name: string;
    fullName: string;
    reduceEffect(store: StoreLike, state: State, effect: Effect): State;
}
