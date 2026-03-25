import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../game/store/card/card-types';
import { StoreLike, State } from '../../game';
import { Effect } from '../../game/store/effects/effect';
export declare class Cutiefly extends PokemonCard {
    stage: Stage;
    cardType: CardType;
    hp: number;
    weakness: {
        type: CardType.METAL;
    }[];
    resistance: {
        type: CardType.DARK;
        value: number;
    }[];
    retreat: CardType.COLORLESS[];
    readonly FLY_AROUND_MARKER = "CUTIEFLY_FLY_AROUND_MARKER";
    readonly CLEAR_FLY_AROUND_MARKER = "CUTIEFLY_CLEAR_FLY_AROUND_MARKER";
    attacks: {
        name: string;
        cost: CardType.FAIRY[];
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
