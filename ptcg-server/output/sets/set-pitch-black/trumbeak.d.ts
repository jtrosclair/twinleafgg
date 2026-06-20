import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../game/store/card/card-types';
import { State, StoreLike } from '../../game';
import { Effect } from '../../game/store/effects/effect';
export declare class Trumbeak extends PokemonCard {
    stage: Stage;
    evolvesFrom: string;
    cardType: CardType;
    hp: number;
    weakness: {
        type: CardType.LIGHTNING;
    }[];
    resistance: {
        type: CardType.FIGHTING;
        value: number;
    }[];
    retreat: CardType.COLORLESS[];
    attacks: {
        name: string;
        cost: CardType.COLORLESS[];
        damage: number;
        text: string;
    }[];
    set: string;
    setNumber: string;
    regulationMark: string;
    cardImage: string;
    name: string;
    fullName: string;
    readonly FLY_MARKER = "M5_TRUMBEAK_FLY";
    readonly CLEAR_FLY_MARKER = "M5_TRUMBEAK_CLEAR_FLY";
    reduceEffect(store: StoreLike, state: State, effect: Effect): State;
}
