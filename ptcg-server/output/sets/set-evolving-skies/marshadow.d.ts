import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType, CardTag } from '../../game/store/card/card-types';
import { StoreLike, State } from '../../game';
import { Effect } from '../../game/store/effects/effect';
export declare class Marshadow extends PokemonCard {
    tags: CardTag[];
    stage: Stage;
    cardType: CardType;
    hp: number;
    weakness: {
        type: CardType.DARK;
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
    regulationMark: string;
    set: string;
    setNumber: string;
    cardImage: string;
    name: string;
    fullName: string;
    readonly SHADOW_FLICKER_MARKER = "MARSHADOW_EVS_SHADOW_FLICKER_MARKER";
    readonly CLEAR_SHADOW_FLICKER_MARKER = "MARSHADOW_EVS_CLEAR_SHADOW_FLICKER_MARKER";
    reduceEffect(store: StoreLike, state: State, effect: Effect): State;
}
